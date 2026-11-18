import React from 'react';
import { AppShell } from './components/layout/AppShell';
import { AppStateProvider, useAppState } from './context/AppStateContext';
import { DoctorDashboardPage } from './pages/doctor/DoctorDashboardPage';
import { DoctorPatientDetailPage } from './pages/doctor/DoctorPatientDetailPage';
import { DoctorPatientsPage } from './pages/doctor/DoctorPatientsPage';
import {
  AbortedTestPage,
  ActiveTappingTestPage,
} from './pages/patient/ActiveTappingTestPage';
import { MyDoctorPage } from './pages/patient/MyDoctorPage';
import { PatientDashboardPage } from './pages/patient/PatientDashboardPage';
import { TappingTestIntroPage } from './pages/patient/TappingTestIntroPage';
import { TestHistoryPage } from './pages/patient/TestHistoryPage';
import { TestResultsPage } from './pages/patient/TestResultsPage';
import { ProfilePage, SettingsPage } from './pages/shared/ProfileSettingsPages';

const RouteContent: React.FC = () => {
  const { route } = useAppState();

  switch (route.page) {
    case 'patient_dashboard':
      return <PatientDashboardPage />;
    case 'patient_test_intro':
      return <TappingTestIntroPage />;
    case 'patient_test_active':
      return <ActiveTappingTestPage hand={route.hand} />;
    case 'patient_test_aborted':
      return <AbortedTestPage />;
    case 'patient_results':
      return <TestResultsPage sessionId={route.sessionId} />;
    case 'patient_history':
      return <TestHistoryPage />;
    case 'patient_doctor':
      return <MyDoctorPage />;
    case 'patient_profile':
    case 'doctor_profile':
      return <ProfilePage />;
    case 'patient_settings':
    case 'doctor_settings':
      return <SettingsPage />;
    case 'doctor_dashboard':
      return <DoctorDashboardPage />;
    case 'doctor_patients':
      return <DoctorPatientsPage />;
    case 'doctor_patient_detail':
      return (
        <DoctorPatientDetailPage
          patientId={route.patientId}
          initialSessionId={route.sessionId}
        />
      );
  }
};

export function App() {
  return (
    <AppStateProvider>
      <AppShell>
        <RouteContent />
      </AppShell>
    </AppStateProvider>
  );
}

export default App;

