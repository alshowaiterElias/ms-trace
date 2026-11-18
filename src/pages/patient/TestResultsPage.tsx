import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { ClinicalDisclaimerBanner } from '../../components/common/ClinicalDisclaimer';
import { SessionResultsDetail } from '../../components/results/SessionResultsDetail';

export const TestResultsPage: React.FC<{ sessionId: string }> = ({ sessionId }) => {
  const {
    t,
    setRoute,
    patientSessions,
    shareSessionWithDoctor,
    getReviewForSession,
  } = useAppState();

  const session =
    patientSessions.find((s) => s.id === sessionId) ?? patientSessions[0];

  if (!session) {
    return (
      <div className="hc-card rounded-2xl border border-slate-200 bg-white p-8 text-center space-y-4">
        <p className="text-base font-semibold text-navy-900">
          {t.patientDashboard.latestTestEmptyTitle}
        </p>
        <button
          type="button"
          onClick={() => setRoute({ page: 'patient_test_intro' })}
          className="min-h-[44px] rounded-xl bg-navy-900 px-6 text-sm font-semibold text-white hover:bg-navy-800"
        >
          {t.history.startFirstTestBtn}
        </button>
      </div>
    );
  }

  const review = getReviewForSession(session.id);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <button
            type="button"
            onClick={() => setRoute({ page: 'patient_history' })}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700 hover:text-teal-800 focus-visible:outline-2 focus-visible:outline-teal-600 rounded-md"
          >
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
            <span>{t.results.backToHistory}</span>
          </button>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl">
            {t.results.title}
          </h1>
          <p className="mt-1 text-sm text-slate-600 hc-muted">{t.results.subtitle}</p>
        </div>
      </div>

      <ClinicalDisclaimerBanner compact />

      <SessionResultsDetail
        session={session}
        review={review}
        showDoctorActions
        onRetakeTest={() => setRoute({ page: 'patient_test_intro' })}
        onShareWithDoctor={shareSessionWithDoctor}
      />
    </div>
  );
};

