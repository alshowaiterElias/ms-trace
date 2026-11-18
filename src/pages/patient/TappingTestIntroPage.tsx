import React, { useEffect, useRef, useState } from 'react';
import {
  Activity,
  Check,
  Clock,
  Hand,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { TAPPING_TEST_CONFIG } from '../../config/testProtocol';
import { useAppState } from '../../context/AppStateContext';
import type { HandTested } from '../../types/domain';
import { playSubtleTapTick } from '../../utils/audioFeedback';
import { formatInteger } from '../../utils/formatters';

export const TappingTestIntroPage: React.FC = () => {
  const { state, language, t, setRoute, updateSettings } = useAppState();
  const [selectedHand, setSelectedHand] = useState<HandTested>(state.settings.preferredHand);
  const [practiceTaps, setPracticeTaps] = useState(0);
  const [practicePressed, setPracticePressed] = useState(false);

  const activePointersRef = useRef<Set<number>>(new Set());
  const pressedKeysRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const handlePointerEnd = (e: PointerEvent) => {
      activePointersRef.current.delete(e.pointerId);
      if (activePointersRef.current.size === 0) {
        setPracticePressed(false);
      }
    };
    window.addEventListener('pointerup', handlePointerEnd);
    window.addEventListener('pointercancel', handlePointerEnd);
    return () => {
      window.removeEventListener('pointerup', handlePointerEnd);
      window.removeEventListener('pointercancel', handlePointerEnd);
    };
  }, []);

  const registerPracticeTap = () => {
    setPracticeTaps((c) => c + 1);
    if (state.settings.soundFeedbackEnabled) {
      playSubtleTapTick();
    }
  };

  const handlePracticePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    if (activePointersRef.current.has(e.pointerId) || activePointersRef.current.size > 0) {
      return;
    }
    activePointersRef.current.add(e.pointerId);
    setPracticePressed(true);
    registerPracticeTap();
  };

  const handlePracticeKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.code === 'Space' || e.code === 'Enter') {
      e.preventDefault();
      if (e.repeat || pressedKeysRef.current.has(e.code)) return;
      pressedKeysRef.current.add(e.code);
      setPracticePressed(true);
      registerPracticeTap();
    }
  };

  const handlePracticeKeyUp = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.code === 'Space' || e.code === 'Enter') {
      pressedKeysRef.current.delete(e.code);
      if (pressedKeysRef.current.size === 0) {
        setPracticePressed(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <section className="hc-card rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800">
          <Activity className="h-3.5 w-3.5" aria-hidden="true" />
          <span>{t.testIntro.badge}</span>
        </div>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl">
          {t.testIntro.title}
        </h1>
        <p className="mt-1.5 text-sm sm:text-base text-slate-600 hc-muted">
          {t.testIntro.subtitle}
        </p>
      </section>

      {/* Instructions & What is Measured */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="hc-card rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <h2 className="text-base font-semibold text-navy-900">
            {t.testIntro.instructionsTitle}
          </h2>
          <div className="space-y-3 text-sm leading-relaxed text-slate-700">
            {t.testIntro.instructionsParagraphs.map((paragraph, index) => (
              <p key={index} className="rounded-xl bg-slate-50 p-3.5 border border-slate-200/70">
                {paragraph}
              </p>
            ))}
          </div>
          <p className="text-xs text-slate-600">{t.testIntro.accessibilityNote}</p>
        </section>

        <section className="hc-card rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <h2 className="text-base font-semibold text-navy-900">
            {t.testIntro.whatMeasuredTitle}
          </h2>
          <ul className="space-y-3">
            {t.testIntro.whatMeasuredItems.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-50 text-xs font-bold text-teal-700 border border-teal-200">
                  {formatInteger(idx + 1, language)}
                </span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>

          {/* Test Duration Card */}
          <div className="rounded-xl border border-navy-100 bg-navy-50 p-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-navy-800">
              <Clock className="h-4 w-4 text-teal-700" aria-hidden="true" />
              <span>{t.testIntro.durationTitle}</span>
            </div>
            <div className="mt-1 text-base font-bold text-navy-900">
              {t.testIntro.durationValue}
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
              {t.testIntro.protocolNote}
            </p>
          </div>
        </section>
      </div>

      {/* Hand Selection & Optional Sound Feedback */}
      <section className="hc-card rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-5">
        <div>
          <h2 className="text-base font-semibold text-navy-900">
            {t.testIntro.handSelectionTitle}
          </h2>
          <p className="mt-0.5 text-xs sm:text-sm text-slate-600 hc-muted">
            {t.testIntro.handSelectionHint}
          </p>

          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {(['right', 'left'] as const).map((hand) => {
              const active = selectedHand === hand;
              return (
                <button
                  key={hand}
                  type="button"
                  onClick={() => {
                    setSelectedHand(hand);
                    updateSettings({ preferredHand: hand });
                  }}
                  aria-pressed={active}
                  className={`flex min-h-[64px] items-center justify-between rounded-2xl border-2 px-5 py-3 text-start transition focus-visible:outline-2 focus-visible:outline-teal-600 ${
                    active
                      ? 'border-navy-900 bg-navy-50 text-navy-900 shadow-xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                        active
                          ? 'bg-navy-900 text-teal-300'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      <Hand
                        className={`h-5 w-5 ${hand === 'left' ? '-scale-x-100' : ''}`}
                        aria-hidden="true"
                      />
                    </div>
                    <span className="text-base font-semibold">
                      {hand === 'right' ? t.common.rightHand : t.common.leftHand}
                    </span>
                  </div>
                  {active && (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-600 text-white">
                      <Check className="h-4 w-4" aria-hidden="true" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Optional Audio Feedback Switch */}
        <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            {state.settings.soundFeedbackEnabled ? (
              <Volume2 className="mt-0.5 h-5 w-5 shrink-0 text-teal-700" aria-hidden="true" />
            ) : (
              <VolumeX className="mt-0.5 h-5 w-5 shrink-0 text-slate-500" aria-hidden="true" />
            )}
            <div>
              <div className="text-sm font-semibold text-slate-900">
                {t.testIntro.soundToggleLabel}
              </div>
              <div className="text-xs text-slate-600">{t.testIntro.soundToggleHint}</div>
            </div>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={state.settings.soundFeedbackEnabled}
            onClick={() =>
              updateSettings({ soundFeedbackEnabled: !state.settings.soundFeedbackEnabled })
            }
            className={`relative inline-flex h-8 w-14 shrink-0 items-center rounded-full transition focus-visible:outline-2 focus-visible:outline-teal-600 ${
              state.settings.soundFeedbackEnabled ? 'bg-teal-600' : 'bg-slate-300'
            }`}
          >
            <span
              className={`inline-block h-6 w-6 rounded-full bg-white shadow-xs transition-transform ${
                state.settings.soundFeedbackEnabled
                  ? 'translate-x-7 rtl:-translate-x-7'
                  : 'translate-x-1 rtl:-translate-x-1'
              }`}
            />
          </button>
        </div>
      </section>

      {/* Optional Untimed Warm-Up Practice Pad + Start Official Test */}
      <section className="hc-card rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:items-center">
          <div className="space-y-3">
            <h2 className="text-base font-semibold text-navy-900">
              {t.testIntro.practiceTitle}
            </h2>
            <p className="text-sm leading-relaxed text-slate-600 hc-muted">
              {t.testIntro.practiceSubtitle}
            </p>

            <div className="flex items-center gap-4 pt-1">
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5">
                <div className="text-xs text-slate-500">{t.testIntro.practiceCountLabel}</div>
                <div className="text-xl font-bold text-navy-900 tabular-nums">
                  {formatInteger(practiceTaps, language)}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setPracticeTaps(0)}
                className="inline-flex min-h-[42px] items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-teal-600"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{t.testIntro.practiceResetBtn}</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center py-2">
            <button
              type="button"
              onPointerDown={handlePracticePointerDown}
              onKeyDown={handlePracticeKeyDown}
              onKeyUp={handlePracticeKeyUp}
              onContextMenu={(e) => e.preventDefault()}
              className={`tap-surface flex h-40 w-40 flex-col items-center justify-center rounded-full border-4 transition-transform duration-75 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-600 ${
                practicePressed
                  ? 'scale-95 border-teal-600 bg-teal-50 text-navy-900 shadow-inner'
                  : 'border-teal-500/50 bg-slate-50 text-navy-900 shadow-sm hover:border-teal-600 hover:bg-teal-50/40'
              }`}
            >
              <span className="px-4 text-center text-sm font-semibold">
                {t.testIntro.practiceCirclePrompt}
              </span>
            </button>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-end">
          <button
            type="button"
            onClick={() =>
              setRoute({
                page: 'patient_test_active',
                hand: selectedHand,
              })
            }
            className="inline-flex min-h-[54px] w-full items-center justify-center gap-2.5 rounded-2xl bg-teal-600 px-8 text-base font-semibold text-white shadow-sm transition hover:bg-teal-700 sm:w-auto focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
          >
            <Play className="h-5 w-5 fill-current" aria-hidden="true" />
            <span>
              {t.testIntro.startOfficialTestBtn} (
              {formatInteger(TAPPING_TEST_CONFIG.defaultDurationSeconds, language)}{' '}
              {t.common.secondsShort})
            </span>
          </button>
        </div>
      </section>
    </div>
  );
};

