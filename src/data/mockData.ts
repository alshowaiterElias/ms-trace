import { calculateSessionMetrics } from '../engine/tappingMetrics';
import type {
  Doctor,
  DoctorReview,
  HandTested,
  Patient,
  PersistedAppState,
  ReviewedStatus,
  TappingTestSession,
} from '../types/domain';

/**
 * Generates deterministic, realistic synthetic raw tap timestamps for demonstration history.
 * Every sample historical session derives its metrics through the exact same calculation engine
 * used for live recordings, and is strictly tagged with `dataOrigin: 'demo_mock'`.
 */
function generateDeterministicMockTimestamps(options: {
  durationSeconds: number;
  segmentIntervalsMs: [number, number, number];
  jitterAmplitudeMs: number;
  seedOffset: number;
  occasionalPauseEvery?: number;
  occasionalPauseExtraMs?: number;
}): number[] {
  const {
    durationSeconds,
    segmentIntervalsMs,
    jitterAmplitudeMs,
    seedOffset,
    occasionalPauseEvery,
    occasionalPauseExtraMs = 0,
  } = options;

  const durationMs = durationSeconds * 1000;
  const segmentBoundary1 = durationMs / 3;
  const segmentBoundary2 = (durationMs * 2) / 3;

  const timestamps: number[] = [];
  let cursor = 180 + (seedOffset % 7) * 15;
  let tapIdx = 0;

  while (cursor <= durationMs - 60) {
    timestamps.push(Math.round(cursor));
    tapIdx += 1;

    const baseInterval =
      cursor < segmentBoundary1
        ? segmentIntervalsMs[0]
        : cursor < segmentBoundary2
          ? segmentIntervalsMs[1]
          : segmentIntervalsMs[2];

    // Deterministic pseudo-variation using trigonometric wave
    const wave =
      Math.sin((tapIdx + seedOffset) * 1.73) * 0.65 +
      Math.cos((tapIdx + seedOffset) * 0.91) * 0.35;
    let delta = baseInterval + wave * jitterAmplitudeMs;

    if (occasionalPauseEvery && tapIdx % occasionalPauseEvery === 0) {
      delta += occasionalPauseExtraMs;
    }

    cursor += Math.max(95, delta);
  }

  return timestamps;
}

function buildMockSession(params: {
  id: string;
  patientId: string;
  doctorId: string;
  timestamp: string;
  handTested: HandTested;
  duration: number;
  rawTapTimestamps: number[];
  sharedWithDoctor: boolean;
  reviewedStatus: ReviewedStatus;
}): TappingTestSession {
  const derived = calculateSessionMetrics(params.rawTapTimestamps, params.duration);
  return {
    id: params.id,
    patientId: params.patientId,
    doctorId: params.doctorId,
    timestamp: params.timestamp,
    handTested: params.handTested,
    duration: params.duration,
    rawTapTimestamps: params.rawTapTimestamps,
    totalTapCount: derived.totalTapCount,
    averageTapsPerSecond: derived.averageTapsPerSecond,
    meanInterTapInterval: derived.meanInterTapInterval,
    intervalStandardDeviation: derived.intervalStandardDeviation,
    intervalCoefficientOfVariation: derived.intervalCoefficientOfVariation,
    segmentRates: derived.segmentRates,
    performanceChangePercentage: derived.performanceChangePercentage,
    completionStatus: 'completed',
    sharedWithDoctor: params.sharedWithDoctor,
    reviewedStatus: params.reviewedStatus,
    dataOrigin: 'demo_mock',
    inputMethodSummary: 'pointer',
  };
}

