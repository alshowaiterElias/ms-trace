import React, { useState } from 'react';
import {
  AlertTriangle,
  Globe,
  Hand,
  RotateCcw,
  Shield,
  User,
  Volume2,
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import {
  formatDate,
  formatHandLabel,
  getLocalizedText,
} from '../../utils/formatters';

export const ProfilePage: React.FC = () => {
  const { state, language, t, activePatient, activeDoctor, assignedDoctor } =
    useAppState();

  if (state.activeRole === 'doctor') {
    return (
      <div className="space-y-6">
        <section className="hc-card rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <h1 className="text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl">
            {t.profilePage.title}
          </h1>
          <p className="mt-1 text-sm text-slate-600 hc-muted">
            {t.profilePage.doctorProfileNote}
          </p>
        </section>

        <section className="hc-card rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-700 text-xl font-bold text-white">
              {activeDoctor.avatarInitials}
            </div>
            <div>
              <h2 className="text-xl font-bold text-navy-900">
                {getLocalizedText(activeDoctor.fullName, language)}
              </h2>
              <p className="text-sm font-medium text-teal-800">
                {getLocalizedText(activeDoctor.specialty, language)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs font-medium text-slate-500">
                {t.myDoctor.hospitalLabel}
              </div>
              <div className="mt-1 text-sm font-semibold text-navy-900">
                {getLocalizedText(activeDoctor.hospital, language)}
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs font-medium text-slate-500">
                {t.profilePage.emailLabel}
              </div>
              <div className="mt-1 text-sm font-semibold text-navy-900" dir="ltr">
                {activeDoctor.email}
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs font-medium text-slate-500">
                {t.myDoctor.phoneLabel}
              </div>
              <div className="mt-1 text-sm font-semibold text-navy-900 tabular-nums" dir="ltr">
                {activeDoctor.phone}
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs font-medium text-slate-500">
                {t.myDoctor.officeHoursLabel}
              </div>
              <div className="mt-1 text-sm font-semibold text-navy-900">
                {getLocalizedText(activeDoctor.officeHours, language)}
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-500">{t.profilePage.doctorLicenseNote}</p>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="hc-card rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <h1 className="text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl">
          {t.profilePage.title}
        </h1>
        <p className="mt-1 text-sm text-slate-600 hc-muted">{t.profilePage.subtitle}</p>
      </section>

      <section className="hc-card rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-navy-900 text-xl font-bold text-white">
            {activePatient.avatarInitials}
          </div>
          <div>
            <h2 className="text-xl font-bold text-navy-900">
              {getLocalizedText(activePatient.fullName, language)}
            </h2>
            <div className="mt-1 inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-0.5 font-mono text-xs font-medium text-slate-700">
              <User className="h-3.5 w-3.5 text-teal-700" aria-hidden="true" />
              <span>{activePatient.medicalRecordNumber}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-xs font-medium text-slate-500">
              {t.profilePage.patientIdLabel}
            </div>
            <div className="mt-1 font-mono text-sm font-semibold text-navy-900">
              {activePatient.medicalRecordNumber}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-xs font-medium text-slate-500">
              {t.profilePage.dobLabel}
            </div>
            <div className="mt-1 text-sm font-semibold text-navy-900">
              {formatDate(activePatient.dateOfBirth, language)}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-xs font-medium text-slate-500">
              {t.profilePage.emailLabel}
            </div>
            <div className="mt-1 text-sm font-semibold text-navy-900" dir="ltr">
              {activePatient.email}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-xs font-medium text-slate-500">
              {t.profilePage.preferredHandLabel}
            </div>
            <div className="mt-1 text-sm font-semibold text-navy-900">
              {formatHandLabel(activePatient.preferredHand, language)}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-xs font-medium text-slate-500">
              {t.profilePage.clinicUnitLabel}
            </div>
            <div className="mt-1 text-sm font-semibold text-navy-900">
              {getLocalizedText(activePatient.clinicUnit, language)}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-xs font-medium text-slate-500">
              {t.profilePage.assignedDoctorLabel}
            </div>
            <div className="mt-1 text-sm font-semibold text-navy-900">
              {getLocalizedText(assignedDoctor.fullName, language)}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export const SettingsPage: React.FC = () => {
  const { state, language, t, setLanguage, updateSettings, resetDemoData } =
    useAppState();
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);

  return (
    <div className="space-y-6">
      <section className="hc-card rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <h1 className="text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl">
          {t.settingsPage.title}
        </h1>
        <p className="mt-1 text-sm text-slate-600 hc-muted">{t.settingsPage.subtitle}</p>
      </section>

      {/* Language & Directionality */}
      <section className="hc-card rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-start gap-3">
          <Globe className="mt-0.5 h-5 w-5 text-teal-700" aria-hidden="true" />
          <div>
            <h2 className="text-base font-semibold text-navy-900">
              {t.settingsPage.languageSectionTitle}
            </h2>
            <p className="mt-0.5 text-sm text-slate-600 hc-muted">
              {t.settingsPage.languageSectionDesc}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 max-w-md">
          <button
            type="button"
            onClick={() => setLanguage('en')}
            aria-pressed={language === 'en'}
            className={`min-h-[48px] rounded-xl border-2 px-4 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-teal-600 ${
              language === 'en'
                ? 'border-navy-900 bg-navy-50 text-navy-900'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            English (LTR)
          </button>
          <button
            type="button"
            onClick={() => setLanguage('ar')}
            aria-pressed={language === 'ar'}
            className={`min-h-[48px] rounded-xl border-2 px-4 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-teal-600 ${
              language === 'ar'
                ? 'border-navy-900 bg-navy-50 text-navy-900'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            العربية (RTL)
          </button>
        </div>
      </section>

      {/* Test Preferences */}
      {state.activeRole === 'patient' && (
        <section className="hc-card rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-2.5">
            <Hand className="h-5 w-5 text-teal-700" aria-hidden="true" />
            <h2 className="text-base font-semibold text-navy-900">
              {t.settingsPage.testPreferencesTitle}
            </h2>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium text-slate-700">
              {t.settingsPage.defaultHandLabel}
            </div>
            <div className="grid grid-cols-2 gap-3 max-w-md">
              {(['right', 'left'] as const).map((hand) => (
                <button
                  key={hand}
                  type="button"
                  onClick={() => updateSettings({ preferredHand: hand })}
                  aria-pressed={state.settings.preferredHand === hand}
                  className={`min-h-[46px] rounded-xl border-2 px-4 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-teal-600 ${
                    state.settings.preferredHand === hand
                      ? 'border-navy-900 bg-navy-50 text-navy-900'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {formatHandLabel(hand, language)}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-4">
            <div className="flex items-start gap-3">
              <Volume2 className="mt-0.5 h-5 w-5 text-slate-600" aria-hidden="true" />
              <div>
                <div className="text-sm font-semibold text-slate-900">
                  {t.settingsPage.soundFeedbackTitle}
                </div>
                <div className="text-xs text-slate-600">
                  {t.settingsPage.soundFeedbackDesc}
                </div>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={state.settings.soundFeedbackEnabled}
              onClick={() =>
                updateSettings({
                  soundFeedbackEnabled: !state.settings.soundFeedbackEnabled,
                })
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
      )}

      {/* Visual & Motor Accessibility */}
      <section className="hc-card rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5">
          <Shield className="h-5 w-5 text-teal-700" aria-hidden="true" />
          <h2 className="text-base font-semibold text-navy-900">
            {t.settingsPage.accessibilityTitle}
          </h2>
        </div>

        <div className="flex items-center justify-between gap-4 py-2">
          <div>
            <div className="text-sm font-semibold text-slate-900">
              {t.settingsPage.highContrastTitle}
            </div>
            <div className="text-xs text-slate-600">{t.settingsPage.highContrastDesc}</div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={state.settings.highContrastMode}
            onClick={() =>
              updateSettings({ highContrastMode: !state.settings.highContrastMode })
            }
            className={`relative inline-flex h-8 w-14 shrink-0 items-center rounded-full transition focus-visible:outline-2 focus-visible:outline-teal-600 ${
              state.settings.highContrastMode ? 'bg-teal-600' : 'bg-slate-300'
            }`}
          >
            <span
              className={`inline-block h-6 w-6 rounded-full bg-white shadow-xs transition-transform ${
                state.settings.highContrastMode
                  ? 'translate-x-7 rtl:-translate-x-7'
                  : 'translate-x-1 rtl:-translate-x-1'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-4">
          <div>
            <div className="text-sm font-semibold text-slate-900">
              {t.settingsPage.reducedMotionTitle}
            </div>
            <div className="text-xs text-slate-600">{t.settingsPage.reducedMotionDesc}</div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={state.settings.reducedMotion}
            onClick={() =>
              updateSettings({ reducedMotion: !state.settings.reducedMotion })
            }
            className={`relative inline-flex h-8 w-14 shrink-0 items-center rounded-full transition focus-visible:outline-2 focus-visible:outline-teal-600 ${
              state.settings.reducedMotion ? 'bg-teal-600' : 'bg-slate-300'
            }`}
          >
            <span
              className={`inline-block h-6 w-6 rounded-full bg-white shadow-xs transition-transform ${
                state.settings.reducedMotion
                  ? 'translate-x-7 rtl:-translate-x-7'
                  : 'translate-x-1 rtl:-translate-x-1'
              }`}
            />
          </button>
        </div>
      </section>

      {/* Demo Data Reset */}
      <section className="hc-card rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div>
          <h2 className="text-base font-semibold text-navy-900">
            {t.settingsPage.demoDataSectionTitle}
          </h2>
          <p className="mt-1 text-sm text-slate-600 hc-muted">
            {t.settingsPage.demoDataSectionDesc}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setConfirmResetOpen(true)}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 text-sm font-semibold text-rose-800 hover:bg-rose-100 focus-visible:outline-2 focus-visible:outline-rose-600"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          <span>{t.settingsPage.resetDemoBtn}</span>
        </button>
      </section>

      {confirmResetOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="reset-demo-title"
        >
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-6 w-6 shrink-0 text-amber-700" />
              <div>
                <h3 id="reset-demo-title" className="text-lg font-semibold text-navy-900">
                  {t.settingsPage.resetConfirmTitle}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {t.settingsPage.resetConfirmBody}
                </p>
              </div>
            </div>
            <div className="mt-6 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setConfirmResetOpen(false)}
                className="min-h-[44px] rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                {t.common.cancel}
              </button>
              <button
                type="button"
                onClick={() => {
                  setConfirmResetOpen(false);
                  resetDemoData();
                }}
                className="min-h-[44px] rounded-xl bg-rose-700 px-4 text-sm font-semibold text-white hover:bg-rose-800"
              >
                {t.common.confirm}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

