import React, { useMemo, useState } from 'react';
import { ArrowRight, CheckCircle2, Clock, Search } from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import {
  formatDate,
  formatDecimal,
  formatInteger,
  getLocalizedText,
} from '../../utils/formatters';

export const DoctorPatientsPage: React.FC = () => {
  const { state, language, t, setRoute, activeDoctor, sharedDoctorSessions } =
    useAppState();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'needs_review' | 'reviewed'>(
    'all',
  );

  const patientRows = useMemo(() => {
    return state.patients
      .filter((p) => p.assignedDoctorId === activeDoctor.id)
      .map((patient) => {
        const sessions = sharedDoctorSessions
          .filter((s) => s.patientId === patient.id)
          .slice()
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        const latestSession = sessions[0] ?? null;
        const pendingCount = sessions.filter(
          (s) => s.reviewedStatus === 'pending_review',
        ).length;
        return {
          patient,
          sessions,
          latestSession,
          pendingCount,
        };
      });
  }, [state.patients, activeDoctor.id, sharedDoctorSessions]);

  const filteredRows = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return patientRows.filter((row) => {
      if (statusFilter === 'needs_review' && row.pendingCount === 0) return false;
      if (statusFilter === 'reviewed' && row.pendingCount > 0) return false;

      if (!q) return true;
      return (
        row.patient.fullName.en.toLowerCase().includes(q) ||
        row.patient.fullName.ar.toLowerCase().includes(q) ||
        row.patient.medicalRecordNumber.toLowerCase().includes(q)
      );
    });
  }, [patientRows, searchQuery, statusFilter]);

  return (
    <div className="space-y-6">
      <section className="hc-card rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl">
            {t.doctorPatients.title}
          </h1>
          <p className="mt-1 text-sm text-slate-600 hc-muted">
            {t.doctorPatients.subtitle}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search
              className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.doctorPatients.searchPlaceholder}
              aria-label={t.doctorPatients.searchPlaceholder}
              className="min-h-[44px] w-full rounded-xl border border-slate-300 bg-white ps-10 pe-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {(['all', 'needs_review', 'reviewed'] as const).map((filterKey) => {
              const label =
                filterKey === 'all'
                  ? t.doctorPatients.filterAll
                  : filterKey === 'needs_review'
                    ? t.doctorPatients.filterNeedsReview
                    : t.doctorPatients.filterUpToDate;
              return (
                <button
                  key={filterKey}
                  type="button"
                  onClick={() => setStatusFilter(filterKey)}
                  aria-pressed={statusFilter === filterKey}
                  className={`min-h-[40px] rounded-xl px-3.5 text-xs font-semibold transition focus-visible:outline-2 focus-visible:outline-teal-600 ${
                    statusFilter === filterKey
                      ? 'bg-navy-900 text-white'
                      : 'border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="hc-card rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        {filteredRows.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-600">
            {t.doctorPatients.emptySearch}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-start text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="py-3 pe-4 text-start">{t.doctorPatients.colPatient}</th>
                  <th className="py-3 pe-4 text-start">{t.doctorPatients.colId}</th>
                  <th className="py-3 pe-4 text-start">{t.doctorPatients.colLastTest}</th>
                  <th className="py-3 pe-4 text-start">{t.doctorPatients.colLatestSpeed}</th>
                  <th className="py-3 pe-4 text-start">{t.doctorPatients.colLatestCount}</th>
                  <th className="py-3 pe-4 text-start">{t.doctorPatients.colStatus}</th>
                  <th className="py-3 text-end">{t.doctorPatients.colAction}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRows.map(({ patient, latestSession, pendingCount }) => (
                  <tr key={patient.id} className="hover:bg-slate-50/70">
                    <td className="py-4 pe-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy-900 text-xs font-semibold text-white">
                          {patient.avatarInitials}
                        </span>
                        <span className="font-semibold text-navy-900">
                          {getLocalizedText(patient.fullName, language)}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 pe-4 font-mono text-xs text-slate-600 whitespace-nowrap">
                      {patient.medicalRecordNumber}
                    </td>
                    <td className="py-4 pe-4 text-slate-700 whitespace-nowrap">
                      {latestSession
                        ? formatDate(latestSession.timestamp, language)
                        : t.doctorPatients.noSharedTestsYet}
                    </td>
                    <td className="py-4 pe-4 font-semibold text-slate-900 tabular-nums whitespace-nowrap">
                      {latestSession
                        ? `${formatDecimal(latestSession.averageTapsPerSecond, language, 2)} ${t.common.tapsPerSecondUnit}`
                        : t.common.notAvailable}
                    </td>
                    <td className="py-4 pe-4 text-slate-800 tabular-nums whitespace-nowrap">
                      {latestSession
                        ? `${formatInteger(latestSession.totalTapCount, language)} ${t.common.tapsUnit}`
                        : t.common.notAvailable}
                    </td>
                    <td className="py-4 pe-4 whitespace-nowrap">
                      {!latestSession ? (
                        <span className="text-xs text-slate-500">
                          {t.doctorPatients.noSharedTestsYet}
                        </span>
                      ) : pendingCount > 0 ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                          <Clock className="h-3.5 w-3.5 text-amber-600" aria-hidden="true" />
                          <span>
                            {t.doctorPatients.needsReviewStatus} (
                            {formatInteger(pendingCount, language)})
                          </span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
                          <CheckCircle2
                            className="h-3.5 w-3.5 text-emerald-600"
                            aria-hidden="true"
                          />
                          <span>{t.doctorPatients.allReviewedStatus}</span>
                        </span>
                      )}
                    </td>
                    <td className="py-4 text-end whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() =>
                          setRoute({
                            page: 'doctor_patient_detail',
                            patientId: patient.id,
                            sessionId: latestSession?.id,
                          })
                        }
                        className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl bg-navy-900 px-3.5 text-xs font-semibold text-white hover:bg-navy-800 focus-visible:outline-2 focus-visible:outline-teal-600"
                      >
                        <span>{t.doctorPatients.openProfileBtn}</span>
                        <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" aria-hidden="true" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

