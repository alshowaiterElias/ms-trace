import React, { useMemo, useState } from 'react';
import { ArrowRight, Play } from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import type { HandTested, SessionDataOrigin } from '../../types/domain';
import { formatDate, formatDecimal, formatInteger } from '../../utils/formatters';
import { LongitudinalTrendChart } from '../../components/charts/SessionCharts';
import { DataOriginBadge, HandBadge, ReviewStatusBadge } from '../../components/common/StatusBadges';

export const TestHistoryPage: React.FC = () => {
  const { language, t, setRoute, patientSessions } = useAppState();
  const [handFilter, setHandFilter] = useState<'all' | HandTested>('all');
  const [originFilter, setOriginFilter] = useState<'all' | SessionDataOrigin>('all');

  const filteredSessions = useMemo(() => {
    return patientSessions.filter((session) => {
      if (handFilter !== 'all' && session.handTested !== handFilter) return false;
      if (originFilter !== 'all' && session.dataOrigin !== originFilter) return false;
      return true;
    });
  }, [patientSessions, handFilter, originFilter]);

  return (
    <div className="space-y-6">
      {/* Header + Filter Controls */}
      <section className="hc-card rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl">
              {t.history.title}
            </h1>
            <p className="mt-1 text-sm text-slate-600 hc-muted">{t.history.subtitle}</p>
          </div>

          <button
            type="button"
            onClick={() => setRoute({ page: 'patient_test_intro' })}
            className="inline-flex min-h-[46px] shrink-0 items-center justify-center gap-2 rounded-xl bg-navy-900 px-5 text-sm font-semibold text-white hover:bg-navy-800 focus-visible:outline-2 focus-visible:outline-teal-600"
          >
            <Play className="h-4 w-4 fill-current text-teal-300" aria-hidden="true" />
            <span>{t.patientDashboard.startNewTestCta}</span>
          </button>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-slate-100 pt-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-600">
              {t.history.filterHandLabel}:
            </span>
            {(['all', 'right', 'left'] as const).map((val) => {
              const label =
                val === 'all'
                  ? t.common.allHands
                  : val === 'right'
                    ? t.common.rightHand
                    : t.common.leftHand;
              return (
                <button
                  key={val}
                  type="button"
                  onClick={() => setHandFilter(val)}
                  aria-pressed={handFilter === val}
                  className={`min-h-[38px] rounded-xl px-3.5 text-xs font-semibold transition focus-visible:outline-2 focus-visible:outline-teal-600 ${
                    handFilter === val
                      ? 'bg-navy-900 text-white'
                      : 'border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-600">
              {t.history.filterOriginLabel}:
            </span>
            {(['all', 'recorded_live', 'demo_mock'] as const).map((val) => {
              const label =
                val === 'all'
                  ? t.history.originAll
                  : val === 'recorded_live'
                    ? t.history.originLive
                    : t.history.originDemo;
              return (
                <button
                  key={val}
                  type="button"
                  onClick={() => setOriginFilter(val)}
                  aria-pressed={originFilter === val}
                  className={`min-h-[38px] rounded-xl px-3.5 text-xs font-semibold transition focus-visible:outline-2 focus-visible:outline-teal-600 ${
                    originFilter === val
                      ? 'bg-teal-600 text-white'
                      : 'border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Historical Multi-Session Chart */}
      <LongitudinalTrendChart
        sessions={filteredSessions}
        title={t.history.trendChartTitle}
        subtitle={t.history.trendChartSubtitle}
        cautionNote={t.history.trendCautionNote}
        emptyText={t.history.trendEmpty}
      />

      {/* Sessions Table */}
      <section className="hc-card rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <h2 className="mb-4 text-base font-semibold text-navy-900">
          {t.history.sessionsTableTitle}
        </h2>

        {filteredSessions.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center space-y-3">
            <p className="text-base font-semibold text-slate-800">{t.history.emptyStateTitle}</p>
            <p className="text-sm text-slate-600">{t.history.emptyStateBody}</p>
            <button
              type="button"
              onClick={() => setRoute({ page: 'patient_test_intro' })}
              className="mt-2 inline-flex min-h-[44px] items-center justify-center rounded-xl bg-navy-900 px-5 text-sm font-semibold text-white hover:bg-navy-800"
            >
              {t.history.startFirstTestBtn}
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-start text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="py-3 pe-4 text-start">{t.history.colDate}</th>
                  <th className="py-3 pe-4 text-start">{t.history.colHand}</th>
                  <th className="py-3 pe-4 text-start">{t.history.colOrigin}</th>
                  <th className="py-3 pe-4 text-start">{t.history.colTotalTaps}</th>
                  <th className="py-3 pe-4 text-start">{t.history.colSpeed}</th>
                  <th className="py-3 pe-4 text-start">{t.history.colRhythmCv}</th>
                  <th className="py-3 pe-4 text-start">{t.history.colPerfChange}</th>
                  <th className="py-3 pe-4 text-start">{t.history.colDoctorStatus}</th>
                  <th className="py-3 text-end">{t.history.colActions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSessions.map((session) => (
                  <tr key={session.id} className="hover:bg-slate-50/70">
                    <td className="py-3.5 pe-4 font-medium text-navy-900 whitespace-nowrap">
                      {formatDate(session.timestamp, language)}
                    </td>
                    <td className="py-3.5 pe-4 whitespace-nowrap">
                      <HandBadge hand={session.handTested} />
                    </td>
                    <td className="py-3.5 pe-4 whitespace-nowrap">
                      <DataOriginBadge origin={session.dataOrigin} />
                    </td>
                    <td className="py-3.5 pe-4 font-semibold text-slate-900 tabular-nums whitespace-nowrap">
                      {formatInteger(session.totalTapCount, language)}
                    </td>
                    <td className="py-3.5 pe-4 text-slate-800 tabular-nums whitespace-nowrap">
                      {formatDecimal(session.averageTapsPerSecond, language, 2)}{' '}
                      {t.common.tapsPerSecondUnit}
                    </td>
                    <td className="py-3.5 pe-4 text-slate-800 tabular-nums whitespace-nowrap">
                      {session.intervalCoefficientOfVariation !== null
                        ? `${formatDecimal(
                            session.intervalCoefficientOfVariation,
                            language,
                            1,
                          )}%`
                        : t.common.notAvailable}
                    </td>
                    <td className="py-3.5 pe-4 text-slate-800 tabular-nums whitespace-nowrap">
                      {session.performanceChangePercentage !== null
                        ? `${session.performanceChangePercentage > 0 ? '+' : ''}${formatDecimal(
                            session.performanceChangePercentage,
                            language,
                            1,
                          )}%`
                        : t.common.notAvailable}
                    </td>
                    <td className="py-3.5 pe-4 whitespace-nowrap">
                      <ReviewStatusBadge
                        sharedWithDoctor={session.sharedWithDoctor}
                        reviewedStatus={session.reviewedStatus}
                      />
                    </td>
                    <td className="py-3.5 text-end whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() =>
                          setRoute({ page: 'patient_results', sessionId: session.id })
                        }
                        className="inline-flex min-h-[38px] items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-navy-900 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-teal-600"
                      >
                        <span>{t.common.viewDetails}</span>
                        <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" aria-hidden="true" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

