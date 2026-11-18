import { TAPPING_TEST_CONFIG } from '../config/testProtocol';
import type {
  IntervalPoint,
  RateTimelinePoint,
  SegmentRateDetail,
  TappingTestSession,
} from '../types/domain';

export interface CalculatedTappingMetrics {
  totalTapCount: number;
  averageTapsPerSecond: number;
  meanInterTapInterval: number | null;
  intervalStandardDeviation: number | null;
  intervalCoefficientOfVariation: number | null;
  segmentRates: [number, number, number];
  segmentDetails: [SegmentRateDetail, SegmentRateDetail, SegmentRateDetail];
  performanceChangePercentage: number | null;
}

/**
 * Sanitizes and sorts raw tap timestamps into monotonic milliseconds within [0, durationMs].
 */
export function normalizeTapTimestamps(
  rawTapTimestamps: readonly number[],
  durationSeconds: number,
): number[] {
  const durationMs = Math.max(0, durationSeconds * 1000);
  return rawTapTimestamps
    .filter((t) => Number.isFinite(t) && t >= 0 && t <= durationMs)
    .slice()
    .sort((a, b) => a - b);
}

/**
 * Computes consecutive inter-tap intervals (ms) from sorted raw timestamps.
 */
export function calculateInterTapIntervals(
  rawTapTimestamps: readonly number[],
  durationSeconds: number = TAPPING_TEST_CONFIG.defaultDurationSeconds,
): number[] {
  const sorted = normalizeTapTimestamps(rawTapTimestamps, durationSeconds);
  if (sorted.length < 2) {
    return [];
  }

  const intervals: number[] = [];
  for (let i = 1; i < sorted.length; i++) {
    intervals.push(sorted[i] - sorted[i - 1]);
  }
  return intervals;
}

/**
 * Computes all derived clinical-prototype tapping metrics solely from raw timestamps and duration.
 * Keeping derived metrics separate from raw timestamps guarantees reproducibility if algorithms evolve.
 */
export function calculateSessionMetrics(
  rawTapTimestamps: readonly number[],
  durationSeconds: number = TAPPING_TEST_CONFIG.defaultDurationSeconds,
): CalculatedTappingMetrics {
  const safeDuration = Math.max(1, durationSeconds);
  const sorted = normalizeTapTimestamps(rawTapTimestamps, safeDuration);
  const totalTapCount = sorted.length;
  const averageTapsPerSecond = totalTapCount / safeDuration;

  const intervals = calculateInterTapIntervals(sorted, safeDuration);
  const meanInterTapInterval =
    intervals.length >= 1
      ? intervals.reduce((acc, value) => acc + value, 0) / intervals.length
      : null;

  let intervalStandardDeviation: number | null = null;
  let intervalCoefficientOfVariation: number | null = null;

  // Require at least 3 taps (>= 2 intervals) so spread estimation is mathematically meaningful.
  if (
    totalTapCount >= TAPPING_TEST_CONFIG.minTapsForVariability &&
    intervals.length >= 2 &&
    meanInterTapInterval !== null
  ) {
    const squaredDiffs = intervals.reduce((acc, value) => {
      const diff = value - meanInterTapInterval;
      return acc + diff * diff;
    }, 0);
    intervalStandardDeviation = Math.sqrt(squaredDiffs / (intervals.length - 1));

    if (meanInterTapInterval > 0) {
      intervalCoefficientOfVariation = (intervalStandardDeviation / meanInterTapInterval) * 100;
    }
  }

  // Divide test duration into 3 equal segments (e.g., 0-10s, 10-20s, 20-30s)
  const segmentSec = safeDuration / TAPPING_TEST_CONFIG.segmentCount;
  const segmentMs = segmentSec * 1000;
  const durationMs = safeDuration * 1000;
  const segmentCounts: [number, number, number] = [0, 0, 0];

  for (const ts of sorted) {
    if (ts < segmentMs) {
      segmentCounts[0] += 1;
    } else if (ts < segmentMs * 2) {
      segmentCounts[1] += 1;
    } else if (ts <= durationMs) {
      segmentCounts[2] += 1;
    }
  }

  const segmentRates: [number, number, number] = [
    segmentCounts[0] / segmentSec,
    segmentCounts[1] / segmentSec,
    segmentCounts[2] / segmentSec,
  ];

  const segmentDetails: [SegmentRateDetail, SegmentRateDetail, SegmentRateDetail] = [
    {
      segmentIndex: 1,
      startSec: 0,
      endSec: Math.round(segmentSec * 10) / 10,
      tapCount: segmentCounts[0],
      ratePerSecond: segmentRates[0],
    },
    {
      segmentIndex: 2,
      startSec: Math.round(segmentSec * 10) / 10,
      endSec: Math.round(segmentSec * 2 * 10) / 10,
      tapCount: segmentCounts[1],
      ratePerSecond: segmentRates[1],
    },
    {
      segmentIndex: 3,
      startSec: Math.round(segmentSec * 2 * 10) / 10,
      endSec: safeDuration,
      tapCount: segmentCounts[2],
      ratePerSecond: segmentRates[2],
    },
  ];

  // Percentage decline = ((Initial Rate - Final Rate) / Initial Rate) * 100
  // Only valid when Initial Rate > 0 and sufficient taps exist.
  let performanceChangePercentage: number | null = null;
  if (
    totalTapCount >= TAPPING_TEST_CONFIG.minTapsForVariability &&
    segmentRates[0] > 0
  ) {
    performanceChangePercentage =
      ((segmentRates[0] - segmentRates[2]) / segmentRates[0]) * 100;
  }

  return {
    totalTapCount,
    averageTapsPerSecond,
    meanInterTapInterval,
    intervalStandardDeviation,
    intervalCoefficientOfVariation,
    segmentRates,
    segmentDetails,
    performanceChangePercentage,
  };
}

