import React from 'react';
import {
  Activity,
  AlertCircle,
  Calendar,
  Clock,
  Gauge,
  Hash,
  MessageSquareText,
  Share2,
  TrendingDown,
  TrendingUp,
  Waves,
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { calculateSessionMetrics } from '../../engine/tappingMetrics';
import type { DoctorReview, TappingTestSession } from '../../types/domain';
import { formatDateTime, formatDecimal, formatInteger } from '../../utils/formatters';
import {
  InterTapIntervalChart,
  SegmentComparisonChart,
  TappingRateLineChart,
} from '../charts/SessionCharts';
import { DataOriginBadge, HandBadge, ReviewStatusBadge } from '../common/StatusBadges';

interface SessionResultsDetailProps {
  session: TappingTestSession;
  review?: DoctorReview;
  showDoctorActions?: boolean;
  onRetakeTest?: () => void;
  onShareWithDoctor?: (sessionId: string) => void;
}

export const SessionResultsDetail: React.FC<SessionResultsDetailProps> = ({
  session,
  review,
  showDoctorActions = true,
  onRetakeTest,
  onShareWithDoctor,
}) => {
  const { language, t } = useAppState();
  const derived = calculateSessionMetrics(session.rawTapTimestamps, session.duration);

  const renderPerformanceChangeInterpretation = (pct: number | null) => {
    if (pct === null) return t.results.metrics.fatigueInsufficient;
    if (Math.abs(pct) < 3) return t.results.metrics.fatigueStableNote;
    if (pct > 0) return t.results.metrics.fatigueDeclineNote;
    return t.results.metrics.fatigueIncreaseNote;
  };

  const perfChange = session.performanceChangePercentage;
  const inputLabel = session.inputMethodSummary
    ? t.results.inputMethods[session.inputMethodSummary]
    : t.results.inputMethods.pointer;

  return (
    <div className="space-y-6">
      {/* Session Context Header Card */}
      <div className="hc-card rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <DataOriginBadge origin={session.dataOrigin} />
              <HandBadge hand={session.handTested} />
              <ReviewStatusBadge
                sharedWithDoctor={session.sharedWithDoctor}
                reviewedStatus={session.reviewedStatus}
              />
            </div>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs sm:text-sm text-slate-600 pt-1">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-slate-400" aria-hidden="true" />
                <span>
                  {t.results.recordedAtLabel}:{' '}
                  <strong className="font-medium text-slate-900">
                    {formatDateTime(session.timestamp, language)}
                  </strong>
                </span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-slate-400" aria-hidden="true" />
                <span>
                  {t.results.durationLabel}:{' '}
                  <strong className="font-medium text-slate-900 tabular-nums">
                    {formatInteger(session.duration, language)} {t.common.secondsUnit}
                  </strong>
                </span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Activity className="h-4 w-4 text-slate-400" aria-hidden="true" />
                <span>
                  {t.results.inputMethodLabel}:{' '}
                  <strong className="font-medium text-slate-900">{inputLabel}</strong>
                </span>
              </span>
            </div>
          </div>

          {showDoctorActions && (
            <div className="flex flex-wrap items-center gap-2.5">
              {onRetakeTest && (
                <button
                  type="button"
                  onClick={onRetakeTest}
                  className="min-h-[44px] rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-teal-600"
                >
                  {t.results.retakeTestBtn}
                </button>
              )}

              {onShareWithDoctor && !session.sharedWithDoctor && (
                <button
                  type="button"
                  onClick={() => onShareWithDoctor(session.id)}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-teal-600 px-5 text-sm font-semibold text-white shadow-xs transition hover:bg-teal-700 focus-visible:outline-2 focus-visible:outline-teal-600"
                >
                  <Share2 className="h-4 w-4" aria-hidden="true" />
                  <span>{t.results.saveAndShareBtn}</span>
                </button>
              )}

              {session.sharedWithDoctor && (
                <span className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-teal-200 bg-teal-50 px-4 text-sm font-semibold text-teal-900">
                  <Share2 className="h-4 w-4 text-teal-700" aria-hidden="true" />
                  <span>{t.results.alreadySharedBtn}</span>
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Doctor Clinical Review Note (if reviewed) */}
      {review && (
        <div className="hc-card rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5">
          <div className="flex items-start gap-3">
            <MessageSquareText
              className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700"
              aria-hidden="true"
            />
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-semibold text-emerald-950">
                  {t.results.doctorNoteCardTitle}
                </h3>
                <span className="text-xs text-emerald-800">
                  ({t.results.reviewedOnPrefix} {formatDateTime(review.reviewDate, language)})
                </span>
              </div>
              <p className="text-sm leading-relaxed text-slate-800">
                {review.demoNoteLocalized ? review.demoNoteLocalized[language] : review.note}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Top Primary Summary KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="hc-card rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {t.results.metrics.totalTapsTitle}
            </span>
            <Hash className="h-4 w-4 text-navy-700" aria-hidden="true" />
          </div>
          <div className="mt-2 text-3xl font-bold text-navy-900 tabular-nums">
            {formatInteger(session.totalTapCount, language)}
          </div>
          <p className="mt-1 text-xs text-slate-600 hc-muted">{t.results.metrics.totalTapsDesc}</p>
        </div>

        <div className="hc-card rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {t.results.metrics.avgSpeedTitle}
            </span>
            <Gauge className="h-4 w-4 text-teal-700" aria-hidden="true" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-3xl font-bold text-navy-900 tabular-nums">
              {formatDecimal(session.averageTapsPerSecond, language, 2)}
            </span>
            <span className="text-sm font-medium text-slate-600">
              {t.common.tapsPerSecondUnit}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-600 hc-muted">{t.results.metrics.avgSpeedDesc}</p>
        </div>

        <div className="hc-card rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {t.results.metrics.meanIntervalTitle}
            </span>
            <Clock className="h-4 w-4 text-navy-700" aria-hidden="true" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            {session.meanInterTapInterval !== null ? (
              <>
                <span className="text-3xl font-bold text-navy-900 tabular-nums">
                  {formatDecimal(session.meanInterTapInterval, language, 1)}
                </span>
                <span className="text-sm font-medium text-slate-600">{t.common.msUnit}</span>
              </>
            ) : (
              <span className="text-lg font-semibold text-slate-500">
                {t.common.notAvailable}
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-slate-600 hc-muted">
            {t.results.metrics.meanIntervalDesc}
          </p>
        </div>

        <div className="hc-card rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {t.results.metrics.rhythmCvLabel}
            </span>
            <Waves className="h-4 w-4 text-teal-700" aria-hidden="true" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            {session.intervalCoefficientOfVariation !== null ? (
              <>
                <span className="text-3xl font-bold text-navy-900 tabular-nums">
                  {formatDecimal(session.intervalCoefficientOfVariation, language, 1)}
                </span>
                <span className="text-sm font-medium text-slate-600">
                  {t.common.percentUnit}
                </span>
              </>
            ) : (
              <span className="text-lg font-semibold text-slate-500">
                {t.common.insufficientData}
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-slate-600 hc-muted">
            {t.results.metrics.rhythmSdLabel}:{' '}
            {session.intervalStandardDeviation !== null
              ? `${formatDecimal(session.intervalStandardDeviation, language, 1)} ${t.common.msUnit}`
              : t.common.notAvailable}
          </p>
        </div>
      </div>

      {/* Rhythm Consistency & Performance Change Explanatory Cards */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="hc-card rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-navy-50 text-navy-900">
              <Waves className="h-5 w-5" aria-hidden="true" />
            </div>
            <h3 className="text-base font-semibold text-navy-900">
              {t.results.metrics.rhythmTitle}
            </h3>
          </div>

          {session.intervalCoefficientOfVariation !== null &&
          session.intervalStandardDeviation !== null ? (
            <div className="grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3.5 border border-slate-200/80">
              <div>
                <div className="text-xs text-slate-500">{t.results.metrics.rhythmSdLabel}</div>
                <div className="mt-0.5 text-lg font-bold text-navy-900 tabular-nums">
                  {formatDecimal(session.intervalStandardDeviation, language, 1)} {t.common.msUnit}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500">{t.results.metrics.rhythmCvLabel}</div>
                <div className="mt-0.5 text-lg font-bold text-teal-700 tabular-nums">
                  {formatDecimal(session.intervalCoefficientOfVariation, language, 1)}%
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-sm text-amber-950">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
              <span>{t.results.metrics.rhythmInsufficient}</span>
            </div>
          )}

          <p className="text-xs font-medium text-slate-600">{t.results.metrics.rhythmFormulaTitle}</p>
          <p className="text-xs sm:text-sm leading-relaxed text-slate-700">
            {t.results.metrics.rhythmExplanation}
          </p>
        </div>

        <div className="hc-card rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-teal-800">
              {perfChange !== null && perfChange < 0 ? (
                <TrendingUp className="h-5 w-5" aria-hidden="true" />
              ) : (
                <TrendingDown className="h-5 w-5" aria-hidden="true" />
              )}
            </div>
            <h3 className="text-base font-semibold text-navy-900">
              {t.results.metrics.fatigueTitle}
            </h3>
          </div>

          {perfChange !== null ? (
            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3.5 border border-slate-200/80">
              <div>
                <div className="text-xs text-slate-500">
                  {t.results.charts.segment1Label} → {t.results.charts.segment3Label}
                </div>
                <div className="mt-0.5 text-2xl font-bold text-navy-900 tabular-nums">
                  {perfChange > 0 ? '+' : ''}
                  {formatDecimal(perfChange, language, 1)}%
                </div>
              </div>
              <div className="text-end text-xs text-slate-600 tabular-nums">
                <div>
                  {formatDecimal(session.segmentRates[0], language, 2)} →{' '}
                  {formatDecimal(session.segmentRates[2], language, 2)}{' '}
                  {t.common.tapsPerSecondUnit}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-sm text-amber-950">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
              <span>{t.results.metrics.fatigueInsufficient}</span>
            </div>
          )}

          <p className="text-xs font-medium text-slate-600">
            {t.results.metrics.fatigueFormulaLabel}
          </p>
          <p className="text-xs sm:text-sm leading-relaxed text-slate-700">
            {renderPerformanceChangeInterpretation(perfChange)}
          </p>
          <p className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600 border border-slate-200/70">
            {t.results.metrics.fatigueScientificCaution}
          </p>
        </div>
      </div>

      {/* Primary Charts Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <TappingRateLineChart session={session} />
        <SegmentComparisonChart session={session} />
      </div>

      {/* Inter-Tap Spacing Full-Width Visualization */}
      <InterTapIntervalChart session={session} />

      {/* Detailed Numerical Breakdown Table */}
      <section className="hc-card rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="mb-4">
          <h3 className="text-base font-semibold text-navy-900">
            {t.results.charts.breakdownTitle}
          </h3>
          <p className="mt-0.5 text-xs sm:text-sm text-slate-600 hc-muted">
            {t.results.charts.breakdownSubtitle}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-start text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <th className="py-2.5 pe-4 text-start">{t.results.charts.metricColumn}</th>
                <th className="py-2.5 pe-4 text-start">{t.results.charts.valueColumn}</th>
                <th className="py-2.5 text-start">{t.results.charts.notesColumn}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-3 pe-4 font-medium text-slate-900">
                  {t.results.metrics.totalTapsTitle}
                </td>
                <td className="py-3 pe-4 font-semibold text-navy-900 tabular-nums">
                  {formatInteger(session.totalTapCount, language)} {t.common.tapsUnit}
                </td>
                <td className="py-3 text-slate-600">{t.results.metrics.totalTapsDesc}</td>
              </tr>
              <tr>
                <td className="py-3 pe-4 font-medium text-slate-900">
                  {t.results.metrics.avgSpeedTitle}
                </td>
                <td className="py-3 pe-4 font-semibold text-navy-900 tabular-nums">
                  {formatDecimal(session.averageTapsPerSecond, language, 2)}{' '}
                  {t.common.tapsPerSecondUnit}
                </td>
                <td className="py-3 text-slate-600">{t.results.metrics.avgSpeedDesc}</td>
              </tr>
              <tr>
                <td className="py-3 pe-4 font-medium text-slate-900">
                  {t.results.metrics.meanIntervalTitle}
                </td>
                <td className="py-3 pe-4 font-semibold text-navy-900 tabular-nums">
                  {session.meanInterTapInterval !== null
                    ? `${formatDecimal(session.meanInterTapInterval, language, 1)} ${t.common.msUnit}`
                    : t.common.notAvailable}
                </td>
                <td className="py-3 text-slate-600">{t.results.metrics.meanIntervalDesc}</td>
              </tr>
              <tr>
                <td className="py-3 pe-4 font-medium text-slate-900">
                  {t.results.metrics.rhythmSdLabel}
                </td>
                <td className="py-3 pe-4 font-semibold text-navy-900 tabular-nums">
                  {session.intervalStandardDeviation !== null
                    ? `${formatDecimal(session.intervalStandardDeviation, language, 1)} ${t.common.msUnit}`
                    : t.common.insufficientData}
                </td>
                <td className="py-3 text-slate-600">{t.results.metrics.rhythmFormulaTitle}</td>
              </tr>
              <tr>
                <td className="py-3 pe-4 font-medium text-slate-900">
                  {t.results.metrics.rhythmCvLabel}
                </td>
                <td className="py-3 pe-4 font-semibold text-navy-900 tabular-nums">
                  {session.intervalCoefficientOfVariation !== null
                    ? `${formatDecimal(session.intervalCoefficientOfVariation, language, 1)}%`
                    : t.common.insufficientData}
                </td>
                <td className="py-3 text-slate-600">{t.results.metrics.rhythmExplanation}</td>
              </tr>
              <tr>
                <td className="py-3 pe-4 font-medium text-slate-900">
                  {t.results.charts.segment1Label}
                </td>
                <td className="py-3 pe-4 font-semibold text-navy-900 tabular-nums">
                  {formatDecimal(derived.segmentDetails[0].ratePerSecond, language, 2)}{' '}
                  {t.common.tapsPerSecondUnit} ({formatInteger(derived.segmentDetails[0].tapCount, language)}{' '}
                  {t.common.tapsUnit})
                </td>
                <td className="py-3 text-slate-600">{t.results.charts.segment1Desc}</td>
              </tr>
              <tr>
                <td className="py-3 pe-4 font-medium text-slate-900">
                  {t.results.charts.segment2Label}
                </td>
                <td className="py-3 pe-4 font-semibold text-navy-900 tabular-nums">
                  {formatDecimal(derived.segmentDetails[1].ratePerSecond, language, 2)}{' '}
                  {t.common.tapsPerSecondUnit} ({formatInteger(derived.segmentDetails[1].tapCount, language)}{' '}
                  {t.common.tapsUnit})
                </td>
                <td className="py-3 text-slate-600">{t.results.charts.segment2Desc}</td>
              </tr>
              <tr>
                <td className="py-3 pe-4 font-medium text-slate-900">
                  {t.results.charts.segment3Label}
                </td>
                <td className="py-3 pe-4 font-semibold text-navy-900 tabular-nums">
                  {formatDecimal(derived.segmentDetails[2].ratePerSecond, language, 2)}{' '}
                  {t.common.tapsPerSecondUnit} ({formatInteger(derived.segmentDetails[2].tapCount, language)}{' '}
                  {t.common.tapsUnit})
                </td>
                <td className="py-3 text-slate-600">{t.results.charts.segment3Desc}</td>
              </tr>
              <tr>
                <td className="py-3 pe-4 font-medium text-slate-900">
                  {t.results.charts.rawTimestampCountLabel}
                </td>
                <td className="py-3 pe-4 font-semibold text-navy-900 tabular-nums">
                  {formatInteger(session.rawTapTimestamps.length, language)}
                </td>
                <td className="py-3 text-slate-600">{t.results.charts.rawTimestampNote}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

