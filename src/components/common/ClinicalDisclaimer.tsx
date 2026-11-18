import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';

export const ClinicalDisclaimerBanner: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { t } = useAppState();

  return (
    <aside
      aria-label={t.disclaimer.bannerTitle}
      className={`hc-card rounded-xl border border-amber-200/80 bg-amber-50/70 ${
        compact ? 'px-4 py-3' : 'px-5 py-4'
      }`}
    >
      <div className="flex items-start gap-3">
        <ShieldAlert
          className="mt-0.5 h-5 w-5 shrink-0 text-amber-700"
          aria-hidden="true"
        />
        <div className="space-y-0.5 text-sm leading-relaxed text-slate-700">
          <p className="font-semibold text-slate-900">{t.disclaimer.bannerTitle}</p>
          <p className="hc-muted text-xs sm:text-sm text-slate-700">{t.disclaimer.bannerText}</p>
        </div>
      </div>
    </aside>
  );
};

export const ClinicalFooter: React.FC = () => {
  const { t } = useAppState();
  return (
    <footer className="mt-10 border-t border-slate-200 pt-5 pb-6 text-xs text-slate-500 hc-muted">
      <p className="leading-relaxed">{t.disclaimer.footerText}</p>
    </footer>
  );
};

