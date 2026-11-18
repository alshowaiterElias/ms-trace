import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { TAPPING_TEST_CONFIG } from '../config/testProtocol';
import { calculateSessionMetrics } from '../engine/tappingMetrics';
import { translations, type TranslationDictionary } from '../i18n/translations';
import {
  loadPersistedState,
  resetPersistedState,
  savePersistedState,
} from '../storage/localStore';
import type {
  AppSettings,
  Doctor,
  DoctorReview,
  HandTested,
  InputMethodSummary,
  Language,
  Patient,
  PersistedAppState,
  TappingTestSession,
} from '../types/domain';

export type AppRoute =
  | { page: 'patient_dashboard' }
  | { page: 'patient_test_intro' }
  | { page: 'patient_test_active'; hand: HandTested }
  | { page: 'patient_test_aborted'; hand: HandTested }
  | { page: 'patient_results'; sessionId: string }
  | { page: 'patient_history' }
  | { page: 'patient_doctor' }
  | { page: 'patient_profile' }
  | { page: 'patient_settings' }
  | { page: 'doctor_dashboard' }
  | { page: 'doctor_patients' }
  | { page: 'doctor_patient_detail'; patientId: string; sessionId?: string }
  | { page: 'doctor_profile' }
  | { page: 'doctor_settings' };

interface RecordCompletedTestPayload {
  handTested: HandTested;
  durationSeconds: number;
  rawTapTimestamps: number[];
  inputMethodSummary: InputMethodSummary;
}

interface AppStateContextValue {
  state: PersistedAppState;
  language: Language;
  isRtl: boolean;
  t: TranslationDictionary;
  route: AppRoute;
  setRoute: (route: AppRoute) => void;
  aboutModalOpen: boolean;
  setAboutModalOpen: (open: boolean) => void;
  toastMessage: string | null;
  showToast: (message: string) => void;
  activePatient: Patient;
  activeDoctor: Doctor;
  assignedDoctor: Doctor;
  patientSessions: TappingTestSession[];
  sharedDoctorSessions: TappingTestSession[];
  setLanguage: (lang: Language) => void;
  switchToPatientAccount: (patientId: string) => void;
  switchToDoctorAccount: (doctorId?: string) => void;
  recordCompletedTest: (payload: RecordCompletedTestPayload) => TappingTestSession;
  shareSessionWithDoctor: (sessionId: string) => void;
  saveDoctorReview: (sessionId: string, note: string) => void;
  getReviewForSession: (sessionId: string) => DoctorReview | undefined;
  updateSettings: (partial: Partial<AppSettings>) => void;
  resetDemoData: () => void;
}