/**
 * Builds time-windowed tapping rate points (default 5-second buckets) for line chart visualization.
 */
export function buildRateTimeline(
  rawTapTimestamps: readonly number[],
  durationSeconds: number = TAPPING_TEST_CONFIG.defaultDurationSeconds,
  bucketSeconds: number = TAPPING_TEST_CONFIG.rateTimelineBucketSeconds,
): RateTimelinePoint[] {
  const sorted = normalizeTapTimestamps(rawTapTimestamps, durationSeconds);
  const bucketCount = Math.max(1, Math.ceil(durationSeconds / bucketSeconds));
  const points: RateTimelinePoint[] = [];

  for (let i = 0; i < bucketCount; i++) {
    const startSec = i * bucketSeconds;
    const endSec = Math.min(durationSeconds, (i + 1) * bucketSeconds);
    const windowDuration = Math.max(0.001, endSec - startSec);
    const startMs = startSec * 1000;
    const endMs = endSec * 1000;

    const tapCount = sorted.filter((ts) => {
      if (i === bucketCount - 1) {
        return ts >= startMs && ts <= endMs;
      }
      return ts >= startMs && ts < endMs;
    }).length;

    points.push({
      bucketIndex: i + 1,
      startSec,
      endSec,
      rangeLabel: `${startSec}–${endSec}s`,
      tapCount,
      ratePerSecond: Number((tapCount / windowDuration).toFixed(2)),
    });
  }

  return points;
}

/**
 * Builds an ordered list of consecutive inter-tap intervals for spacing visualization.
 */
export function buildIntervalSeries(
  rawTapTimestamps: readonly number[],
  durationSeconds: number = TAPPING_TEST_CONFIG.defaultDurationSeconds,
): IntervalPoint[] {
  const sorted = normalizeTapTimestamps(rawTapTimestamps, durationSeconds);
  if (sorted.length < 2) {
    return [];
  }

  const points: IntervalPoint[] = [];
  for (let i = 1; i < sorted.length; i++) {
    points.push({
      intervalIndex: i,
      tapNumber: i + 1,
      elapsedSeconds: Number((sorted[i] / 1000).toFixed(2)),
      intervalMs: Math.round(sorted[i] - sorted[i - 1]),
    });
  }
  return points;
}

/**
 * Re-computes derived metrics on an existing session from its raw timestamps.
 */
export function hydrateSessionMetrics(session: TappingTestSession): TappingTestSession {
  const derived = calculateSessionMetrics(session.rawTapTimestamps, session.duration);
  return {
    ...session,
    totalTapCount: derived.totalTapCount,
    averageTapsPerSecond: derived.averageTapsPerSecond,
    meanInterTapInterval: derived.meanInterTapInterval,
    intervalStandardDeviation: derived.intervalStandardDeviation,
    intervalCoefficientOfVariation: derived.intervalCoefficientOfVariation,
    segmentRates: derived.segmentRates,
    performanceChangePercentage: derived.performanceChangePercentage,
  };
}

