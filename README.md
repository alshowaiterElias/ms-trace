# MS Trace — Multiple Sclerosis Monitoring Platform (Prototype)

**MS Trace** is a bilingual (English & Arabic) digital health monitoring web prototype centered on the **Digital Finger Tapping Test**, demonstrating how patients can perform standardized motor tapping tasks and share objective timestamp-derived measurements with their assigned neurologist.

> **Clinical Disclaimer:** MS Trace is an experimental assessment-support prototype, not a cleared medical device. Recorded tapping metrics and segment comparisons must not be used independently to diagnose Multiple Sclerosis, quantify disease severity, or guide treatment decisions. Test duration, hand protocol, and interpretation require validation by qualified medical professionals before clinical deployment.

---

## Core Capabilities

### Patient Experience
- **Patient Dashboard:** Personal overview, latest completed tapping metrics, recent session log, assigned neurologist summary, and direct launch into a new test.
- **Tapping Test Introduction & Warm-Up:** Plain-language instructions, Right/Left hand selection, configurable 30-second protocol overview, optional untimed practice pad, and toggleable acoustic tick feedback (off by default).
- **Distraction-Free Active Tapping Test:**
  - Large, high-contrast circular tapping target optimized for touchscreens, mouse, and keyboard (`Space` / `Enter` accessibility input).
  - Real-time `performance.now()` millisecond timestamp capture with continuous-press/long-press rejection and digitizer bounce protection.
  - Confirmation modal before aborting active tests; incomplete sessions are never stored as completed records.
- **Results Dashboard & Visualizations:**
  - Total tap count, average tapping speed (`taps/s`), and mean inter-tap interval (`ms`).
  - Rhythm consistency analysis via Standard Deviation and Coefficient of Variation (`CV = (SD / Mean) × 100`).
  - Within-test performance change comparing Segment 1 (`0–10s`) vs Segment 3 (`20–30s`) using `((Initial - Final) / Initial) × 100`.
  - Interactive charts (5-second rate timeline, inter-tap spacing timeline with mean reference line, and 3-segment bar comparison) plus complete numerical breakdown.
  - Explicit **Save and Share Results** workflow distinguishing local unshared recordings from tests shared with the assigned doctor.
- **Test History & My Doctor:** Multi-session longitudinal charts with hand/data-source filters, fictional doctor connection details, and one-click sharing for unshared local tests.

### Doctor Experience
- **Doctor Dashboard:** Assigned cohort overview, pending review queue, and recent shared sessions.
- **Patient Roster:** Search by patient name or ID (`MST-1042`, `MST-1089`, `MST-1124`) and filter by review status.
- **Patient Details & Clinical Review:** Longitudinal comparisons across shared sessions (filterable by hand), detailed inspection of any shared session's raw-derived visualizations, and a local clinical review workflow to mark sessions as reviewed with observation notes.

### Bilingual & Accessibility Support
- Full **English (LTR)** and **Arabic (RTL)** support (`IBM Plex Sans Arabic` / `Cairo` + `Inter`), preserving active page and test progress across language switches.
- Western numerals (`0–9`) with localized Arabic units and Gregorian dates for clinical legibility.
- High-contrast mode and reduced-motion toggles in Settings, large touch targets, and semantic ARIA landmarks.
- Clear visual distinction between **Sample Demo Data** (`demo_mock`) and **Live Recorded Measurement** (`recorded_live`).

---

## Technologies Used

- **React 19** + **TypeScript**
- **Vite**
- **Tailwind CSS v4** (`@tailwindcss/vite`)
- **Recharts** (bilingual, RTL-safe data visualizations)
- **Lucide React** (clinical iconography)
- **Vitest** (unit tests for tapping metric calculations)

---

## Project Structure

```text
src/
├── config/
│   └── testProtocol.ts         # Configurable duration (30s) & debounce parameters
├── types/
│   └── domain.ts               # Backend-ready Patient, Doctor, Session & Review entities
├── engine/
│   ├── tappingMetrics.ts       # Pure metric calculation & timeline builder functions
│   └── tappingMetrics.test.ts  # Unit tests for CV, segment rates & edge cases
├── data/
│   └── mockData.ts             # Deterministic demo accounts & sample historical sessions
├── storage/
│   └── localStore.ts           # Versioned LocalStorage persistence & reset helpers
├── i18n/
│   └── translations.ts         # Complete English & Arabic dictionary
├── context/
│   └── AppStateContext.tsx     # Application state, routing & role switching
├── utils/
│   ├── audioFeedback.ts        # Optional Web Audio API tap tick
│   └── formatters.ts           # Locale-aware date, number & hand formatting
├── components/
│   ├── charts/SessionCharts.tsx
│   ├── common/{AboutModal,ClinicalDisclaimer,StatusBadges}.tsx
│   ├── layout/AppShell.tsx
│   └── results/SessionResultsDetail.tsx
└── pages/
    ├── patient/{PatientDashboardPage,TappingTestIntroPage,ActiveTappingTestPage,TestResultsPage,TestHistoryPage,MyDoctorPage}.tsx
    ├── doctor/{DoctorDashboardPage,DoctorPatientsPage,DoctorPatientDetailPage}.tsx
    └── shared/ProfileSettingsPages.tsx
```

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open the local URL printed by Vite (typically `http://localhost:5173`).

### 3. Run Unit Tests
```bash
npm test
```

### 4. Production Type-Check & Build
```bash
npm run build
```

---

## Demo Accounts Included

Use the **Demo Account** switcher in the top header at any time:
- **Patient 1:** Layla Al-Harbi (`MST-1042`) — Includes 4 shared sample sessions + 1 unshared local session
- **Patient 2:** Omar Al-Sayed (`MST-1089`) — Includes 4 shared sample sessions (1 pending review)
- **Patient 3:** Nadia Hassan (`MST-1124`) — Includes 3 shared sample sessions (1 pending review)
- **Doctor:** Dr. Karim Al-Mansoor, MD — Assigned neurologist reviewing all shared cohort records

