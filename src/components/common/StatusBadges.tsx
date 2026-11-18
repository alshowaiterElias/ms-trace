import React from 'react';
import { CheckCircle2, Clock, Database, Hand, Lock, Radio } from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import type { HandTested, ReviewedStatus, SessionDataOrigin } from '../../types/domain';
import { formatHandLabel } from '../../utils/formatters';

export const DataOriginBadge: React.FC<{ origin: SessionDataOrigin }> = ({ origin }) => {
  const { t } = useAppState();
  if (origin === 'recorded_live') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-200 bg-teal-50 px-2.5 py-0.5 text-xs font-medium text-teal-800">
        <Radio className="h-3.5 w-3.5 text-teal-600" aria-hidden="true" />
        <span>{t.common.liveRecordedBadge}</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
      <Database className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
      <span>{t.common.demoMockBadge}</span>
    </span>
  );
};

export const ReviewStatusBadge: React.FC<{
  sharedWithDoctor: boolean;
  reviewedStatus: ReviewedStatus;
}> = ({ sharedWithDoctor, reviewedStatus }) => {
  const { t } = useAppState();

  if (!sharedWithDoctor || reviewedStatus === 'not_shared') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-medium text-slate-700">
        <Lock className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
        <span>{t.common.notSharedBadge}</span>
      </span>
    );
  }

  if (reviewedStatus === 'reviewed') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
        <span>{t.common.reviewedBadge}</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-800">
      <Clock className="h-3.5 w-3.5 text-amber-600" aria-hidden="true" />
      <span>{t.common.pendingReviewBadge}</span>
    </span>
  );
};

export const HandBadge: React.FC<{ hand: HandTested }> = ({ hand }) => {
  const { language } = useAppState();
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-navy-100 bg-navy-50 px-2.5 py-0.5 text-xs font-medium text-navy-900">
      <Hand className="h-3.5 w-3.5 text-navy-700" aria-hidden="true" />
      <span>{formatHandLabel(hand, language)}</span>
    </span>
  );
};

