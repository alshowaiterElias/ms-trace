import { describe, expect, it } from 'vitest';
import { calculateSessionMetrics } from '../engine/tappingMetrics';
import { translations } from '../i18n/translations';
import { formatDate, formatDecimal } from '../utils/formatters';
import { createInitialDemoState } from './mockData';

function collectLeafValues(obj: unknown, prefix = ''): Array<{ path: string; value: string }> {
  if (typeof obj === 'string') {
    return [{ path: prefix, value: obj }];
  }
  if (Array.isArray(obj)) {
    return obj.flatMap((item, idx) => collectLeafValues(item, `${prefix}[${idx}]`));
  }
  if (obj && typeof obj === 'object') {
    return Object.entries(obj).flatMap(([k, v]) =>
      collectLeafValues(v, prefix ? `${prefix}.${k}` : k),
    );
  }
  return [];
}

describe('demo data & bilingual integrity', () => {
  it('derives every mock session metric directly from its rawTapTimestamps', () => {
    const demo = createInitialDemoState();
    expect(demo.patients.length).toBeGreaterThanOrEqual(2);
    expect(demo.doctors.length).toBeGreaterThanOrEqual(1);

    for (const session of demo.sessions) {
      expect(session.dataOrigin).toBe('demo_mock');
      const recomputed = calculateSessionMetrics(
        session.rawTapTimestamps,
        session.duration,
      );
      expect(session.totalTapCount).toBe(recomputed.totalTapCount);
      expect(session.averageTapsPerSecond).toBeCloseTo(recomputed.averageTapsPerSecond, 8);
      expect(session.segmentRates).toEqual(recomputed.segmentRates);
      expect(session.performanceChangePercentage).toBe(
        recomputed.performanceChangePercentage,
      );
    }
  });

  it('has complete, non-empty bilingual translations in both English and Arabic', () => {
    const enLeaves = collectLeafValues(translations.en);
    const arLeaves = collectLeafValues(translations.ar);

    expect(enLeaves.length).toBe(arLeaves.length);

    const arMap = new Map(arLeaves.map((item) => [item.path, item.value]));
    for (const { path, value } of enLeaves) {
      expect(value.trim().length, `Empty EN string at ${path}`).toBeGreaterThan(0);
      const arValue = arMap.get(path);
      expect(arValue, `Missing AR key at ${path}`).toBeDefined();
      expect(arValue!.trim().length, `Empty AR string at ${path}`).toBeGreaterThan(0);
    }
  });

  it('formats Arabic numbers using Western digits (0-9) and Gregorian Arabic dates', () => {
    const formattedNum = formatDecimal(12.34, 'ar', 2);
    expect(formattedNum).toMatch(/[0-9]/);
    expect(formattedNum).not.toMatch(/[٠-٩]/);

    const formattedDate = formatDate('2026-11-18T12:00:00.000Z', 'ar');
    expect(formattedDate).toMatch(/[0-9]/);
    expect(formattedDate).not.toMatch(/[٠-٩]/);
    expect(formattedDate).toContain('2026');
  });
});