export const DEMO_DOCTORS: Doctor[] = [
  {
    id: 'doc-karim',
    fullName: {
      en: 'Dr. Karim Al-Mansoor, MD',
      ar: 'د. كريم المنصور',
    },
    specialty: {
      en: 'Consultant Neurologist — MS & Motor Function',
      ar: 'استشاري طب الأعصاب — التصلب المتعدد والوظائف الحركية',
    },
    hospital: {
      en: 'Al-Salam Neurosciences Center (Demo Clinic)',
      ar: 'مركز السلام للعلوم العصبية (عيادة تجريبية)',
    },
    email: 'k.almansoor@mstrace-demo.org',
    phone: '+966 11 555 0142',
    officeHours: {
      en: 'Sun – Thu, 09:00 – 16:00',
      ar: 'الأحد – الخميس، 09:00 – 16:00',
    },
    avatarInitials: 'KM',
  },
];

export const DEMO_PATIENTS: Patient[] = [
  {
    id: 'pat-layla',
    medicalRecordNumber: 'MST-1042',
    fullName: {
      en: 'Layla Al-Harbi',
      ar: 'ليلى الحربي',
    },
    email: 'layla.alharbi@mstrace-demo.org',
    dateOfBirth: '1991-04-18',
    assignedDoctorId: 'doc-karim',
    preferredHand: 'right',
    clinicUnit: {
      en: 'Outpatient Neuro-Monitoring Cohort',
      ar: 'مجموعة المتابعة العصبية الخارجية',
    },
    avatarInitials: 'LH',
  },
  {
    id: 'pat-omar',
    medicalRecordNumber: 'MST-1089',
    fullName: {
      en: 'Omar Al-Sayed',
      ar: 'عمر السيد',
    },
    email: 'omar.alsayed@mstrace-demo.org',
    dateOfBirth: '1986-09-25',
    assignedDoctorId: 'doc-karim',
    preferredHand: 'left',
    clinicUnit: {
      en: 'Outpatient Neuro-Monitoring Cohort',
      ar: 'مجموعة المتابعة العصبية الخارجية',
    },
    avatarInitials: 'OS',
  },
  {
    id: 'pat-nadia',
    medicalRecordNumber: 'MST-1124',
    fullName: {
      en: 'Nadia Hassan',
      ar: 'نادية حسن',
    },
    email: 'nadia.hassan@mstrace-demo.org',
    dateOfBirth: '1994-11-03',
    assignedDoctorId: 'doc-karim',
    preferredHand: 'right',
    clinicUnit: {
      en: 'Outpatient Neuro-Monitoring Cohort',
      ar: 'مجموعة المتابعة العصبية الخارجية',
    },
    avatarInitials: 'NH',
  },
];

