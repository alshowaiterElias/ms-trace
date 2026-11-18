import { createInitialDemoState } from '../data/mockData';
import { hydrateSessionMetrics } from '../engine/tappingMetrics';
import type { PersistedAppState } from '../types/domain';

const STORAGE_KEY = 'ms_trace_prototype_state_v1';

export function loadPersistedState(): PersistedAppState {
  const fallback = createInitialDemoState();
  if (typeof window === 'undefined') {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      savePersistedState(fallback);
      return fallback;
    }

    const parsed = JSON.parse(raw) as Partial<PersistedAppState>;
    if (
      !parsed ||
      parsed.version !== 1 ||
      !Array.isArray(parsed.patients) ||
      !Array.isArray(parsed.doctors) ||
      !Array.isArray(parsed.sessions) ||
      !Array.isArray(parsed.reviews)
    ) {
      savePersistedState(fallback);
      return fallback;
    }

    return {
      ...fallback,
      ...parsed,
      sessions: parsed.sessions.map(hydrateSessionMetrics),
      settings: {
        ...fallback.settings,
        ...(parsed.settings ?? {}),
      },
    };
  } catch {
    savePersistedState(fallback);
    return fallback;
  }
}

export function savePersistedState(state: PersistedAppState): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore quota errors gracefully in prototype environments.
  }
}

export function resetPersistedState(): PersistedAppState {
  const fresh = createInitialDemoState();
  savePersistedState(fresh);
  return fresh;
}

