import React, { useEffect, useRef, useState } from 'react';
import {
  Activity,
  ChevronDown,
  ClipboardList,
  Globe,
  History,
  Info,
  LayoutDashboard,
  Menu,
  Settings,
  Stethoscope,
  User,
  UserCheck,
  Users,
  X,
} from 'lucide-react';
import { useAppState, type AppRoute } from '../../context/AppStateContext';
import { getLocalizedText } from '../../utils/formatters';
import { AboutModal } from '../common/AboutModal';
import { ClinicalFooter } from '../common/ClinicalDisclaimer';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  isActive: (route: AppRoute) => boolean;
  onClick: () => void;
}

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    state,
    language,
    isRtl,
    t,
    route,
    setRoute,
    setAboutModalOpen,
    toastMessage,
    activePatient,
    activeDoctor,
    setLanguage,
    switchToPatientAccount,
    switchToDoctorAccount,
  } = useAppState();

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const roleMenuRef = useRef<HTMLDivElement | null>(null);

  const isDistractionFreeTest = route.page === 'patient_test_active';

  // Close account switcher dropdown on outside click or Escape
  useEffect(() => {
    if (!roleMenuOpen) return;
    const handlePointerDown = (e: MouseEvent) => {
      if (roleMenuRef.current && !roleMenuRef.current.contains(e.target as Node)) {
        setRoleMenuOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setRoleMenuOpen(false);
    };
    document.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('keydown', handleKey);
    };
  }, [roleMenuOpen]);

  const patientNavItems: NavItem[] = [
    {
      id: 'dashboard',
      label: t.nav.dashboard,
      icon: LayoutDashboard,
      isActive: (r) => r.page === 'patient_dashboard',
      onClick: () => {
        setRoute({ page: 'patient_dashboard' });
        setMobileNavOpen(false);
      },
    },
    {
      id: 'tapping-test',
      label: t.nav.tappingTest,
      icon: Activity,
      isActive: (r) =>
        r.page === 'patient_test_intro' ||
        r.page === 'patient_test_active' ||
        r.page === 'patient_test_aborted' ||
        r.page === 'patient_results',
      onClick: () => {
        setRoute({ page: 'patient_test_intro' });
        setMobileNavOpen(false);
      },
    },
    {
      id: 'test-history',
      label: t.nav.testHistory,
      icon: History,
      isActive: (r) => r.page === 'patient_history',
      onClick: () => {
        setRoute({ page: 'patient_history' });
        setMobileNavOpen(false);
      },
    },
    {
      id: 'my-doctor',
      label: t.nav.myDoctor,
      icon: Stethoscope,
      isActive: (r) => r.page === 'patient_doctor',
      onClick: () => {
        setRoute({ page: 'patient_doctor' });
        setMobileNavOpen(false);
      },
    },
    {
      id: 'profile',
      label: t.nav.profile,
      icon: User,
      isActive: (r) => r.page === 'patient_profile',
      onClick: () => {
        setRoute({ page: 'patient_profile' });
        setMobileNavOpen(false);
      },
    },
    {
      id: 'settings',
      label: t.nav.settings,
      icon: Settings,
      isActive: (r) => r.page === 'patient_settings',
      onClick: () => {
        setRoute({ page: 'patient_settings' });
        setMobileNavOpen(false);
      },
    },
  ];

  const doctorNavItems: NavItem[] = [
    {
      id: 'doctor-dashboard',
      label: t.nav.doctorOverview,
      icon: LayoutDashboard,
      isActive: (r) => r.page === 'doctor_dashboard',
      onClick: () => {
        setRoute({ page: 'doctor_dashboard' });
        setMobileNavOpen(false);
      },
    },
    {
      id: 'doctor-patients',
      label: t.nav.patientRoster,
      icon: Users,
      isActive: (r) => r.page === 'doctor_patients' || r.page === 'doctor_patient_detail',
      onClick: () => {
        setRoute({ page: 'doctor_patients' });
        setMobileNavOpen(false);
      },
    },
    {
      id: 'doctor-profile',
      label: t.nav.profile,
      icon: UserCheck,
      isActive: (r) => r.page === 'doctor_profile',
      onClick: () => {
        setRoute({ page: 'doctor_profile' });
        setMobileNavOpen(false);
      },
    },
    {
      id: 'doctor-settings',
      label: t.nav.settings,
      icon: Settings,
      isActive: (r) => r.page === 'doctor_settings',
      onClick: () => {
        setRoute({ page: 'doctor_settings' });
        setMobileNavOpen(false);
      },
    },
  ];

  const navItems = state.activeRole === 'doctor' ? doctorNavItems : patientNavItems;

  const currentAccountName =
    state.activeRole === 'doctor'
      ? getLocalizedText(activeDoctor.fullName, language)
      : getLocalizedText(activePatient.fullName, language);

  const currentAccountBadge =
    state.activeRole === 'doctor' ? t.common.doctorRoleLabel : t.common.patientRoleLabel;

  // Distraction-free layout when Active Tapping Test is running
  if (isDistractionFreeTest) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <main className="mx-auto max-w-4xl px-4 py-4 sm:px-6 sm:py-6">{children}</main>
        <AboutModal />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      {/* Top Application Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
          {/* Start: Mobile Menu Toggle + Brand Logo */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              type="button"
              onClick={() => setMobileNavOpen((prev) => !prev)}
              aria-label={t.nav.dashboard}
              aria-expanded={mobileNavOpen}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 lg:hidden focus-visible:outline-2 focus-visible:outline-teal-600"
            >
              {mobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            <button
              type="button"
              onClick={() =>
                setRoute(
                  state.activeRole === 'doctor'
                    ? { page: 'doctor_dashboard' }
                    : { page: 'patient_dashboard' },
                )
              }
              className="flex items-center gap-2.5 text-start focus-visible:outline-2 focus-visible:outline-teal-600 rounded-lg"
            >
              {/* Clean Clinical Trace Emblem */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy-900 shadow-xs">
                <svg
                  viewBox="0 0 24 24"
                  className="h-6 w-6 text-teal-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M3 12h4l2.5-6 4 12 2.5-6H21" />
                </svg>
              </div>
              <div className="leading-tight">
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold tracking-tight text-navy-900 sm:text-lg">
                    {t.brand.name}
                  </span>
                </div>
                <span className="hidden text-xs text-slate-500 sm:block">
                  {t.brand.subtitle}
                </span>
              </div>
            </button>
          </div>

          {/* End: About Guide + Demo Account Switcher + Language Toggle */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <button
              type="button"
              onClick={() => setAboutModalOpen(true)}
              className="inline-flex min-h-[42px] items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 sm:text-sm focus-visible:outline-2 focus-visible:outline-teal-600"
            >
              <Info className="h-4 w-4 text-teal-700" aria-hidden="true" />
              <span className="hidden md:inline">{t.common.aboutPlatform}</span>
            </button>

            {/* Demo Account / Role Switcher */}
            <div className="relative" ref={roleMenuRef}>
              <button
                type="button"
                onClick={() => setRoleMenuOpen((prev) => !prev)}
                aria-expanded={roleMenuOpen}
                aria-haspopup="menu"
                className="inline-flex min-h-[42px] items-center gap-2 rounded-xl border border-navy-200 bg-navy-50 px-3 text-xs font-medium text-navy-900 transition hover:bg-navy-100 sm:px-3.5 sm:text-sm focus-visible:outline-2 focus-visible:outline-teal-600"
              >
                {state.activeRole === 'doctor' ? (
                  <Stethoscope className="h-4 w-4 shrink-0 text-teal-700" aria-hidden="true" />
                ) : (
                  <User className="h-4 w-4 shrink-0 text-navy-700" aria-hidden="true" />
                )}
                <span className="hidden max-w-[130px] truncate sm:inline">
                  {currentAccountName}
                </span>
                <span className="rounded-md bg-white px-1.5 py-0.5 text-[11px] font-semibold text-teal-800 border border-teal-200">
                  {currentAccountBadge}
                </span>
                <ChevronDown className="h-4 w-4 text-slate-500" aria-hidden="true" />
              </button>

              {roleMenuOpen && (
                <div
                  role="menu"
                  aria-label={t.common.demoRoleSwitcher}
                  className="absolute end-0 mt-2 w-72 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg z-40"
                >
                  <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    {t.common.patientRoleLabel}
                  </div>
                  <div className="space-y-1">
                    {state.patients.map((patient) => {
                      const isCurrent =
                        state.activeRole === 'patient' && activePatient.id === patient.id;
                      return (
                        <button
                          key={patient.id}
                          type="button"
                          role="menuitem"
                          onClick={() => {
                            switchToPatientAccount(patient.id);
                            setRoleMenuOpen(false);
                          }}
                          className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-start text-sm transition ${
                            isCurrent
                              ? 'bg-teal-50 text-teal-950 font-semibold border border-teal-200'
                              : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy-900 text-xs font-semibold text-white">
                              {patient.avatarInitials}
                            </span>
                            <div>
                              <div>{getLocalizedText(patient.fullName, language)}</div>
                              <div className="text-xs font-normal text-slate-500">
                                {patient.medicalRecordNumber}
                              </div>
                            </div>
                          </div>
                          {isCurrent && (
                            <span className="h-2 w-2 rounded-full bg-teal-600" aria-hidden="true" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <div className="my-2 border-t border-slate-100" />
                  <div className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    {t.common.doctorRoleLabel}
                  </div>
                  <div className="space-y-1">
                    {state.doctors.map((doctor) => {
                      const isCurrent =
                        state.activeRole === 'doctor' && activeDoctor.id === doctor.id;
                      return (
                        <button
                          key={doctor.id}
                          type="button"
                          role="menuitem"
                          onClick={() => {
                            switchToDoctorAccount(doctor.id);
                            setRoleMenuOpen(false);
                          }}
                          className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-start text-sm transition ${
                            isCurrent
                              ? 'bg-teal-50 text-teal-950 font-semibold border border-teal-200'
                              : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-700 text-xs font-semibold text-white">
                              {doctor.avatarInitials}
                            </span>
                            <div>
                              <div>{getLocalizedText(doctor.fullName, language)}</div>
                              <div className="text-xs font-normal text-slate-500">
                                {t.common.doctorRoleLabel}
                              </div>
                            </div>
                          </div>
                          {isCurrent && (
                            <span className="h-2 w-2 rounded-full bg-teal-600" aria-hidden="true" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Bilingual Language Selector (Preserves Current Page & State) */}
            <div
              className="inline-flex min-h-[42px] items-center rounded-xl border border-slate-200 bg-slate-100 p-1"
              role="group"
              aria-label={t.common.switchLanguageAria}
            >
              <Globe className="mx-1.5 hidden h-4 w-4 text-slate-500 sm:block" aria-hidden="true" />
              <button
                type="button"
                onClick={() => setLanguage('en')}
                aria-pressed={language === 'en'}
                className={`min-h-[32px] rounded-lg px-2.5 text-xs font-semibold transition focus-visible:outline-2 focus-visible:outline-teal-600 ${
                  language === 'en'
                    ? 'bg-white text-navy-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage('ar')}
                aria-pressed={language === 'ar'}
                className={`min-h-[32px] rounded-lg px-2.5 text-xs font-semibold transition focus-visible:outline-2 focus-visible:outline-teal-600 ${
                  language === 'ar'
                    ? 'bg-white text-navy-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                العربية
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Responsive Workspace: Desktop Sidebar + Content */}
      <div className="mx-auto flex w-full max-w-7xl flex-1">
        {/* Desktop Sidebar */}
        <aside className="hidden w-64 shrink-0 border-e border-slate-200 bg-white lg:block">
          <div className="sticky top-16 flex h-[calc(100vh-4rem)] flex-col justify-between p-4">
            <nav aria-label={t.common.activeAccount} className="space-y-1.5">
              <div className="mb-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  {t.common.activeAccount}
                </div>
                <div className="mt-1 font-semibold text-sm text-navy-900 truncate">
                  {currentAccountName}
                </div>
                <div className="mt-0.5 text-xs text-slate-600">
                  {state.activeRole === 'doctor'
                    ? getLocalizedText(activeDoctor.specialty, language)
                    : `${activePatient.medicalRecordNumber}`}
                </div>
              </div>

              {navItems.map((item) => {
                const Icon = item.icon;
                const active = item.isActive(route);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={item.onClick}
                    aria-current={active ? 'page' : undefined}
                    className={`flex min-h-[46px] w-full items-center gap-3 rounded-xl px-3.5 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-teal-600 ${
                      active
                        ? 'bg-navy-900 text-white shadow-xs'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-navy-900'
                    }`}
                  >
                    <Icon
                      className={`h-5 w-5 shrink-0 ${active ? 'text-teal-300' : 'text-slate-500'}`}
                    />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
              <div className="flex items-center gap-2 font-semibold text-navy-900">
                <ClipboardList className="h-4 w-4 text-teal-700" aria-hidden="true" />
                <span>{t.brand.name}</span>
              </div>
              <p className="mt-1 leading-relaxed">{t.brand.prototypeTag}</p>
            </div>
          </div>
        </aside>

        {/* Mobile Drawer Navigation */}
        {mobileNavOpen && (
          <div className="fixed inset-0 z-40 flex lg:hidden">
            <div
              className="fixed inset-0 bg-slate-900/40"
              onClick={() => setMobileNavOpen(false)}
              aria-hidden="true"
            />
            <nav
              aria-label={t.common.activeAccount}
              className={`relative z-50 flex w-72 max-w-[85vw] flex-col justify-between bg-white p-4 shadow-xl ${
                isRtl ? 'border-s border-slate-200' : 'border-e border-slate-200'
              }`}
            >
              <div>
                <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="font-bold text-navy-900">{t.brand.name}</span>
                  <button
                    type="button"
                    onClick={() => setMobileNavOpen(false)}
                    aria-label={t.common.close}
                    className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-1.5">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = item.isActive(route);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={item.onClick}
                        aria-current={active ? 'page' : undefined}
                        className={`flex min-h-[48px] w-full items-center gap-3 rounded-xl px-3.5 text-sm font-medium transition ${
                          active
                            ? 'bg-navy-900 text-white'
                            : 'text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <Icon
                          className={`h-5 w-5 shrink-0 ${
                            active ? 'text-teal-300' : 'text-slate-500'
                          }`}
                        />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </nav>
          </div>
        )}

        {/* Main Content Container */}
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            {children}
            <ClinicalFooter />
          </div>
        </main>
      </div>

      {/* Transient Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 end-5 z-50 max-w-sm rounded-xl border border-teal-200 bg-navy-900 px-4 py-3 text-sm font-medium text-white shadow-lg"
        >
          {toastMessage}
        </div>
      )}

      <AboutModal />
    </div>
  );
};

