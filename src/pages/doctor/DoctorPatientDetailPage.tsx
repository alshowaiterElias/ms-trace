import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  ClipboardCheck,
  Info,
  ShieldCheck,
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import type { HandTested } from '../../types/domain';
import {
  formatDate,
  formatDateTime,
  formatDecimal,
  formatInteger,
  getLocalizedText,
} from '../../utils/formatters';
import { LongitudinalTrendChart } from '../../components/charts/SessionCharts';
import { ClinicalDisclaimerBanner } from '../../components/common/ClinicalDisclaimer';
import {
  DataOriginBadge,
  HandBadge,
  ReviewStatusBadge,
} from '../../components/common/StatusBadges';
import { SessionResultsDetail } from '../../components/results/SessionResultsDetail';

export const DoctorPatientDetailPage: React.FC<{
  patientId: string;
  initialSessionId?: string;
}> = ({ patientId, initialSessionId }) => {
  const {
    state,
    language,
    t,
    setRoute,
    sharedDoctorSessions,
    getReviewForSession,
    saveDoctorReview,
  } = useAppState();

  const patient = state.patients.find((p) => p.id === patientId) ?? state.patients[0];

  const patientSharedSessions = useMemo(
    () =>
      sharedDoctorSessions
        .filter((s) => s.patientId === patient.id)
        .slice()
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
    [sharedDoctorSessions, patient.id],
  );

  const [selectedSessionId, setSelectedSessionId] = useState<string>(
    initialSessionId ?? patientSharedSessions[0]?.id ?? '',
  );
  const [trendHandFilter, setTrendHandFilter] = useState<'all' | HandTested>('all');
  const [noteInput, setNoteInput] = useState('');
  const [noteError, setNoteError] = useState<string | null>(null);

  // Sync selected session when switching patient or initialSessionId prop changes
  useEffect(() => {
    if (
      initialSessionId &&
      patientSharedSessions.some((s) => s.id === initialSessionId)
    ) {
      setSelectedSessionId(initialSessionId);
      return;
    }
    if (!patientSharedSessions.some((s) => s.id === selectedSessionId)) {
      setSelectedSessionId(patientSharedSessions[0]?.id ?? '');
    }
  }, [initialSessionId, patientSharedSessions, selectedSessionId]);

  const selectedSession =
    patientSharedSessions.find((s) => s.id === selectedSessionId) ??
    patientSharedSessions[0];

  const selectedReview = selectedSession
    ? getReviewForSession(selectedSession.id)
    : undefined;

  // Populate note textarea whenever active session or its existing review changes
  useEffect(() => {
    const resolvedNote = selectedReview
      ? selectedReview.demoNoteLocalized
        ? selectedReview.demoNoteLocalized[language]
        : selectedReview.note
      : '';
    setNoteInput(resolvedNote);
    setNoteError(null);
  }, [selectedSession?.id, selectedReview, language]);

  const trendSessions = useMemo(() => {
    if (trendHandFilter === 'all') return patientSharedSessions;
    return patientSharedSessions.filter((s) => s.handTested === trendHandFilter);
  }, [patientSharedSessions, trendHandFilter]);

  const pendingCount = patientSharedSessions.filter(
    (s) => s.reviewedStatus === 'pending_review',
  ).length;
  const latestSession = patientSharedSessions[0];

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSession) return;
    if (!noteInput.trim()) {
      setNoteError(t.doctorPatientDetail.clinicalNoteValidation);
      return;
    }
    setNoteError(null);
    saveDoctorReview(selectedSession.id, noteInput);
  };

  return (
    <div className="space-y-6">
      {/* Back Button & Patient Header */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => setRoute({ page: 'doctor_patients' })}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700 hover:text-teal-800 rounded-md focus-visible:outline-2 focus-visible:outline-teal-600"
        >
          <ArrowLeft className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
          <span>{t.doctorPatientDetail.backToRoster}</span>
        </button>

        <section className="hc-card rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-navy-900 text-lg font-bold text-white">
                {patient.avatarInitials}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl font-bold text-navy-900 sm:text-2xl">
                    {getLocalizedText(patient.fullName, language)}
                  </h1>
                  <span className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-0.5 font-mono text-xs font-medium text-slate-700">
                    {patient.medicalRecordNumber}
                  </span>
                </div>
                <p className="mt-1 text-xs sm:text-sm text-slate-600">
                  {t.profilePage.dobLabel}: {formatDate(patient.dateOfBirth, language)} •{' '}
                  {getLocalizedText(patient.clinicUnit, language)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5">
                <div className="text-[11px] font-medium text-slate-500">
                  {t.doctorPatientDetail.sharedSessionsCountLabel}
                </div>
                <div className="mt-0.5 text-lg font-bold text-navy-900 tabular-nums">
                  {formatInteger(patientSharedSessions.length, language)}
                </div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5">
                <div className="text-[11px] font-medium text-slate-500">
                  {t.doctorPatientDetail.pendingReviewCountLabel}
                </div>
                <div className="mt-0.5 text-lg font-bold text-amber-700 tabular-nums">
                  {formatInteger(pendingCount, language)}
                </div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5">
                <div className="text-[11px] font-medium text-slate-500">
                  {t.doctorPatientDetail.latestSpeedLabel}
                </div>
                <div className="mt-0.5 text-lg font-bold text-navy-900 tabular-nums">
                  {latestSession
                    ? `${formatDecimal(latestSession.averageTapsPerSecond, language, 2)}`
                    : t.common.notAvailable}
                </div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5">
                <div className="text-[11px] font-medium text-slate-500">
                  {t.doctorPatientDetail.latestCvLabel}
                </div>
                <div className="mt-0.5 text-lg font-bold text-teal-700 tabular-nums">
                  {latestSession && latestSession.intervalCoefficientOfVariation !== null
                    ? `${formatDecimal(
                        latestSession.intervalCoefficientOfVariation,
                        language,
                        1,
                      )}%`
                    : t.common.notAvailable}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-xl border border-slate-200/80 bg-slate-50 px-3.5 py-2 text-xs text-slate-600">
            <Info className="h-4 w-4 shrink-0 text-teal-700" aria-hidden="true" />
            <span>{t.doctorPatientDetail.unsharedPrivacyNote}</span>
          </div>
        </section>
      </div>

      <ClinicalDisclaimerBanner compact />

      {patientSharedSessions.length === 0 ? (
        <div className="hc-card rounded-2xl border border-slate-200 bg-white p-8 text-center space-y-2">
          <h2 className="text-base font-semibold text-navy-900">
            {t.doctorPatientDetail.noSharedSessionsTitle}
          </h2>
          <p className="text-sm text-slate-600">
            {t.doctorPatientDetail.noSharedSessionsBody}
          </p>
        </div>
      ) : (
        <>
          {/* Historical Comparison Chart with Hand Filter */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-end gap-2">
              {(['all', 'right', 'left'] as const).map((handOpt) => {
                const label =
                  handOpt === 'all'
                    ? t.common.allHands
                    : handOpt === 'right'
                      ? t.common.rightHand
                      : t.common.leftHand;
                return (
                  <button
                    key={handOpt}
                    type="button"
                    onClick={() => setTrendHandFilter(handOpt)}
                    aria-pressed={trendHandFilter === handOpt}
                    className={`min-h-[38px] rounded-xl px-3.5 text-xs font-semibold transition focus-visible:outline-2 focus-visible:outline-teal-600 ${
                      trendHandFilter === handOpt
                        ? 'bg-navy-900 text-white'
                        : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            <LongitudinalTrendChart
              sessions={trendSessions}
              title={t.doctorPatientDetail.longitudinalTitle}
              subtitle={t.doctorPatientDetail.longitudinalSubtitle}
              cautionNote={t.doctorPatientDetail.longitudinalCaution}
              emptyText={t.history.trendEmpty}
            />
          </div>

          {/* Shared Sessions Selector + Clinical Review Workflow */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Session Picker List */}
            <section className="hc-card rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
              <div>
                <h2 className="text-base font-semibold text-navy-900">
                  {t.doctorPatientDetail.sessionSelectorTitle}
                </h2>
                <p className="mt-0.5 text-xs text-slate-600 hc-muted">
                  {t.doctorPatientDetail.sessionSelectorSubtitle}
                </p>
              </div>

              <div className="space-y-2.5 max-h-[420px] overflow-y-auto pe-1">
                {patientSharedSessions.map((session) => {
                  const isSelected = selectedSession?.id === session.id;
                  return (
                    <button
                      key={session.id}
                      type="button"
                      onClick={() => setSelectedSessionId(session.id)}
                      aria-current={isSelected ? 'true' : undefined}
                      className={`w-full rounded-xl border p-3.5 text-start transition focus-visible:outline-2 focus-visible:outline-teal-600 ${
                        isSelected
                          ? 'border-navy-900 bg-navy-50/90 shadow-xs'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-navy-900">
                          {formatDateTime(session.timestamp, language)}
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-1.5">
                        <HandBadge hand={session.handTested} />
                        <ReviewStatusBadge
                          sharedWithDoctor={session.sharedWithDoctor}
                          reviewedStatus={session.reviewedStatus}
                        />
                      </div>
                      <div className="mt-2 flex items-center justify-between text-xs text-slate-600 tabular-nums">
                        <span>
                          {formatInteger(session.totalTapCount, language)} {t.common.tapsUnit} •{' '}
                          {formatDecimal(session.averageTapsPerSecond, language, 2)}{' '}
                          {t.common.tapsPerSecondUnit}
                        </span>
                      </div>
                      <div className="mt-2">
                        <DataOriginBadge origin={session.dataOrigin} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Doctor Clinical Review Panel */}
            {selectedSession && (
              <section className="hc-card rounded-2xl border border-slate-200 bg-white p-5 shadow-xs lg:col-span-2 space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                      <ClipboardCheck className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div>
                      <h2 className="text-base font-semibold text-navy-900">
                        {t.doctorPatientDetail.reviewPanelTitle}
                      </h2>
                      <p className="text-xs text-slate-600">
                        {t.doctorPatientDetail.reviewPanelSubtitle}
                      </p>
                    </div>
                  </div>

                  <ReviewStatusBadge
                    sharedWithDoctor={selectedSession.sharedWithDoctor}
                    reviewedStatus={selectedSession.reviewedStatus}
                  />
                </div>

                {selectedReview && (
                  <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50/70 px-3.5 py-2.5 text-xs text-emerald-900">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-700" aria-hidden="true" />
                    <span>
                      {t.doctorPatientDetail.reviewedByOn}{' '}
                      <strong>{formatDateTime(selectedReview.reviewDate, language)}</strong>
                    </span>
                  </div>
                )}

                <form onSubmit={handleReviewSubmit} className="space-y-4" noValidate>
                  <div>
                    <label
                      htmlFor="clinical-review-note"
                      className="block text-sm font-semibold text-navy-900"
                    >
                      {t.doctorPatientDetail.clinicalNoteLabel}
                    </label>
                    <textarea
                      id="clinical-review-note"
                      rows={4}
                      value={noteInput}
                      onChange={(e) => {
                        setNoteInput(e.target.value);
                        if (noteError) setNoteError(null);
                      }}
                      placeholder={t.doctorPatientDetail.clinicalNotePlaceholder}
                      aria-invalid={noteError ? 'true' : 'false'}
                      aria-describedby={noteError ? 'clinical-note-error' : undefined}
                      className="mt-2 w-full rounded-xl border border-slate-300 bg-white p-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                    />
                    {noteError && (
                      <p
                        id="clinical-note-error"
                        role="alert"
                        className="mt-1.5 text-xs font-semibold text-rose-700"
                      >
                        {noteError}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <ShieldCheck className="h-4 w-4 shrink-0 text-teal-700" aria-hidden="true" />
                      <span>{t.doctorPatientDetail.clinicalEthicsReminder}</span>
                    </div>

                    <button
                      type="submit"
                      className="inline-flex min-h-[44px] shrink-0 items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 text-sm font-semibold text-white shadow-xs transition hover:bg-teal-700 focus-visible:outline-2 focus-visible:outline-teal-600"
                    >
                      <ClipboardCheck className="h-4 w-4" aria-hidden="true" />
                      <span>
                        {selectedReview
                          ? t.doctorPatientDetail.updateReviewBtn
                          : t.doctorPatientDetail.saveReviewBtn}
                      </span>
                    </button>
                  </div>
                </form>
              </section>
            )}
          </div>

          {/* Full Selected Session Measurements & Visualizations */}
          {selectedSession && (
            <div className="space-y-3 pt-2">
              <SessionResultsDetail
                session={selectedSession}
                review={selectedReview}
                showDoctorActions={false}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