const AppStateContext = createContext<AppStateContextValue | null>(null);

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<PersistedAppState>(() => loadPersistedState());
  const [route, setRoute] = useState<AppRoute>(() =>
    state.activeRole === 'doctor' ? { page: 'doctor_dashboard' } : { page: 'patient_dashboard' },
  );
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync HTML attributes for RTL/LTR, language, and accessibility modes
  useEffect(() => {
    const html = document.documentElement;
    html.lang = state.language;
    html.dir = state.language === 'ar' ? 'rtl' : 'ltr';
    html.classList.toggle('high-contrast', state.settings.highContrastMode);
    html.classList.toggle('reduced-motion', state.settings.reducedMotion);
  }, [state.language, state.settings.highContrastMode, state.settings.reducedMotion]);

  // Persist domain state changes safely
  useEffect(() => {
    savePersistedState(state);
  }, [state]);

  // Auto-dismiss transient feedback toast
  useEffect(() => {
    if (!toastMessage) return;
    const timer = window.setTimeout(() => setToastMessage(null), 4000);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
  }, []);

  const setLanguage = useCallback((language: Language) => {
    setState((prev) => ({ ...prev, language }));
  }, []);

  const switchToPatientAccount = useCallback((patientId: string) => {
    setState((prev) => {
      const target = prev.patients.find((p) => p.id === patientId) ?? prev.patients[0];
      return {
        ...prev,
        activeRole: 'patient',
        activePatientId: target.id,
        settings: {
          ...prev.settings,
          preferredHand: target.preferredHand,
        },
      };
    });
    setRoute({ page: 'patient_dashboard' });
  }, []);

  const switchToDoctorAccount = useCallback((doctorId?: string) => {
    setState((prev) => ({
      ...prev,
      activeRole: 'doctor',
      activeDoctorId: doctorId ?? prev.activeDoctorId,
    }));
    setRoute({ page: 'doctor_dashboard' });
  }, []);

  const activePatient = useMemo(
    () => state.patients.find((p) => p.id === state.activePatientId) ?? state.patients[0],
    [state.patients, state.activePatientId],
  );

  const activeDoctor = useMemo(
    () => state.doctors.find((d) => d.id === state.activeDoctorId) ?? state.doctors[0],
    [state.doctors, state.activeDoctorId],
  );

  const assignedDoctor = useMemo(
    () =>
      state.doctors.find((d) => d.id === activePatient.assignedDoctorId) ?? state.doctors[0],
    [state.doctors, activePatient.assignedDoctorId],
  );

  const patientSessions = useMemo(
    () =>
      state.sessions
        .filter((s) => s.patientId === activePatient.id && s.completionStatus === 'completed')
        .slice()
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
    [state.sessions, activePatient.id],
  );

  const sharedDoctorSessions = useMemo(
    () =>
      state.sessions
        .filter(
          (s) =>
            s.doctorId === activeDoctor.id &&
            s.completionStatus === 'completed' &&
            s.sharedWithDoctor,
        )
        .slice()
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
    [state.sessions, activeDoctor.id],
  );

  const recordCompletedTest = useCallback(
    (payload: RecordCompletedTestPayload): TappingTestSession => {
      const duration = payload.durationSeconds || TAPPING_TEST_CONFIG.defaultDurationSeconds;
      const derived = calculateSessionMetrics(payload.rawTapTimestamps, duration);
      const session: TappingTestSession = {
        id: `sess-live-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        patientId: activePatient.id,
        doctorId: activePatient.assignedDoctorId,
        timestamp: new Date().toISOString(),
        handTested: payload.handTested,
        duration,
        rawTapTimestamps: payload.rawTapTimestamps.slice(),
        totalTapCount: derived.totalTapCount,
        averageTapsPerSecond: derived.averageTapsPerSecond,
        meanInterTapInterval: derived.meanInterTapInterval,
        intervalStandardDeviation: derived.intervalStandardDeviation,
        intervalCoefficientOfVariation: derived.intervalCoefficientOfVariation,
        segmentRates: derived.segmentRates,
        performanceChangePercentage: derived.performanceChangePercentage,
        completionStatus: 'completed',
        sharedWithDoctor: false,
        reviewedStatus: 'not_shared',
        dataOrigin: 'recorded_live',
        inputMethodSummary: payload.inputMethodSummary,
      };

      setState((prev) => ({
        ...prev,
        sessions: [session, ...prev.sessions],
      }));

      return session;
    },
    [activePatient.id, activePatient.assignedDoctorId],
  );

  const shareSessionWithDoctor = useCallback(
    (sessionId: string) => {
      setState((prev) => ({
        ...prev,
        sessions: prev.sessions.map((s) => {
          if (s.id !== sessionId) return s;
          return {
            ...s,
            sharedWithDoctor: true,
            reviewedStatus: s.reviewedStatus === 'reviewed' ? 'reviewed' : 'pending_review',
          };
        }),
      }));
      const dict = translations[state.language];
      setToastMessage(dict.common.sharedSuccessToast);
    },
    [state.language],
  );

  const saveDoctorReview = useCallback(
    (sessionId: string, note: string) => {
      const trimmed = note.trim();
      if (!trimmed) return;

      const nowIso = new Date().toISOString();
      setState((prev) => {
        const existingIdx = prev.reviews.findIndex((r) => r.testSessionId === sessionId);
        let updatedReviews: DoctorReview[];

        if (existingIdx >= 0) {
          updatedReviews = prev.reviews.map((r, idx) =>
            idx === existingIdx
              ? { ...r, note: trimmed, demoNoteLocalized: undefined, reviewDate: nowIso }
              : r,
          );
        } else {
          updatedReviews = [
            {
              id: `rev-${Date.now()}`,
              doctorId: prev.activeDoctorId,
              testSessionId: sessionId,
              note: trimmed,
              reviewDate: nowIso,
            },
            ...prev.reviews,
          ];
        }

        return {
          ...prev,
          reviews: updatedReviews,
          sessions: prev.sessions.map((s) =>
            s.id === sessionId ? { ...s, reviewedStatus: 'reviewed', sharedWithDoctor: true } : s,
          ),
        };
      });

      const dict = translations[state.language];
      setToastMessage(dict.doctorPatientDetail.reviewSavedToast);
    },
    [state.language],
  );

  const getReviewForSession = useCallback(
    (sessionId: string) => state.reviews.find((r) => r.testSessionId === sessionId),
    [state.reviews],
  );

  const updateSettings = useCallback((partial: Partial<AppSettings>) => {
    setState((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        ...partial,
      },
    }));
  }, []);

  const resetDemoData = useCallback(() => {
    const fresh = resetPersistedState();
    setState((prev) => ({
      ...fresh,
      language: prev.language, // Preserve user's active language on demo reset
    }));
    setRoute({ page: 'patient_dashboard' });
    const dict = translations[state.language];
    setToastMessage(dict.settingsPage.resetSuccessMsg);
  }, [state.language]);

  const t = translations[state.language];
  const isRtl = state.language === 'ar';

  const value: AppStateContextValue = {
    state,
    language: state.language,
    isRtl,
    t,
    route,
    setRoute,
    aboutModalOpen,
    setAboutModalOpen,
    toastMessage,
    showToast,
    activePatient,
    activeDoctor,
    assignedDoctor,
    patientSessions,
    sharedDoctorSessions,
    setLanguage,
    switchToPatientAccount,
    switchToDoctorAccount,
    recordCompletedTest,
    shareSessionWithDoctor,
    saveDoctorReview,
    getReviewForSession,
    updateSettings,
    resetDemoData,
  };

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
};

export function useAppState(): AppStateContextValue {
  const ctx = useContext(AppStateContext);
  if (!ctx) {
    throw new Error('useAppState must be used within AppStateProvider');
  }
  return ctx;
}

