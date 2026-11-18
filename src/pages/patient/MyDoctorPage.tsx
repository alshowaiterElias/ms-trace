import React from 'react';
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock,
  Mail,
  MessageSquareText,
  Phone,
  Share2,
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import {
  formatDateTime,
  formatDecimal,
  formatInteger,
  getLocalizedText,
} from '../../utils/formatters';
import { DataOriginBadge, HandBadge, ReviewStatusBadge } from '../../components/common/StatusBadges';

export const MyDoctorPage: React.FC = () => {
  const {
    language,
    t,
    setRoute,
    assignedDoctor,
    patientSessions,
    shareSessionWithDoctor,
    getReviewForSession,
  } = useAppState();

  const sharedSessions = patientSessions.filter((s) => s.sharedWithDoctor);
  const unsharedSessions = patientSessions.filter((s) => !s.sharedWithDoctor);

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="hc-card rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <h1 className="text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl">
          {t.myDoctor.title}
        </h1>
        <p className="mt-1 text-sm text-slate-600 hc-muted">{t.myDoctor.subtitle}</p>
      </section>

      {/* Doctor Profile Card */}
      <section className="hc-card rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-teal-700 text-xl font-bold text-white shadow-xs">
              {assignedDoctor.avatarInitials}
            </div>
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-200 bg-teal-50 px-3 py-0.5 text-xs font-semibold text-teal-800">
                <CheckCircle2 className="h-3.5 w-3.5 text-teal-600" aria-hidden="true" />
                <span>{t.myDoctor.connectionActive}</span>
              </span>
              <h2 className="mt-2 text-xl font-bold text-navy-900">
                {getLocalizedText(assignedDoctor.fullName, language)}
              </h2>
              <p className="text-sm font-medium text-teal-800">
                {getLocalizedText(assignedDoctor.specialty, language)}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-200/80 bg-slate-50 p-3.5">
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <Building2 className="h-4 w-4 text-slate-400" aria-hidden="true" />
              <span>{t.myDoctor.hospitalLabel}</span>
            </div>
            <div className="mt-1 text-sm font-semibold text-navy-900">
              {getLocalizedText(assignedDoctor.hospital, language)}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200/80 bg-slate-50 p-3.5">
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <Mail className="h-4 w-4 text-slate-400" aria-hidden="true" />
              <span>{t.myDoctor.emailLabel}</span>
            </div>
            <div className="mt-1 text-sm font-semibold text-navy-900 break-all" dir="ltr">
              {assignedDoctor.email}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200/80 bg-slate-50 p-3.5">
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <Phone className="h-4 w-4 text-slate-400" aria-hidden="true" />
              <span>{t.myDoctor.phoneLabel}</span>
            </div>
            <div className="mt-1 text-sm font-semibold text-navy-900 tabular-nums" dir="ltr">
              {assignedDoctor.phone}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200/80 bg-slate-50 p-3.5">
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <Clock className="h-4 w-4 text-slate-400" aria-hidden="true" />
              <span>{t.myDoctor.officeHoursLabel}</span>
            </div>
            <div className="mt-1 text-sm font-semibold text-navy-900">
              {getLocalizedText(assignedDoctor.officeHours, language)}
            </div>
          </div>
        </div>

        <p className="mt-4 text-xs text-slate-500">{t.myDoctor.demoContactNotice}</p>
      </section>

      {/* Unshared Local Sessions Ready to Share */}
      <section className="hc-card rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div>
          <h2 className="text-base font-semibold text-navy-900">
            {t.myDoctor.unsharedTestsTitle}
          </h2>
          <p className="mt-0.5 text-xs sm:text-sm text-slate-600 hc-muted">
            {t.myDoctor.unsharedTestsSubtitle}
          </p>
        </div>

        {unsharedSessions.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
            {t.myDoctor.noUnsharedTests}
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {unsharedSessions.map((session) => (
              <div
                key={session.id}
                className="flex flex-col gap-3 py-3.5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-navy-900">
                      {formatDateTime(session.timestamp, language)}
                    </span>
                    <HandBadge hand={session.handTested} />
                    <DataOriginBadge origin={session.dataOrigin} />
                  </div>
                  <div className="text-xs text-slate-600 tabular-nums">
                    {formatInteger(session.totalTapCount, language)} {t.common.tapsUnit} •{' '}
                    {formatDecimal(session.averageTapsPerSecond, language, 2)}{' '}
                    {t.common.tapsPerSecondUnit}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setRoute({ page: 'patient_results', sessionId: session.id })
                    }
                    className="min-h-[40px] rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-teal-600"
                  >
                    {t.myDoctor.openSessionBtn}
                  </button>
                  <button
                    type="button"
                    onClick={() => shareSessionWithDoctor(session.id)}
                    className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl bg-teal-600 px-4 text-xs font-semibold text-white hover:bg-teal-700 focus-visible:outline-2 focus-visible:outline-teal-600"
                  >
                    <Share2 className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{t.myDoctor.shareNowBtn}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Shared Sessions Overview */}
      <section className="hc-card rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div>
          <h2 className="text-base font-semibold text-navy-900">
            {t.myDoctor.sharedTestsTitle}
          </h2>
          <p className="mt-0.5 text-xs sm:text-sm text-slate-600 hc-muted">
            {t.myDoctor.sharedTestsSubtitle}
          </p>
        </div>

        {sharedSessions.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
            {t.myDoctor.noSharedTests}
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {sharedSessions.map((session) => {
              const review = getReviewForSession(session.id);
              return (
                <div
                  key={session.id}
                  className="flex flex-col gap-3 py-3.5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold text-navy-900">
                        {formatDateTime(session.timestamp, language)}
                      </span>
                      <HandBadge hand={session.handTested} />
                      <DataOriginBadge origin={session.dataOrigin} />
                      <ReviewStatusBadge
                        sharedWithDoctor={session.sharedWithDoctor}
                        reviewedStatus={session.reviewedStatus}
                      />
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 tabular-nums">
                      <span>
                        {formatInteger(session.totalTapCount, language)} {t.common.tapsUnit} •{' '}
                        {formatDecimal(session.averageTapsPerSecond, language, 2)}{' '}
                        {t.common.tapsPerSecondUnit}
                      </span>
                      {review && (
                        <span className="inline-flex items-center gap-1 font-medium text-emerald-700">
                          <MessageSquareText className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>{t.myDoctor.doctorNoteIncluded}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setRoute({ page: 'patient_results', sessionId: session.id })
                    }
                    className="inline-flex min-h-[40px] shrink-0 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-xs font-semibold text-navy-900 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-teal-600"
                  >
                    <span>{t.myDoctor.openSessionBtn}</span>
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

