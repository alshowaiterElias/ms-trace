import { describe, expect, it } from 'vitest';
import {
  buildIntervalSeries,
  buildRateTimeline,
  calculateInterTapIntervals,
  calculateSessionMetrics,
} from './tappingMetrics';

describe('tappingMetrics engine', () => {
  it('computes exact total count, average speed, intervals, CV, and segment performance change', () => {
    // 10 taps in 0-10s (1.0/s), 10 taps in 10-20s (1.0/s), 5 taps in 20-30s (0.5/s)
    const timestamps = [
      500, 1500, 2500, 3500, 4500, 5500, 6500, 7500, 8500, 9500,
      10500, 11500, 12500, 13500, 14500, 15500, 16500, 17500, 18500, 19500,
      21000, 23000, 25000, 27000, 29000,
    ];

    const metrics = calculateSessionMetrics(timestamps, 30);

    expect(metrics.totalTapCount).toBe(25);
    expect(metrics.averageTapsPerSecond).toBeCloseTo(25 / 30, 5);
    expect(metrics.segmentRates[0]).toBeCloseTo(1.0, 5);
    expect(metrics.segmentRates[1]).toBeCloseTo(1.0, 5);
    expect(metrics.segmentRates[2]).toBeCloseTo(0.5, 5);
    // Decline = ((1.0 - 0.5) / 1.0) * 100 = 50%
    expect(metrics.performanceChangePercentage).toBeCloseTo(50, 5);
    expect(metrics.meanInterTapInterval).not.toBeNull();
    expect(metrics.intervalStandardDeviation).not.toBeNull();
    expect(metrics.intervalCoefficientOfVariation).not.toBeNull();
  });

  it('computes 0% CV for perfectly uniform spacing', () => {
    const timestamps = [1000, 1250, 1500, 1750, 2000];
    const metrics = calculateSessionMetrics(timestamps, 30);
    expect(metrics.meanInterTapInterval).toBe(250);
    expect(metrics.intervalStandardDeviation).toBe(0);
    expect(metrics.intervalCoefficientOfVariation).toBe(0);
  });

  it('returns negative percentage when tapping speeds up in the final segment', () => {
    // 4 taps in seg 1 (0.4/s), 4 taps in seg 2 (0.4/s), 8 taps in seg 3 (0.8/s)
    const timestamps = [
      1000, 3000, 5000, 7000,
      11000, 13000, 15000, 17000,
      20500, 21500, 22500, 23500, 24500, 25500, 26500, 27500,
    ];
    const metrics = calculateSessionMetrics(timestamps, 30);
    // ((0.4 - 0.8) / 0.4) * 100 = -100% (increase in tapping rate)
    expect(metrics.performanceChangePercentage).toBeCloseTo(-100, 5);
  });

  it('returns null variability and performance change when insufficient taps (< 3) or initial rate is 0', () => {
    const zeroMetrics = calculateSessionMetrics([], 30);
    expect(zeroMetrics.totalTapCount).toBe(0);
    expect(zeroMetrics.averageTapsPerSecond).toBe(0);
    expect(zeroMetrics.meanInterTapInterval).toBeNull();
    expect(zeroMetrics.intervalStandardDeviation).toBeNull();
    expect(zeroMetrics.intervalCoefficientOfVariation).toBeNull();
    expect(zeroMetrics.performanceChangePercentage).toBeNull();

    const twoTaps = calculateSessionMetrics([1000, 1500], 30);
    expect(twoTaps.totalTapCount).toBe(2);
    expect(twoTaps.meanInterTapInterval).toBe(500);
    expect(twoTaps.intervalStandardDeviation).toBeNull();
    expect(twoTaps.intervalCoefficientOfVariation).toBeNull();
    expect(twoTaps.performanceChangePercentage).toBeNull();

    // Taps only in segments 2 and 3 => initial rate is 0 => performanceChangePercentage must be null
    const zeroInitial = calculateSessionMetrics([12000, 15000, 22000, 25000], 30);
    expect(zeroInitial.segmentRates[0]).toBe(0);
    expect(zeroInitial.performanceChangePercentage).toBeNull();
    expect(zeroInitial.intervalCoefficientOfVariation).not.toBeNull();
  });

  it('builds accurate rate timeline buckets and interval series', () => {
    const timestamps = [1000, 2000, 6000, 11000, 30000];
    const timeline = buildRateTimeline(timestamps, 30, 5);
    expect(timeline).toHaveLength(6);
    expect(timeline[0].tapCount).toBe(2); // 0-5s
    expect(timeline[1].tapCount).toBe(1); // 5-10s
    expect(timeline[2].tapCount).toBe(1); // 10-15s
    expect(timeline[5].tapCount).toBe(1); // 25-30s (inclusive of 30000ms)

    const intervals = calculateInterTapIntervals(timestamps, 30);
    expect(intervals).toEqual([1000, 4000, 5000, 19000]);

    const series = buildIntervalSeries(timestamps, 30);
    expect(series).toHaveLength(4);
    expect(series[0]).toEqual({
      intervalIndex: 1,
      tapNumber: 2,
      elapsedSeconds: 2,
      intervalMs: 1000,
    });
  });
});

