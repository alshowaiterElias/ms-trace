import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useAppState } from '../../context/AppStateContext';
import {
  buildIntervalSeries,
  buildRateTimeline,
  calculateSessionMetrics,
} from '../../engine/tappingMetrics';
import type { TappingTestSession } from '../../types/domain';
import {
  formatDecimal,
  formatInteger,
  formatShortDate,
} from '../../utils/formatters';

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{
    name?: string;
    value?: number | string;
    color?: string;
    payload?: Record<string, unknown>;
  }>;
  label?: string | number;
  renderBody: (
    payload: Array<{
      name?: string;
      value?: number | string;
      color?: string;
      payload?: Record<string, unknown>;
    }>,
    label?: string | number,
  ) => React.ReactNode;
}

const CustomChartTooltip: React.FC<ChartTooltipProps> = ({
  active,
  payload,
  label,
  renderBody,
}) => {
  const { isRtl } = useAppState();
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="rounded-xl border border-slate-200 bg-white/95 px-3.5 py-2.5 text-xs shadow-md backdrop-blur-xs"
    >
      {renderBody(payload, label)}
    </div>
  );
};

export const TappingRateLineChart: React.FC<{ session: TappingTestSession }> = ({
  session,
}) => {
  const { language, t } = useAppState();
  const points = buildRateTimeline(session.rawTapTimestamps, session.duration).map(
    (pt) => ({
      ...pt,
      localizedRange: `${formatInteger(pt.startSec, language)}–${formatInteger(
        pt.endSec,
        language,
      )} ${t.common.secondsShort}`,
    }),
  );

  return (
    <section className="hc-card rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-navy-900">
          {t.results.charts.rateTimelineTitle}
        </h3>
        <p className="mt-0.5 text-xs sm:text-sm text-slate-600 hc-muted">
          {t.results.charts.rateTimelineSubtitle}
        </p>
      </div>

      <div className="w-full" dir="ltr">
        <ResponsiveContainer width="100%" height={256}>
          <LineChart data={points} margin={{ top: 10, right: 16, left: 4, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis
              dataKey="localizedRange"
              tick={{ fill: '#475569', fontSize: 12 }}
              axisLine={{ stroke: '#CBD5E1' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#475569', fontSize: 12 }}
              axisLine={{ stroke: '#CBD5E1' }}
              tickLine={false}
              width={40}
              allowDecimals
            />
            <Tooltip
              content={
                <CustomChartTooltip
                  renderBody={(payload) => {
                    const row = payload[0]?.payload as
                      | { localizedRange: string; ratePerSecond: number; tapCount: number }
                      | undefined;
                    if (!row) return null;
                    return (
                      <div className="space-y-1">
                        <div className="font-semibold text-navy-900">{row.localizedRange}</div>
                        <div className="text-teal-700 font-medium">
                          {formatDecimal(row.ratePerSecond, language, 2)}{' '}
                          {t.common.tapsPerSecondUnit}
                        </div>
                        <div className="text-slate-600">
                          {t.results.charts.tapsInWindowTooltip}:{' '}
                          <span className="font-semibold text-slate-900">
                            {formatInteger(row.tapCount, language)}
                          </span>
                        </div>
                      </div>
                    );
                  }}
                />
              }
            />
            <Line
              type="monotone"
              dataKey="ratePerSecond"
              name={t.results.charts.rateYAxis}
              stroke="#0D9488"
              strokeWidth={2.5}
              dot={{ r: 4, fill: '#0F2942', strokeWidth: 2, stroke: '#FFFFFF' }}
              activeDot={{ r: 6, fill: '#0D9488' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
        <span>{t.results.charts.rateXAxis}</span>
        <span>{t.results.charts.rateYAxis}</span>
      </div>
    </section>
  );
};

export const InterTapIntervalChart: React.FC<{ session: TappingTestSession }> = ({
  session,
}) => {
  const { language, t } = useAppState();
  const intervals = buildIntervalSeries(session.rawTapTimestamps, session.duration);

  return (
    <section className="hc-card rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-navy-900">
          {t.results.charts.intervalChartTitle}
        </h3>
        <p className="mt-0.5 text-xs sm:text-sm text-slate-600 hc-muted">
          {t.results.charts.intervalChartSubtitle}
        </p>
      </div>

      {intervals.length === 0 ? (
        <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-600">
          {t.results.charts.intervalEmpty}
        </div>
      ) : (
        <>
          <div className="w-full" dir="ltr">
            <ResponsiveContainer width="100%" height={256}>
              <LineChart
                data={intervals}
                margin={{ top: 10, right: 16, left: 4, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis
                  dataKey="intervalIndex"
                  tick={{ fill: '#475569', fontSize: 12 }}
                  axisLine={{ stroke: '#CBD5E1' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#475569', fontSize: 12 }}
                  axisLine={{ stroke: '#CBD5E1' }}
                  tickLine={false}
                  width={46}
                />
                {session.meanInterTapInterval !== null && (
                  <ReferenceLine
                    y={session.meanInterTapInterval}
                    stroke="#0D9488"
                    strokeDasharray="5 4"
                    strokeWidth={1.75}
                  />
                )}
                <Tooltip
                  content={
                    <CustomChartTooltip
                      renderBody={(payload) => {
                        const row = payload[0]?.payload as
                          | {
                              intervalIndex: number;
                              elapsedSeconds: number;
                              intervalMs: number;
                            }
                          | undefined;
                        if (!row) return null;
                        return (
                          <div className="space-y-1">
                            <div className="font-semibold text-navy-900">
                              {t.results.charts.intervalXAxis} {formatInteger(row.intervalIndex, language)}
                            </div>
                            <div className="text-navy-800 font-medium">
                              {formatInteger(row.intervalMs, language)} {t.common.msUnit}
                            </div>
                            <div className="text-slate-500">
                              {formatDecimal(row.elapsedSeconds, language, 2)}{' '}
                              {t.common.secondsShort}
                            </div>
                          </div>
                        );
                      }}
                    />
                  }
                />
                <Line
                  type="monotone"
                  dataKey="intervalMs"
                  name={t.results.charts.intervalYAxis}
                  stroke="#0F2942"
                  strokeWidth={2}
                  dot={intervals.length <= 45 ? { r: 2.5, fill: '#0F2942' } : false}
                  activeDot={{ r: 5, fill: '#0D9488' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
            <span>{t.results.charts.intervalXAxis}</span>
            {session.meanInterTapInterval !== null && (
              <span className="inline-flex items-center gap-1.5 font-medium text-teal-800">
                <span className="inline-block h-0.5 w-4 border-t-2 border-dashed border-teal-600" />
                {t.results.charts.meanReferenceLabel}:{' '}
                {formatDecimal(session.meanInterTapInterval, language, 1)} {t.common.msUnit}
              </span>
            )}
          </div>
        </>
      )}
    </section>
  );
};

export const SegmentComparisonChart: React.FC<{ session: TappingTestSession }> = ({
  session,
}) => {
  const { language, t } = useAppState();
  const details = calculateSessionMetrics(session.rawTapTimestamps, session.duration)
    .segmentDetails;

  const labels = [
    t.results.charts.segment1Label,
    t.results.charts.segment2Label,
    t.results.charts.segment3Label,
  ];

  const data = details.map((seg, idx) => ({
    name: labels[idx],
    ratePerSecond: Number(seg.ratePerSecond.toFixed(2)),
    tapCount: seg.tapCount,
  }));

  const barColors = ['#0F2942', '#1E4D78', '#0D9488'];

  return (
    <section className="hc-card rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-navy-900">
          {t.results.charts.segmentChartTitle}
        </h3>
        <p className="mt-0.5 text-xs sm:text-sm text-slate-600 hc-muted">
          {t.results.charts.segmentChartSubtitle}
        </p>
      </div>

      <div className="w-full" dir="ltr">
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={data} margin={{ top: 10, right: 16, left: 4, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: '#475569', fontSize: 11 }}
              axisLine={{ stroke: '#CBD5E1' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#475569', fontSize: 12 }}
              axisLine={{ stroke: '#CBD5E1' }}
              tickLine={false}
              width={40}
            />
            <Tooltip
              content={
                <CustomChartTooltip
                  renderBody={(payload) => {
                    const row = payload[0]?.payload as
                      | { name: string; ratePerSecond: number; tapCount: number }
                      | undefined;
                    if (!row) return null;
                    return (
                      <div className="space-y-1">
                        <div className="font-semibold text-navy-900">{row.name}</div>
                        <div className="text-teal-700 font-medium">
                          {formatDecimal(row.ratePerSecond, language, 2)}{' '}
                          {t.common.tapsPerSecondUnit}
                        </div>
                        <div className="text-slate-600">
                          {t.results.charts.segmentTapsTooltip}:{' '}
                          <span className="font-semibold text-slate-900">
                            {formatInteger(row.tapCount, language)}
                          </span>
                        </div>
                      </div>
                    );
                  }}
                />
              }
            />
            <Bar dataKey="ratePerSecond" radius={[8, 8, 0, 0]} maxBarSize={64}>
              {data.map((_, index) => (
                <Cell key={`seg-${index}`} fill={barColors[index % barColors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

export const LongitudinalTrendChart: React.FC<{
  sessions: TappingTestSession[];
  title: string;
  subtitle: string;
  cautionNote: string;
  emptyText: string;
}> = ({ sessions, title, subtitle, cautionNote, emptyText }) => {
  const { language, t } = useAppState();

  const chronological = sessions
    .slice()
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    .map((s) => ({
      id: s.id,
      dateLabel: formatShortDate(s.timestamp, language),
      speed: Number(s.averageTapsPerSecond.toFixed(2)),
      cv:
        s.intervalCoefficientOfVariation !== null
          ? Number(s.intervalCoefficientOfVariation.toFixed(1))
          : null,
      totalTaps: s.totalTapCount,
      hand: s.handTested === 'right' ? t.common.rightHand : t.common.leftHand,
      origin:
        s.dataOrigin === 'recorded_live'
          ? t.common.liveRecordedBadge
          : t.common.demoMockBadge,
    }));

  return (
    <section className="hc-card rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-navy-900">{title}</h3>
        <p className="mt-0.5 text-xs sm:text-sm text-slate-600 hc-muted">{subtitle}</p>
      </div>

      {chronological.length < 2 ? (
        <div className="flex h-60 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-600">
          {emptyText}
        </div>
      ) : (
        <div className="w-full" dir="ltr">
          <ResponsiveContainer width="100%" height={268}>
            <LineChart
              data={chronological}
              margin={{ top: 10, right: 16, left: 4, bottom: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis
                dataKey="dateLabel"
                tick={{ fill: '#475569', fontSize: 12 }}
                axisLine={{ stroke: '#CBD5E1' }}
                tickLine={false}
              />
              <YAxis
                yAxisId="left"
                tick={{ fill: '#0F2942', fontSize: 12 }}
                axisLine={{ stroke: '#CBD5E1' }}
                tickLine={false}
                width={42}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fill: '#0D9488', fontSize: 12 }}
                axisLine={{ stroke: '#CBD5E1' }}
                tickLine={false}
                width={42}
              />
              <Tooltip
                content={
                  <CustomChartTooltip
                    renderBody={(payload) => {
                      const row = payload[0]?.payload as
                        | {
                            dateLabel: string;
                            speed: number;
                            cv: number | null;
                            totalTaps: number;
                            hand: string;
                            origin: string;
                          }
                        | undefined;
                      if (!row) return null;
                      return (
                        <div className="space-y-1">
                          <div className="font-semibold text-navy-900">
                            {row.dateLabel} • {row.hand}
                          </div>
                          <div className="text-navy-800">
                            {t.history.trendSpeedSeries}:{' '}
                            <span className="font-semibold">
                              {formatDecimal(row.speed, language, 2)}
                            </span>
                          </div>
                          <div className="text-teal-700">
                            {t.history.trendCvSeries}:{' '}
                            <span className="font-semibold">
                              {row.cv !== null
                                ? `${formatDecimal(row.cv, language, 1)}%`
                                : t.common.notAvailable}
                            </span>
                          </div>
                          <div className="text-slate-600">
                            {t.patientDashboard.totalTapsLabel}:{' '}
                            {formatInteger(row.totalTaps, language)}
                          </div>
                          <div className="text-[11px] text-slate-500">{row.origin}</div>
                        </div>
                      );
                    }}
                  />
                }
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="speed"
                name={t.history.trendSpeedSeries}
                stroke="#0F2942"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#0F2942' }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="cv"
                name={t.history.trendCvSeries}
                stroke="#0D9488"
                strokeWidth={2}
                strokeDasharray="4 3"
                dot={{ r: 4, fill: '#0D9488' }}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600 border border-slate-200/80">
        {cautionNote}
      </p>
    </section>
  );
};

