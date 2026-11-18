import React from 'react';
import {
  Activity,
  ArrowRight,
  Calendar,
  CheckCircle2,
  History,
  Play,
  Share2,
  Stethoscope,
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import {
  formatDate,
  formatDateTime,
  formatDecimal,
  formatInteger,
  getLocalizedText,
} from '../../utils/formatters';
import { ClinicalDisclaimerBanner } from '../../components/common/ClinicalDisclaimer';
import { DataOriginBadge, HandBadge, ReviewStatusBadge } from '../../components/common/StatusBadges';

export const PatientDashboardPage: React.FC = () => {
  const {
    language,
    t,
    setRoute,
    activePatient,
    assignedDoctor,
    patientSessions,
  } = useAppState();

  const latestSession = patientSessions[0];
  const recentSessions = patientSessions.slice(0, 4);
  const sharedCount = patientSessions.filter((s) => s.sharedWithDoctor).length;
  const reviewedCount = patientSessions.filter((s) => s.reviewedStatus === 'reviewed').length;
  const liveCount = patientSessions.filter((s) => s.dataOrigin === 'recorded_live').length;

  return (
    <div className="space-y-6">
      {/* Welcome Header & Primary Test CTA */}
      <section className="hc-card rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-teal-800">
              <span className="rounded-md bg-teal-50 px-2.5 py-1 border border-teal-200">
                {activePatient.medicalRecordNumber}
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-600">
                {getLocalizedText(activePatient.clinicUnit, language)}
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl">
              {t.patientDashboard.welcomePrefix}{' '}
              {getLocalizedText(activePatient.fullName, language)}
            </h1>
            <p className="max-w-2xl text-sm text-slate-600 hc-muted">
              {t.patientDashboard.welcomeSubtext}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setRoute({ page: 'patient_test_intro' })}
            className="inline-flex min-h-[52px] shrink-0 items-center justify-center gap-2.5 rounded-xl bg-navy-900 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-navy-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
          >
            <Play className="h-4 w-4 fill-current text-teal-300" aria-hidden="true" />
            <span>{t.patientDashboard.startNewTestCta}</span>
          </button>
        </div>
      </section>

      <ClinicalDisclaimerBanner compact />

      {/* Quick Session Overview Strip */}
      <section aria-label={t.patientDashboard.quickStatsTitle}>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          <div className="hc-card rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="text-xs font-medium text-slate-500">
              {t.patientDashboard.completedSessionsCount}
            </div>
            <div className="mt-1.5 text-2xl font-bold text-navy-900 tabular-nums">
              {formatInteger(patientSessions.length, language)}
            </div>
          </div>

          <div className="hc-card rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="text-xs font-medium text-slate-500">
              {t.patientDashboard.liveSessionsCount}
            </div>
            <div className="mt-1.5 text-2xl font-bold text-teal-700 tabular-nums">
              {formatInteger(liveCount, language)}
            </div>
          </div>

          <div className="hc-card rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="text-xs font-medium text-slate-500">
              {t.patientDashboard.sharedSessionsCount}
            </div>
            <div className="mt-1.5 text-2xl font-bold text-navy-900 tabular-nums">
              {formatInteger(sharedCount, language)}
            </div>
          </div>

          <div className="hc-card rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="text-xs font-medium text-slate-500">
              {t.patientDashboard.reviewedSessionsCount}
            </div>
            <div className="mt-1.5 text-2xl font-bold text-emerald-700 tabular-nums">
              {formatInteger(reviewedCount, language)}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Grid: Latest Tapping Test + Assigned Doctor */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Latest Test Summary */}
        <section className="hc-card rounded-2xl border border-slate-200 bg-white p-5 shadow-xs lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                <Activity className="h-5 w-5" aria-hidden="true" />
              </div>
              <h2 className="text-base font-semibold text-navy-900">
                {t.patientDashboard.latestTestTitle}
              </h2>
            </div>

            {latestSession && (
              <button
                type="button"
                onClick={() =>
                  setRoute({ page: 'patient_results', sessionId: latestSession.id })
                }
                className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg px-3 text-sm font-semibold text-teal-700 hover:bg-teal-50 focus-visible:outline-2 focus-visible:outline-teal-600"
              >
                <span>{t.common.viewDetails}</span>
                <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
              </button>
            )}
          </div>

          {!latestSession ? (
            <div className="py-10 text-center space-y-3">
              <p className="text-base font-semibold text-slate-800">
                {t.patientDashboard.latestTestEmptyTitle}
              </p>
              <p className="mx-auto max-w-md text-sm text-slate-600">
                {t.patientDashboard.latestTestEmptyBody}
              </p>
            </div>
          ) : (
            <div className="pt-4 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <DataOriginBadge origin={latestSession.dataOrigin} />
                  <HandBadge hand={latestSession.handTested} />
                  <ReviewStatusBadge
                    sharedWithDoctor={latestSession.sharedWithDoctor}
                    reviewedStatus={latestSession.reviewedStatus}
                  />
                </div>
                <div className="inline-flex items-center gap-1.5 text-xs text-slate-600">
                  <Calendar className="h-4 w-4 text-slate-400" aria-hidden="true" />
                  <span>
                    {t.patientDashboard.completedOnLabel}:{' '}
                    <strong className="font-medium text-slate-900">
                      {formatDateTime(latestSession.timestamp, language)}
                    </strong>
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-xl border border-slate-200/80 bg-slate-50 p-3.5">
                  <div className="text-xs text-slate-500">
                    {t.patientDashboard.totalTapsLabel}
                  </div>
                  <div className="mt-1 text-xl font-bold text-navy-900 tabular-nums">
                    {formatInteger(latestSession.totalTapCount, language)}
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200/80 bg-slate-50 p-3.5">
                  <div className="text-xs text-slate-500">
                    {t.patientDashboard.averageSpeedLabel}
                  </div>
                  <div className="mt-1 text-xl font-bold text-navy-900 tabular-nums">
                    {formatDecimal(latestSession.averageTapsPerSecond, language, 2)}{' '}
                    <span className="text-xs font-normal text-slate-600">
                      {t.common.tapsPerSecondUnit}
                    </span>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200/80 bg-slate-50 p-3.5">
                  <div className="text-xs text-slate-500">
                    {t.patientDashboard.rhythmCvLabel}
                  </div>
                  <div className="mt-1 text-xl font-bold text-navy-900 tabular-nums">
                    {latestSession.intervalCoefficientOfVariation !== null
                      ? `${formatDecimal(
                          latestSession.intervalCoefficientOfVariation,
                          language,
                          1,
                        )}%`
                      : t.common.notAvailable}
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200/80 bg-slate-50 p-3.5">
                  <div className="text-xs text-slate-500">
                    {t.patientDashboard.performanceChangeLabel}
                  </div>
                  <div className="mt-1 text-xl font-bold text-navy-900 tabular-nums">
                    {latestSession.performanceChangePercentage !== null
                      ? `${latestSession.performanceChangePercentage > 0 ? '+' : ''}${formatDecimal(
                          latestSession.performanceChangePercentage,
                          language,
                          1,
                        )}%`
                      : t.common.notAvailable}
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Assigned Doctor Card */}
        <section className="hc-card flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div>
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-navy-50 text-navy-900">
                <Stethoscope className="h-5 w-5" aria-hidden="true" />
              </div>
              <h2 className="text-base font-semibold text-navy-900">
                {t.patientDashboard.assignedDoctorTitle}
              </h2>
            </div>

            <div className="mt-4 flex items-center gap-3.5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-teal-700 text-sm font-bold text-white">
                {assignedDoctor.avatarInitials}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-navy-900">
                  {getLocalizedText(assignedDoctor.fullName, language)}
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  {getLocalizedText(assignedDoctor.specialty, language)}
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-2 rounded-xl border border-slate-200/80 bg-slate-50 p-3 text-xs text-slate-700">
              <div className="flex items-center gap-2 text-teal-800 font-medium">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-teal-600" aria-hidden="true" />
                <span>{t.myDoctor.connectionActive}</span>
              </div>
              <div className="text-slate-600">
                {getLocalizedText(assignedDoctor.hospital, language)}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setRoute({ page: 'patient_doctor' })}
            className="mt-5 inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-navy-900 transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-teal-600"
          >
            <Share2 className="h-4 w-4 text-teal-700" aria-hidden="true" />
            <span>{t.patientDashboard.viewDoctorPage}</span>
          </button>
        </section>
      </div>

      {/* Recent Test Sessions List */}
      <section className="hc-card rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-navy-900">
              <History className="h-5 w-5" aria-hidden="true" />
            </div>
            <h2 className="text-base font-semibold text-navy-900">
              {t.patientDashboard.recentSessionsTitle}
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setRoute({ page: 'patient_history' })}
            className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg px-3 text-sm font-semibold text-navy-800 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-teal-600"
          >
            <span>{t.patientDashboard.viewAllHistory}</span>
            <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
          </button>
        </div>

        {recentSessions.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-500">
            {t.patientDashboard.noSessionsHint}
          </p>
        ) : (
          <div className="mt-3 divide-y divide-slate-100">
            {recentSessions.map((session) => (
              <div
                key={session.id}
                className="flex flex-col gap-3 py-3.5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-navy-900">
                      {formatDate(session.timestamp, language)}
                    </span>
                    <HandBadge hand={session.handTested} />
                    <DataOriginBadge origin={session.dataOrigin} />
                    <ReviewStatusBadge
                      sharedWithDoctor={session.sharedWithDoctor}
                      reviewedStatus={session.reviewedStatus}
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 tabular-nums">
                    <span>
                      {t.patientDashboard.totalTapsLabel}:{' '}
                      <strong className="text-slate-900">
                        {formatInteger(session.totalTapCount, language)}
                      </strong>
                    </span>
                    <span>
                      {t.patientDashboard.averageSpeedLabel}:{' '}
                      <strong className="text-slate-900">
                        {formatDecimal(session.averageTapsPerSecond, language, 2)}{' '}
                        {t.common.tapsPerSecondUnit}
                      </strong>
                    </span>
                    <span>
                      {t.patientDashboard.rhythmCvLabel}:{' '}
                      <strong className="text-slate-900">
                        {session.intervalCoefficientOfVariation !== null
                          ? `${formatDecimal(
                              session.intervalCoefficientOfVariation,
                              language,
                              1,
                            )}%`
                          : t.common.notAvailable}
                      </strong>
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setRoute({ page: 'patient_results', sessionId: session.id })}
                  className="inline-flex min-h-[42px] shrink-0 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-4 text-xs font-semibold text-navy-900 transition hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-teal-600"
                >
                  <span>{t.common.viewDetails}</span>
                  <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

