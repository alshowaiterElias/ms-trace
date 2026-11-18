import React, { useEffect } from 'react';
import { Activity, Info, ShieldCheck, X } from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';

export const AboutModal: React.FC = () => {
  const { aboutModalOpen, setAboutModalOpen, t } = useAppState();

  useEffect(() => {
    if (!aboutModalOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setAboutModalOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [aboutModalOpen, setAboutModalOpen]);

  if (!aboutModalOpen) return null;

  const sections = [
    { title: t.aboutModal.sections.whatIsTitle, body: t.aboutModal.sections.whatIsBody },
    { title: t.aboutModal.sections.whatMeasuresTitle, body: t.aboutModal.sections.whatMeasuresBody },
    { title: t.aboutModal.sections.howPerformTitle, body: t.aboutModal.sections.howPerformBody },
    { title: t.aboutModal.sections.meaningTitle, body: t.aboutModal.sections.meaningBody },
    { title: t.aboutModal.sections.doctorFlowTitle, body: t.aboutModal.sections.doctorFlowBody },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="about-mstrace-title"
      onClick={() => setAboutModalOpen(false)}
    >
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 flex items-start justify-between gap-4 border-b border-slate-200 bg-white px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-900 text-white">
              <Activity className="h-5 w-5 text-teal-400" aria-hidden="true" />
            </div>
            <div>
              <h2 id="about-mstrace-title" className="text-lg font-semibold text-slate-900">
                {t.aboutModal.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">{t.aboutModal.subtitle}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setAboutModalOpen(false)}
            aria-label={t.common.close}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 focus-visible:outline-2 focus-visible:outline-teal-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 px-6 py-5">
          {sections.map((sec) => (
            <div
              key={sec.title}
              className="rounded-xl border border-slate-200 bg-slate-50/60 p-4"
            >
              <h3 className="text-sm font-semibold text-navy-900">{sec.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-700">{sec.body}</p>
            </div>
          ))}

          <div className="flex items-start gap-3 rounded-xl border border-teal-200 bg-teal-50/70 p-4 text-sm text-teal-950">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-teal-700" aria-hidden="true" />
            <p className="leading-relaxed">{t.aboutModal.scientificNotice}</p>
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs sm:text-sm text-slate-800">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" aria-hidden="true" />
            <p className="leading-relaxed">{t.disclaimer.bannerText}</p>
          </div>
        </div>

        <div className="flex justify-end border-t border-slate-200 bg-slate-50 px-6 py-3.5">
          <button
            type="button"
            onClick={() => setAboutModalOpen(false)}
            className="min-h-[44px] rounded-xl bg-navy-900 px-6 text-sm font-semibold text-white transition hover:bg-navy-800 focus-visible:outline-2 focus-visible:outline-teal-600"
          >
            {t.aboutModal.closeBtn}
          </button>
        </div>
      </div>
    </div>
  );
};

