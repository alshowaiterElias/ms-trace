import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AlertTriangle, Globe, Hand, Volume2, VolumeX, XCircle } from 'lucide-react';
import { TAPPING_TEST_CONFIG } from '../../config/testProtocol';
import { useAppState } from '../../context/AppStateContext';
import type { HandTested, InputMethodSummary } from '../../types/domain';
import { playSubtleTapTick } from '../../utils/audioFeedback';
import { formatDecimal, formatHandLabel, formatInteger } from '../../utils/formatters';

interface RippleItem {
  id: number;
}

export const ActiveTappingTestPage: React.FC<{ hand: HandTested }> = ({ hand }) => {
  const { state, language, t, setLanguage, setRoute, recordCompletedTest, updateSettings } =
    useAppState();

  const durationSeconds = TAPPING_TEST_CONFIG.defaultDurationSeconds;
  const durationMs = durationSeconds * 1000;

  const [tapCount, setTapCount] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(durationSeconds);
  const [isPressed, setIsPressed] = useState(false);
  const [ripples, setRipples] = useState<RippleItem[]>([]);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);

  const startTimeRef = useRef<number>(performance.now());
  const tapTimestampsRef = useRef<number[]>([]);
  const lastAcceptedPerfMsRef = useRef<number>(-Infinity);
  const finishedRef = useRef<boolean>(false);
  const activePointersRef = useRef<Set<number>>(new Set());
  const pressedKeysRef = useRef<Set<string>>(new Set());
  const usedPointerRef = useRef<boolean>(false);
  const usedKeyboardRef = useRef<boolean>(false);
  const rippleIdRef = useRef<number>(0);

  const cancelModalOpenRef = useRef<boolean>(false);
  cancelModalOpenRef.current = cancelModalOpen;
  const pauseStartRef = useRef<number | null>(null);

  const openCancelModal = useCallback(() => {
    if (pauseStartRef.current === null) {
      pauseStartRef.current = performance.now();
    }
    setCancelModalOpen(true);
  }, []);

  const closeCancelModal = useCallback(() => {
    if (pauseStartRef.current !== null) {
      const pausedDuration = performance.now() - pauseStartRef.current;
      startTimeRef.current += pausedDuration;
      if (lastAcceptedPerfMsRef.current > 0) {
        lastAcceptedPerfMsRef.current += pausedDuration;
      }
      pauseStartRef.current = null;
    }
    setCancelModalOpen(false);
  }, []);

  const soundEnabledRef = useRef<boolean>(state.settings.soundFeedbackEnabled);
  soundEnabledRef.current = state.settings.soundFeedbackEnabled;

  const cancelBtnRef = useRef<HTMLButtonElement | null>(null);
  const soundBtnRef = useRef<HTMLButtonElement | null>(null);
  const langBtnRef = useRef<HTMLButtonElement | null>(null);

  const finalizeCompletedSession = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;

    let inputMethodSummary: InputMethodSummary = 'pointer';
    if (usedPointerRef.current && usedKeyboardRef.current) {
      inputMethodSummary = 'mixed';
    } else if (usedKeyboardRef.current) {
      inputMethodSummary = 'keyboard';
    }

    const session = recordCompletedTest({
      handTested: hand,
      durationSeconds,
      rawTapTimestamps: tapTimestampsRef.current,
      inputMethodSummary,
    });

    setRoute({ page: 'patient_results', sessionId: session.id });
  }, [durationSeconds, hand, recordCompletedTest, setRoute]);

  // Accurate high-resolution countdown loop backed by performance.now()
  useEffect(() => {
    startTimeRef.current = performance.now();
    tapTimestampsRef.current = [];
    lastAcceptedPerfMsRef.current = -Infinity;
    finishedRef.current = false;

    let rafId = 0;

    const tick = () => {
      if (finishedRef.current) return;
      if (!cancelModalOpenRef.current) {
        const elapsed = performance.now() - startTimeRef.current;
        const remainingMs = Math.max(0, durationMs - elapsed);
        setRemainingSeconds(remainingMs / 1000);

        if (elapsed >= durationMs) {
          finalizeCompletedSession();
          return;
        }
      }

      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);
    return () => {
      window.cancelAnimationFrame(rafId);
    };
  }, [durationMs, finalizeCompletedSession]);

  const registerAcceptedTap = useCallback(
    (source: 'pointer' | 'keyboard') => {
      if (finishedRef.current || cancelModalOpenRef.current) return;

      const now = performance.now();
      const elapsedMs = now - startTimeRef.current;
      if (elapsedMs < 0 || elapsedMs > durationMs) {
        return;
      }

      // Guard against sub-25ms hardware digitizer bounce
      if (now - lastAcceptedPerfMsRef.current < TAPPING_TEST_CONFIG.minDebounceMs) {
        return;
      }
      lastAcceptedPerfMsRef.current = now;

      if (source === 'pointer') {
        usedPointerRef.current = true;
      } else {
        usedKeyboardRef.current = true;
      }

      tapTimestampsRef.current.push(Math.round(elapsedMs * 100) / 100);
      setTapCount((prev) => prev + 1);

      if (soundEnabledRef.current) {
        playSubtleTapTick();
      }

      if (!state.settings.reducedMotion) {
        const nextId = ++rippleIdRef.current;
        setRipples((prev) => [...prev.slice(-2), { id: nextId }]);
        window.setTimeout(() => {
          setRipples((prev) => prev.filter((item) => item.id !== nextId));
        }, 340);
      }
    },
    [durationMs, state.settings.reducedMotion],
  );

  // Release pointer tracking cleanly even if pointer leaves target before lifting
  useEffect(() => {
    const releasePointer = (e: PointerEvent) => {
      activePointersRef.current.delete(e.pointerId);
      if (activePointersRef.current.size === 0) {
        setIsPressed(false);
      }
    };

    const clearAllInputs = () => {
      activePointersRef.current.clear();
      pressedKeysRef.current.clear();
      setIsPressed(false);
    };

    window.addEventListener('pointerup', releasePointer);
    window.addEventListener('pointercancel', releasePointer);
    window.addEventListener('blur', clearAllInputs);

    return () => {
      window.removeEventListener('pointerup', releasePointer);
      window.removeEventListener('pointercancel', releasePointer);
      window.removeEventListener('blur', clearAllInputs);
    };
  }, []);

  // Accessible Keyboard Input (Space / Enter) — strictly ignores OS key-repeat holds
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        if (cancelModalOpenRef.current) {
          closeCancelModal();
        } else {
          openCancelModal();
        }
        return;
      }

      if (cancelModalOpenRef.current || finishedRef.current) return;

      // Do not hijack Space/Enter if user explicitly focused header control buttons
      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl === cancelBtnRef.current ||
          activeEl === soundBtnRef.current ||
          activeEl === langBtnRef.current)
      ) {
        return;
      }

      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        if (e.repeat || pressedKeysRef.current.has(e.code)) {
          return;
        }
        pressedKeysRef.current.add(e.code);
        setIsPressed(true);
        registerAcceptedTap('keyboard');
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        pressedKeysRef.current.delete(e.code);
        if (pressedKeysRef.current.size === 0 && activePointersRef.current.size === 0) {
          setIsPressed(false);
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [registerAcceptedTap, openCancelModal, closeCancelModal]);

  const handleTargetPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (finishedRef.current || cancelModalOpen) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;

    // Prevent long-press or second resting finger from registering extra taps
    if (activePointersRef.current.has(e.pointerId) || activePointersRef.current.size > 0) {
      return;
    }

    activePointersRef.current.add(e.pointerId);
    setIsPressed(true);
    registerAcceptedTap('pointer');
  };

  const handleConfirmAbort = () => {
    finishedRef.current = true;
    setCancelModalOpen(false);
    // Explicitly do NOT persist incomplete session to completed sessions
    setRoute({ page: 'patient_test_aborted', hand });
  };

  const progressRatio = Math.min(1, Math.max(0, (durationSeconds - remainingSeconds) / durationSeconds));
  const progressPercent = Math.round(progressRatio * 100);

  return (
    <div className="flex min-h-[calc(100vh-3rem)] flex-col justify-between gap-6">
      {/* Minimal Distraction-Free Top Bar */}
      <header className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-xs">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-navy-900 px-3 py-1.5 text-xs font-semibold text-white">
            <Hand className="h-3.5 w-3.5 text-teal-300" aria-hidden="true" />
            <span>
              {t.activeTest.testingHandPrefix}: {formatHandLabel(hand, language)}
            </span>
          </span>
          <span className="hidden text-xs font-medium text-slate-500 sm:inline">
            {t.activeTest.distractionFreeLabel}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            ref={langBtnRef}
            type="button"
            onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
            aria-label={t.common.switchLanguageAria}
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-700 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-teal-600"
          >
            <Globe className="h-4 w-4 text-slate-500" aria-hidden="true" />
            <span>{language === 'en' ? 'العربية' : 'EN'}</span>
          </button>

          <button
            ref={soundBtnRef}
            type="button"
            onClick={() =>
              updateSettings({ soundFeedbackEnabled: !state.settings.soundFeedbackEnabled })
            }
            aria-pressed={state.settings.soundFeedbackEnabled}
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-700 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-teal-600"
          >
            {state.settings.soundFeedbackEnabled ? (
              <>
                <Volume2 className="h-4 w-4 text-teal-700" aria-hidden="true" />
                <span className="hidden sm:inline">{t.activeTest.soundOn}</span>
              </>
            ) : (
              <>
                <VolumeX className="h-4 w-4 text-slate-500" aria-hidden="true" />
                <span className="hidden sm:inline">{t.activeTest.soundOff}</span>
              </>
            )}
          </button>

          <button
            ref={cancelBtnRef}
            type="button"
            onClick={openCancelModal}
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 text-xs font-semibold text-rose-800 hover:bg-rose-100 focus-visible:outline-2 focus-visible:outline-rose-600"
          >
            <XCircle className="h-4 w-4" aria-hidden="true" />
            <span>{t.activeTest.cancelTestBtn}</span>
          </button>
        </div>
      </header>

      {/* Core Measurement Surface */}
      <div className="flex flex-1 flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white px-4 py-8 shadow-xs sm:px-8">
        {/* Live Countdown & Tap Counter */}
        <div className="grid w-full max-w-md grid-cols-2 gap-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {t.activeTest.remainingTimeLabel}
            </div>
            <div
              className="mt-1 text-3xl font-bold text-navy-900 tabular-nums sm:text-4xl"
              aria-live="off"
            >
              {formatDecimal(remainingSeconds, language, 1)}{' '}
              <span className="text-base font-medium text-slate-600">
                {t.common.secondsShort}
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-teal-200 bg-teal-50/70 p-4 text-center">
            <div className="text-xs font-semibold uppercase tracking-wide text-teal-800">
              {t.activeTest.tapsRecordedLabel}
            </div>
            <div
              className="mt-1 text-3xl font-bold text-teal-900 tabular-nums sm:text-4xl"
              aria-live="polite"
            >
              {formatInteger(tapCount, language)}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-5 w-full max-w-md">
          <div className="mb-1.5 flex items-center justify-between text-xs font-medium text-slate-500">
            <span>{t.activeTest.progressLabel}</span>
            <span className="tabular-nums">{formatInteger(progressPercent, language)}%</span>
          </div>
          <div
            role="progressbar"
            aria-valuenow={progressPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={t.activeTest.progressLabel}
            className="h-3 w-full overflow-hidden rounded-full bg-slate-100 border border-slate-200"
          >
            <div
              className="h-full rounded-full bg-teal-600 transition-[width] duration-75"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Large Accessible Circular Tapping Target */}
        <div className="relative my-8 flex items-center justify-center sm:my-10">
          {/* Calm Expanding Ripple Feedback Rings */}
          {ripples.map((ripple) => (
            <span
              key={ripple.id}
              aria-hidden="true"
              className="animate-tap-ripple pointer-events-none absolute h-64 w-64 rounded-full border-4 border-teal-500 sm:h-72 sm:w-72"
            />
          ))}

          <button
            type="button"
            aria-label={t.activeTest.tapTargetAriaLabel}
            onPointerDown={handleTargetPointerDown}
            onContextMenu={(e) => e.preventDefault()}
            className={`tap-surface relative flex h-60 w-60 flex-col items-center justify-center rounded-full border-4 transition-transform duration-75 sm:h-72 sm:w-72 focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-teal-600 ${
              isPressed
                ? 'scale-[0.96] border-teal-500 bg-navy-800 text-white shadow-inner'
                : 'scale-100 border-teal-400 bg-navy-900 text-white shadow-lg hover:bg-navy-800'
            }`}
          >
            <span className="text-2xl font-bold tracking-wide sm:text-3xl">
              {t.activeTest.tapPromptMain}
            </span>
            <span className="mt-2 max-w-[190px] text-center text-xs leading-snug text-teal-200 sm:text-sm">
              {t.activeTest.tapPromptSub}
            </span>
          </button>
        </div>

        <p className="text-center text-xs text-slate-500 sm:text-sm">
          {t.activeTest.keyboardHint}
        </p>
      </div>

      {/* Cancel Test Confirmation Modal */}
      {cancelModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cancel-test-modal-title"
        >
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-800">
                <AlertTriangle className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <h2 id="cancel-test-modal-title" className="text-lg font-semibold text-navy-900">
                  {t.activeTest.cancelModalTitle}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {t.activeTest.cancelModalBody}
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeCancelModal}
                className="min-h-[44px] rounded-xl border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-800 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-teal-600"
              >
                {t.activeTest.cancelModalKeepGoing}
              </button>
              <button
                type="button"
                onClick={handleConfirmAbort}
                className="min-h-[44px] rounded-xl bg-rose-700 px-5 text-sm font-semibold text-white hover:bg-rose-800 focus-visible:outline-2 focus-visible:outline-rose-600"
              >
                {t.activeTest.cancelModalDiscard}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const AbortedTestPage: React.FC = () => {
  const { t, setRoute } = useAppState();
  return (
    <div className="mx-auto max-w-xl py-8">
      <div className="hc-card rounded-2xl border border-amber-200 bg-white p-6 shadow-xs space-y-5">
        <div className="flex items-start gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
            <AlertTriangle className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-navy-900">{t.activeTest.abortedBannerTitle}</h1>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
              {t.activeTest.abortedBannerBody}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => setRoute({ page: 'patient_test_intro' })}
            className="min-h-[46px] flex-1 rounded-xl bg-navy-900 px-5 text-sm font-semibold text-white hover:bg-navy-800 focus-visible:outline-2 focus-visible:outline-teal-600"
          >
            {t.activeTest.abortedTryAgainBtn}
          </button>
          <button
            type="button"
            onClick={() => setRoute({ page: 'patient_dashboard' })}
            className="min-h-[46px] flex-1 rounded-xl border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-800 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-teal-600"
          >
            {t.activeTest.abortedBackDashboardBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
