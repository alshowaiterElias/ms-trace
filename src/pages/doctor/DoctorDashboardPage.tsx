import React from 'react';
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Stethoscope,
  Users,
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import {
  formatDateTime,
  formatDecimal,
  formatInteger,
  getLocalizedText,
} from '../../utils/formatters';
import { ClinicalDisclaimerBanner } from '../../components/common/ClinicalDisclaimer';
import {
  DataOriginBadge,
  HandBadge,
  ReviewStatusBadge,
} from '../../components/common/StatusBadges';

export const DoctorDashboardPage: React.FC = () => {
  const {
    state,
    language,
    t,
    setRoute,
    activeDoctor,
    sharedDoctorSessions,
  } = useAppState();

  const assignedPatients = state.patients.filter(
    (p) => p.assignedDoctorId === activeDoctor.id,
  );
  const patientsWithTestsIds = new Set(sharedDoctorSessions.map((s) => s.patientId));
  const pendingReviewSessions = sharedDoctorSessions.filter(
    (s) => s.reviewedStatus === 'pending_review',
  );
  const recentSharedSessions = sharedDoctorSessions.slice(0, 6);

  const getPatientById = (patientId: string) =>
    state.patients.find((p) => p.id === patientId);

  return (
    <div className="space-y-6">
      {/* Doctor Profile Header */}
      <section className="hc-card rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-teal-700 text-lg font-bold text-white shadow-xs">
              {activeDoctor.avatarInitials}
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-teal-200 bg-teal-50 px-2.5 py-0.5 text-xs font-semibold text-teal-800">
                <Stethoscope className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{getLocalizedText(activeDoctor.fullName, language)}</span>
              </div>
              <h1 className="mt-2 text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl">
                {t.doctorDashboard.title}
              </h1>
              <p className="mt-1 text-sm text-slate-600 hc-muted">
                {t.doctorDashboard.subtitle}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setRoute({ page: 'doctor_patients' })}
            className="inline-flex min-h-[46px] shrink-0 items-center justify-center gap-2 rounded-xl bg-navy-900 px-5 text-sm font-semibold text-white hover:bg-navy-800 focus-visible:outline-2 focus-visible:outline-teal-600"
          >
            <Users className="h-4 w-4 text-teal-300" aria-hidden="true" />
            <span>{t.nav.patientRoster}</span>
          </button>
        </div>
      </section>

      <ClinicalDisclaimerBanner compact />

      {/* Doctor KPI Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="hc-card rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>{t.doctorDashboard.totalPatientsCard}</span>
            <Users className="h-4 w-4 text-navy-700" aria-hidden="true" />
          </div>
          <div className="mt-2 text-3xl font-bold text-navy-900 tabular-nums">
            {formatInteger(assignedPatients.length, language)}
          </div>
        </div>

        <div className="hc-card rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>{t.doctorDashboard.patientsWithRecentCard}</span>
            <Activity className="h-4 w-4 text-teal-700" aria-hidden="true" />
          </div>
          <div className="mt-2 text-3xl font-bold text-navy-900 tabular-nums">
            {formatInteger(patientsWithTestsIds.size, language)}
          </div>
        </div>

        <div className="hc-card rounded-2xl border border-amber-200 bg-amber-50/50 p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-amber-900">
            <span>{t.doctorDashboard.pendingReviewsCard}</span>
            <Clock className="h-4 w-4 text-amber-700" aria-hidden="true" />
          </div>
          <div className="mt-2 text-3xl font-bold text-amber-900 tabular-nums">
            {formatInteger(pendingReviewSessions.length, language)}
          </div>
        </div>

        <div className="hc-card rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>{t.doctorDashboard.totalSharedTestsCard}</span>
            <ClipboardCheck className="h-4 w-4 text-teal-700" aria-hidden="true" />
          </div>
          <div className="mt-2 text-3xl font-bold text-navy-900 tabular-nums">
            {formatInteger(sharedDoctorSessions.length, language)}
          </div>
        </div>
      </div>

      {/* Sessions Requiring Review */}
      <section className="hc-card rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
            <Clock className="h-5 w-5" aria-hidden="true" />
          </div>
          <h2 className="text-base font-semibold text-navy-900">
            {t.doctorDashboard.requiringReviewTitle}
          </h2>
        </div>

        {pendingReviewSessions.length === 0 ? (
          <div className="flex items-center gap-2.5 py-6 text-sm text-emerald-800">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" aria-hidden="true" />
            <span>{t.doctorDashboard.requiringReviewEmpty}</span>
          </div>
        ) : (
          <div className="mt-3 divide-y divide-slate-100">
            {pendingReviewSessions.map((session) => {
              const patient = getPatientById(session.patientId);
              if (!patient) return null;
              return (
                <div
                  key={session.id}
                  className="flex flex-col gap-3 py-3.5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-bold text-navy-900">
                        {getLocalizedText(patient.fullName, language)}
                      </span>
                      <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                        {patient.medicalRecordNumber}
                      </span>
                      <HandBadge hand={session.handTested} />
                      <DataOriginBadge origin={session.dataOrigin} />
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 tabular-nums">
                      <span>{formatDateTime(session.timestamp, language)}</span>
                      <span>
                        {formatInteger(session.totalTapCount, language)} {t.common.tapsUnit}
                      </span>
                      <span>
                        {formatDecimal(session.averageTapsPerSecond, language, 2)}{' '}
                        {t.common.tapsPerSecondUnit}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setRoute({
                        page: 'doctor_patient_detail',
                        patientId: patient.id,
                        sessionId: session.id,
                      })
                    }
                    className="inline-flex min-h-[42px] shrink-0 items-center justify-center gap-1.5 rounded-xl bg-teal-600 px-4 text-xs font-semibold text-white hover:bg-teal-700 focus-visible:outline-2 focus-visible:outline-teal-600"
                  >
                    <span>{t.doctorDashboard.reviewNowBtn}</span>
                    <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Recently Completed Shared Tests */}
      <section className="hc-card rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-navy-50 text-navy-900">
            <Activity className="h-5 w-5" aria-hidden="true" />
          </div>
          <h2 className="text-base font-semibold text-navy-900">
            {t.doctorDashboard.recentSharedTestsTitle}
          </h2>
        </div>

        {recentSharedSessions.length === 0 ? (
          <p className="py-6 text-sm text-slate-500">
            {t.doctorDashboard.recentSharedEmpty}
          </p>
        ) : (
          <div className="mt-3 divide-y divide-slate-100">
            {recentSharedSessions.map((session) => {
              const patient = getPatientById(session.patientId);
              if (!patient) return null;
              return (
                <div
                  key={session.id}
                  className="flex flex-col gap-3 py-3.5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold text-navy-900">
                        {getLocalizedText(patient.fullName, language)}
                      </span>
                      <HandBadge hand={session.handTested} />
                      <DataOriginBadge origin={session.dataOrigin} />
                      <ReviewStatusBadge
                        sharedWithDoctor={session.sharedWithDoctor}
                        reviewedStatus={session.reviewedStatus}
                      />
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 tabular-nums">
                      <span>{formatDateTime(session.timestamp, language)}</span>
                      <span>
                        {formatInteger(session.totalTapCount, language)} {t.common.tapsUnit}
                      </span>
                      <span>
                        {formatDecimal(session.averageTapsPerSecond, language, 2)}{' '}
                        {t.common.tapsPerSecondUnit}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setRoute({
                        page: 'doctor_patient_detail',
                        patientId: patient.id,
                        sessionId: session.id,
                      })
                    }
                    className="inline-flex min-h-[40px] shrink-0 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-xs font-semibold text-navy-900 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-teal-600"
                  >
                    <span>{t.doctorDashboard.openPatientProfileBtn}</span>
                    <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" aria-hidden="true" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