export function createInitialDemoState(): PersistedAppState {
  const sessions: TappingTestSession[] = [
    // Layla Al-Harbi (Patient 1) — 5 sessions across Right and Left hands
    buildMockSession({
      id: 'sess-layla-1',
      patientId: 'pat-layla',
      doctorId: 'doc-karim',
      timestamp: '2026-10-21T09:30:00.000Z',
      handTested: 'right',
      duration: 30,
      rawTapTimestamps: generateDeterministicMockTimestamps({
        durationSeconds: 30,
        segmentIntervalsMs: [228, 236, 254],
        jitterAmplitudeMs: 26,
        seedOffset: 1,
      }),
      sharedWithDoctor: true,
      reviewedStatus: 'reviewed',
    }),
    buildMockSession({
      id: 'sess-layla-2',
      patientId: 'pat-layla',
      doctorId: 'doc-karim',
      timestamp: '2026-10-28T10:15:00.000Z',
      handTested: 'left',
      duration: 30,
      rawTapTimestamps: generateDeterministicMockTimestamps({
        durationSeconds: 30,
        segmentIntervalsMs: [255, 268, 286],
        jitterAmplitudeMs: 32,
        seedOffset: 2,
        occasionalPauseEvery: 28,
        occasionalPauseExtraMs: 110,
      }),
      sharedWithDoctor: true,
      reviewedStatus: 'reviewed',
    }),
    buildMockSession({
      id: 'sess-layla-3',
      patientId: 'pat-layla',
      doctorId: 'doc-karim',
      timestamp: '2026-11-04T09:45:00.000Z',
      handTested: 'right',
      duration: 30,
      rawTapTimestamps: generateDeterministicMockTimestamps({
        durationSeconds: 30,
        segmentIntervalsMs: [222, 229, 244],
        jitterAmplitudeMs: 22,
        seedOffset: 3,
      }),
      sharedWithDoctor: true,
      reviewedStatus: 'reviewed',
    }),
    buildMockSession({
      id: 'sess-layla-4',
      patientId: 'pat-layla',
      doctorId: 'doc-karim',
      timestamp: '2026-11-12T16:20:00.000Z',
      handTested: 'right',
      duration: 30,
      rawTapTimestamps: generateDeterministicMockTimestamps({
        durationSeconds: 30,
        segmentIntervalsMs: [218, 224, 236],
        jitterAmplitudeMs: 20,
        seedOffset: 4,
      }),
      sharedWithDoctor: true,
      reviewedStatus: 'pending_review',
    }),
    buildMockSession({
      id: 'sess-layla-5',
      patientId: 'pat-layla',
      doctorId: 'doc-karim',
      timestamp: '2026-11-16T11:10:00.000Z',
      handTested: 'left',
      duration: 30,
      rawTapTimestamps: generateDeterministicMockTimestamps({
        durationSeconds: 30,
        segmentIntervalsMs: [248, 256, 271],
        jitterAmplitudeMs: 28,
        seedOffset: 5,
      }),
      sharedWithDoctor: false,
      reviewedStatus: 'not_shared',
    }),

    // Omar Al-Sayed (Patient 2) — 4 sessions
    buildMockSession({
      id: 'sess-omar-1',
      patientId: 'pat-omar',
      doctorId: 'doc-karim',
      timestamp: '2026-10-25T14:00:00.000Z',
      handTested: 'left',
      duration: 30,
      rawTapTimestamps: generateDeterministicMockTimestamps({
        durationSeconds: 30,
        segmentIntervalsMs: [285, 310, 345],
        jitterAmplitudeMs: 42,
        seedOffset: 6,
        occasionalPauseEvery: 18,
        occasionalPauseExtraMs: 165,
      }),
      sharedWithDoctor: true,
      reviewedStatus: 'reviewed',
    }),
    buildMockSession({
      id: 'sess-omar-2',
      patientId: 'pat-omar',
      doctorId: 'doc-karim',
      timestamp: '2026-11-02T13:30:00.000Z',
      handTested: 'right',
      duration: 30,
      rawTapTimestamps: generateDeterministicMockTimestamps({
        durationSeconds: 30,
        segmentIntervalsMs: [270, 290, 315],
        jitterAmplitudeMs: 36,
        seedOffset: 7,
        occasionalPauseEvery: 22,
        occasionalPauseExtraMs: 140,
      }),
      sharedWithDoctor: true,
      reviewedStatus: 'reviewed',
    }),
    buildMockSession({
      id: 'sess-omar-3',
      patientId: 'pat-omar',
      doctorId: 'doc-karim',
      timestamp: '2026-11-10T15:05:00.000Z',
      handTested: 'left',
      duration: 30,
      rawTapTimestamps: generateDeterministicMockTimestamps({
        durationSeconds: 30,
        segmentIntervalsMs: [275, 298, 330],
        jitterAmplitudeMs: 38,
        seedOffset: 8,
        occasionalPauseEvery: 20,
        occasionalPauseExtraMs: 150,
      }),
      sharedWithDoctor: true,
      reviewedStatus: 'reviewed',
    }),
    buildMockSession({
      id: 'sess-omar-4',
      patientId: 'pat-omar',
      doctorId: 'doc-karim',
      timestamp: '2026-11-17T08:50:00.000Z',
      handTested: 'left',
      duration: 30,
      rawTapTimestamps: generateDeterministicMockTimestamps({
        durationSeconds: 30,
        segmentIntervalsMs: [292, 324, 362],
        jitterAmplitudeMs: 45,
        seedOffset: 9,
        occasionalPauseEvery: 16,
        occasionalPauseExtraMs: 190,
      }),
      sharedWithDoctor: true,
      reviewedStatus: 'pending_review',
    }),

    // Nadia Hassan (Patient 3) — 3 sessions
    buildMockSession({
      id: 'sess-nadia-1',
      patientId: 'pat-nadia',
      doctorId: 'doc-karim',
      timestamp: '2026-10-30T11:20:00.000Z',
      handTested: 'right',
      duration: 30,
      rawTapTimestamps: generateDeterministicMockTimestamps({
        durationSeconds: 30,
        segmentIntervalsMs: [212, 215, 222],
        jitterAmplitudeMs: 18,
        seedOffset: 10,
      }),
      sharedWithDoctor: true,
      reviewedStatus: 'reviewed',
    }),
    buildMockSession({
      id: 'sess-nadia-2',
      patientId: 'pat-nadia',
      doctorId: 'doc-karim',
      timestamp: '2026-11-08T10:40:00.000Z',
      handTested: 'left',
      duration: 30,
      rawTapTimestamps: generateDeterministicMockTimestamps({
        durationSeconds: 30,
        segmentIntervalsMs: [232, 238, 245],
        jitterAmplitudeMs: 22,
        seedOffset: 11,
      }),
      sharedWithDoctor: true,
      reviewedStatus: 'reviewed',
    }),
    buildMockSession({
      id: 'sess-nadia-3',
      patientId: 'pat-nadia',
      doctorId: 'doc-karim',
      timestamp: '2026-11-15T12:15:00.000Z',
      handTested: 'right',
      duration: 30,
      rawTapTimestamps: generateDeterministicMockTimestamps({
        durationSeconds: 30,
        segmentIntervalsMs: [208, 214, 224],
        jitterAmplitudeMs: 19,
        seedOffset: 12,
      }),
      sharedWithDoctor: true,
      reviewedStatus: 'pending_review',
    }),
  ];

  const reviews: DoctorReview[] = [
    {
      id: 'rev-1',
      doctorId: 'doc-karim',
      testSessionId: 'sess-layla-1',
      note: 'Baseline sample session reviewed. Steady tapping cadence observed across segments; continue routine home monitoring logs prior to next neurology visit.',
      demoNoteLocalized: {
        en: 'Baseline sample session reviewed. Steady tapping cadence observed across segments; continue routine home monitoring logs prior to next neurology visit.',
        ar: 'تمت مراجعة الجلسة المرجعية النموذجية. لوحظ ثبات في وتيرة النقر عبر الفترات؛ يُنصح بالاستمرار في تسجيل القياسات الدورية قبل موعد العيادة القادم.',
      },
      reviewDate: '2026-10-22T10:05:00.000Z',
    },
    {
      id: 'rev-2',
      doctorId: 'doc-karim',
      testSessionId: 'sess-layla-2',
      note: 'Non-dominant hand sample reviewed. Slightly wider interval spacing noted in final 10 seconds compared with right-hand baseline. Discuss during scheduled clinic follow-up.',
      demoNoteLocalized: {
        en: 'Non-dominant hand sample reviewed. Slightly wider interval spacing noted in final 10 seconds compared with right-hand baseline. Discuss during scheduled clinic follow-up.',
        ar: 'تمت مراجعة عينة اليد غير السائدة. لوحظ تباعد أوسع قليلاً في الثواني العشر الأخيرة مقارنة بقياس اليد اليمنى؛ ستتم مناقشته في المتابعة المجدولة.',
      },
      reviewDate: '2026-10-29T09:15:00.000Z',
    },
    {
      id: 'rev-3',
      doctorId: 'doc-karim',
      testSessionId: 'sess-layla-3',
      note: 'Consistent rhythm spacing across all three segments. Keep recording sessions at a similar time of day when convenient.',
      demoNoteLocalized: {
        en: 'Consistent rhythm spacing across all three segments. Keep recording sessions at a similar time of day when convenient.',
        ar: 'تباعد إيقاعي متسق عبر الفترات الثلاث. يُفضّل الاستمرار في تسجيل الجلسات في وقت متقارب من اليوم عند الإمكان.',
      },
      reviewDate: '2026-11-05T11:30:00.000Z',
    },
    {
      id: 'rev-4',
      doctorId: 'doc-karim',
      testSessionId: 'sess-omar-1',
      note: 'Sample session reviewed. Occasional longer pauses observed between taps; noted for discussion during outpatient assessment.',
      demoNoteLocalized: {
        en: 'Sample session reviewed. Occasional longer pauses observed between taps; noted for discussion during outpatient assessment.',
        ar: 'تمت مراجعة الجلسة النموذجية. لوحظت فترات توقف أطول أحياناً بين النقرات؛ تم تدوينها للمناقشة أثناء التقييم السريري.',
      },
      reviewDate: '2026-10-26T12:00:00.000Z',
    },
    {
      id: 'rev-5',
      doctorId: 'doc-karim',
      testSessionId: 'sess-omar-2',
      note: 'Right-hand sample shows steady cadence with mild late-segment slowing. Thank you for sharing.',
      demoNoteLocalized: {
        en: 'Right-hand sample shows steady cadence with mild late-segment slowing. Thank you for sharing.',
        ar: 'تُظهر عينة اليد اليمنى وتيرة مستقرة مع تباطؤ طفيف في الفترة الأخيرة. شكراً لمشاركة النتائج.',
      },
      reviewDate: '2026-11-03T14:10:00.000Z',
    },
    {
      id: 'rev-6',
      doctorId: 'doc-karim',
      testSessionId: 'sess-omar-3',
      note: 'Reviewed longitudinal left-hand spacing profile. Will review alongside full clinical exam next week.',
      demoNoteLocalized: {
        en: 'Reviewed longitudinal left-hand spacing profile. Will review alongside full clinical exam next week.',
        ar: 'تمت مراجعة السجل الزمني لتباعد نقرات اليد اليسرى، وستتم مراجعته مع الفحص العصبي الشامل الأسبوع القادم.',
      },
      reviewDate: '2026-11-11T10:20:00.000Z',
    },
    {
      id: 'rev-7',
      doctorId: 'doc-karim',
      testSessionId: 'sess-nadia-1',
      note: 'Sample baseline reviewed. Low interval variability across the 30-second interval.',
      demoNoteLocalized: {
        en: 'Sample baseline reviewed. Low interval variability across the 30-second interval.',
        ar: 'تمت مراجعة القياس الأساسي النموذجي مع انخفاض تباين الفواصل خلال مدة الـ 30 ثانية.',
      },
      reviewDate: '2026-10-31T09:40:00.000Z',
    },
    {
      id: 'rev-8',
      doctorId: 'doc-karim',
      testSessionId: 'sess-nadia-2',
      note: 'Left-hand sample reviewed and logged for comparative tracking.',
      demoNoteLocalized: {
        en: 'Left-hand sample reviewed and logged for comparative tracking.',
        ar: 'تمت مراجعة عينة اليد اليسرى وتوثيقها للمقارنة والمتابعة الدورية.',
      },
      reviewDate: '2026-11-09T11:00:00.000Z',
    },
  ];

  return {
    version: 1,
    language: 'en',
    activeRole: 'patient',
    activePatientId: 'pat-layla',
    activeDoctorId: 'doc-karim',
    patients: DEMO_PATIENTS,
    doctors: DEMO_DOCTORS,
    sessions,
    reviews,
    settings: {
      soundFeedbackEnabled: false,
      preferredHand: 'right',
      highContrastMode: false,
      reducedMotion: false,
    },
  };
}

