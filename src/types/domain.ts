export type Language = 'en' | 'ar';
export type UserRole = 'patient' | 'doctor';
export type HandTested = 'right' | 'left';
export type SessionCompletionStatus = 'completed' | 'aborted';
export type ReviewedStatus = 'not_shared' | 'pending_review' | 'reviewed';
export type SessionDataOrigin = 'demo_mock' | 'recorded_live';
export type InputMethodSummary = 'pointer' | 'keyboard' | 'mixed';

export interface LocalizedText {
  en: string;
  ar: string;
}

export interface Patient {
  id: string;
  medicalRecordNumber: string;
  fullName: LocalizedText;
  email: string;
  dateOfBirth: string;
  assignedDoctorId: string;
  preferredHand: HandTested;
  clinicUnit: LocalizedText;
  avatarInitials: string;
}

export interface Doctor {
  id: string;
  fullName: LocalizedText;
  specialty: LocalizedText;
  hospital: LocalizedText;
  email: string;
  phone: string;
  officeHours: LocalizedText;
  avatarInitials: string;
}

export interface SegmentRateDetail {
  segmentIndex: 1 | 2 | 3;
  startSec: number;
  endSec: number;
  tapCount: number;
  ratePerSecond: number;
}

export interface RateTimelinePoint {
  bucketIndex: number;
  startSec: number;
  endSec: number;
  rangeLabel: string;
  tapCount: number;
  ratePerSecond: number;
}

export interface IntervalPoint {
  intervalIndex: number;
  tapNumber: number;
  elapsedSeconds: number;
  intervalMs: number;
}

export interface TappingTestSession {
  id: string;
  patientId: string;
  doctorId: string;
  timestamp: string;
  handTested: HandTested;
  duration: number;
  /** Raw relative timestamps in milliseconds from test start [0 .. duration*1000] */
  rawTapTimestamps: number[];
  totalTapCount: number;
  averageTapsPerSecond: number;
  meanInterTapInterval: number | null;
  intervalStandardDeviation: number | null;
  intervalCoefficientOfVariation: number | null;
  segmentRates: [number, number, number];
  performanceChangePercentage: number | null;
  completionStatus: SessionCompletionStatus;
  sharedWithDoctor: boolean;
  reviewedStatus: ReviewedStatus;
  dataOrigin: SessionDataOrigin;
  inputMethodSummary?: InputMethodSummary;
}

export interface DoctorReview {
  id: string;
  doctorId: string;
  testSessionId: string;
  note: string;
  /** Optional bilingual text used exclusively for initial sample demo reviews */
  demoNoteLocalized?: LocalizedText;
  reviewDate: string;
}

export interface AppSettings {
  soundFeedbackEnabled: boolean;
  preferredHand: HandTested;
  highContrastMode: boolean;
  reducedMotion: boolean;
}

export interface PersistedAppState {
  version: number;
  language: Language;
  activeRole: UserRole;
  activePatientId: string;
  activeDoctorId: string;
  patients: Patient[];
  doctors: Doctor[];
  sessions: TappingTestSession[];
  reviews: DoctorReview[];
  settings: AppSettings;
}

