/**
 * Clinical prototype protocol configuration for the Digital Finger Tapping Test.
 * Note: The duration and segment intervals are configurable here because the final
 * clinical protocol must be validated and confirmed by qualified medical professionals.
 */
export const TAPPING_TEST_CONFIG = {
  /** Official timed test duration in seconds (configurable for future clinical validation). */
  defaultDurationSeconds: 30,
  /** Number of equal time segments used for fatigue / performance-change analysis. */
  segmentCount: 3,
  /** Time-window size in seconds for the tapping-rate timeline chart. */
  rateTimelineBucketSeconds: 5,
  /** Minimum interval (ms) between consecutive accepted pointer events to reject hardware bounce. */
  minDebounceMs: 25,
  /** Minimum taps required to compute variability (SD, CV) and performance-change percentages reliably. */
  minTapsForVariability: 3,
} as const;

