import type { Language } from '../types/domain';

export interface TranslationDictionary {
  brand: {
    name: string;
    subtitle: string;
    prototypeTag: string;
  };
  common: {
    rightHand: string;
    leftHand: string;
    allHands: string;
    secondsUnit: string;
    secondsShort: string;
    tapsUnit: string;
    tapsPerSecondUnit: string;
    msUnit: string;
    percentUnit: string;
    notAvailable: string;
    insufficientData: string;
    cancel: string;
    confirm: string;
    save: string;
    close: string;
    back: string;
    viewDetails: string;
    searchPlaceholder: string;
    noResults: string;
    demoMockBadge: string;
    liveRecordedBadge: string;
    sharedBadge: string;
    notSharedBadge: string;
    reviewedBadge: string;
    pendingReviewBadge: string;
    shareWithDoctor: string;
    sharedSuccessToast: string;
    languageLabel: string;
    switchLanguageAria: string;
    aboutPlatform: string;
    demoRoleSwitcher: string;
    patientRoleLabel: string;
    doctorRoleLabel: string;
    activeAccount: string;
  };
  disclaimer: {
    bannerTitle: string;
    bannerText: string;
    footerText: string;
  };
  aboutModal: {
    title: string;
    subtitle: string;
    closeBtn: string;
    sections: {
      whatIsTitle: string;
      whatIsBody: string;
      whatMeasuresTitle: string;
      whatMeasuresBody: string;
      howPerformTitle: string;
      howPerformBody: string;
      meaningTitle: string;
      meaningBody: string;
      doctorFlowTitle: string;
      doctorFlowBody: string;
    };
    scientificNotice: string;
  };
  nav: {
    dashboard: string;
    tappingTest: string;
    testHistory: string;
    myDoctor: string;
    profile: string;
    settings: string;
    doctorOverview: string;
    patientRoster: string;
    clinicalReviews: string;
  };
  patientDashboard: {
    welcomePrefix: string;
    welcomeSubtext: string;
    startNewTestCta: string;
    latestTestTitle: string;
    latestTestEmptyTitle: string;
    latestTestEmptyBody: string;
    completedOnLabel: string;
    totalTapsLabel: string;
    averageSpeedLabel: string;
    rhythmCvLabel: string;
    performanceChangeLabel: string;
    recentSessionsTitle: string;
    viewAllHistory: string;
    assignedDoctorTitle: string;
    viewDoctorPage: string;
    quickStatsTitle: string;
    completedSessionsCount: string;
    sharedSessionsCount: string;
    reviewedSessionsCount: string;
    liveSessionsCount: string;
    noSessionsHint: string;
  };
  testIntro: {
    badge: string;
    title: string;
    subtitle: string;
    whatMeasuredTitle: string;
    whatMeasuredItems: [string, string, string];
    instructionsTitle: string;
    instructionsParagraphs: [string, string, string];
    handSelectionTitle: string;
    handSelectionHint: string;
    durationTitle: string;
    durationValue: string;
    protocolNote: string;
    practiceTitle: string;
    practiceSubtitle: string;
    practiceCirclePrompt: string;
    practiceCountLabel: string;
    practiceResetBtn: string;
    soundToggleLabel: string;
    soundToggleHint: string;
    startOfficialTestBtn: string;
    accessibilityNote: string;
  };
  activeTest: {
    distractionFreeLabel: string;
    testingHandPrefix: string;
    remainingTimeLabel: string;
    tapsRecordedLabel: string;
    progressLabel: string;
    tapTargetAriaLabel: string;
    tapPromptMain: string;
    tapPromptSub: string;
    keyboardHint: string;
    soundOn: string;
    soundOff: string;
    cancelTestBtn: string;
    cancelModalTitle: string;
    cancelModalBody: string;
    cancelModalKeepGoing: string;
    cancelModalDiscard: string;
    abortedBannerTitle: string;
    abortedBannerBody: string;
    abortedTryAgainBtn: string;
    abortedBackDashboardBtn: string;
  };
  results: {
    title: string;
    subtitle: string;
    backToHistory: string;
    backToDashboard: string;
    recordedAtLabel: string;
    handTestedLabel: string;
    durationLabel: string;
    inputMethodLabel: string;
    inputMethods: {
      pointer: string;
      keyboard: string;
      mixed: string;
    };
    statusCardTitle: string;
    sharingStatusLabel: string;
    reviewStatusLabel: string;
    retakeTestBtn: string;
    saveAndShareBtn: string;
    alreadySharedBtn: string;
    doctorNoteCardTitle: string;
    reviewedOnPrefix: string;
    metrics: {
      totalTapsTitle: string;
      totalTapsDesc: string;
      avgSpeedTitle: string;
      avgSpeedDesc: string;
      meanIntervalTitle: string;
      meanIntervalDesc: string;
      rhythmTitle: string;
      rhythmCvLabel: string;
      rhythmSdLabel: string;
      rhythmFormulaTitle: string;
      rhythmExplanation: string;
      rhythmInsufficient: string;
      fatigueTitle: string;
      fatigueFormulaLabel: string;
      fatigueDeclineNote: string;
      fatigueIncreaseNote: string;
      fatigueStableNote: string;
      fatigueScientificCaution: string;
      fatigueInsufficient: string;
    };
    charts: {
      rateTimelineTitle: string;
      rateTimelineSubtitle: string;
      rateYAxis: string;
      rateXAxis: string;
      tapsInWindowTooltip: string;
      intervalChartTitle: string;
      intervalChartSubtitle: string;
      intervalYAxis: string;
      intervalXAxis: string;
      meanReferenceLabel: string;
      intervalEmpty: string;
      segmentChartTitle: string;
      segmentChartSubtitle: string;
      segment1Label: string;
      segment2Label: string;
      segment3Label: string;
      segmentYAxis: string;
      segmentTapsTooltip: string;
      breakdownTitle: string;
      breakdownSubtitle: string;
      metricColumn: string;
      valueColumn: string;
      notesColumn: string;
      rawTimestampCountLabel: string;
      rawTimestampNote: string;
      segment1Desc: string;
      segment2Desc: string;
      segment3Desc: string;
    };
  };
  history: {
    title: string;
    subtitle: string;
    filterHandLabel: string;
    filterOriginLabel: string;
    originAll: string;
    originLive: string;
    originDemo: string;
    trendChartTitle: string;
    trendChartSubtitle: string;
    trendSpeedSeries: string;
    trendCvSeries: string;
    trendCautionNote: string;
    trendEmpty: string;
    sessionsTableTitle: string;
    colDate: string;
    colHand: string;
    colOrigin: string;
    colTotalTaps: string;
    colSpeed: string;
    colRhythmCv: string;
    colPerfChange: string;
    colDoctorStatus: string;
    colActions: string;
    emptyStateTitle: string;
    emptyStateBody: string;
    startFirstTestBtn: string;
  };
  myDoctor: {
    title: string;
    subtitle: string;
    connectionActive: string;
    specialtyLabel: string;
    hospitalLabel: string;
    emailLabel: string;
    phoneLabel: string;
    officeHoursLabel: string;
    demoContactNotice: string;
    sharedTestsTitle: string;
    sharedTestsSubtitle: string;
    unsharedTestsTitle: string;
    unsharedTestsSubtitle: string;
    noSharedTests: string;
    noUnsharedTests: string;
    shareNowBtn: string;
    openSessionBtn: string;
    doctorNoteIncluded: string;
  };
  profilePage: {
    title: string;
    subtitle: string;
    patientIdLabel: string;
    fullNameLabel: string;
    emailLabel: string;
    dobLabel: string;
    preferredHandLabel: string;
    clinicUnitLabel: string;
    assignedDoctorLabel: string;
    doctorProfileNote: string;
    doctorLicenseNote: string;
  };
  settingsPage: {
    title: string;
    subtitle: string;
    languageSectionTitle: string;
    languageSectionDesc: string;
    testPreferencesTitle: string;
    defaultHandLabel: string;
    soundFeedbackTitle: string;
    soundFeedbackDesc: string;
    accessibilityTitle: string;
    highContrastTitle: string;
    highContrastDesc: string;
    reducedMotionTitle: string;
    reducedMotionDesc: string;
    demoDataSectionTitle: string;
    demoDataSectionDesc: string;
    resetDemoBtn: string;
    resetConfirmTitle: string;
    resetConfirmBody: string;
    resetSuccessMsg: string;
  };
  doctorDashboard: {
    title: string;
    subtitle: string;
    totalPatientsCard: string;
    patientsWithRecentCard: string;
    pendingReviewsCard: string;
    totalSharedTestsCard: string;
    requiringReviewTitle: string;
    requiringReviewEmpty: string;
    recentSharedTestsTitle: string;
    recentSharedEmpty: string;
    reviewNowBtn: string;
    openPatientProfileBtn: string;
  };
  doctorPatients: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    filterAll: string;
    filterNeedsReview: string;
    filterUpToDate: string;
    colPatient: string;
    colId: string;
    colLastTest: string;
    colLatestSpeed: string;
    colLatestCount: string;
    colStatus: string;
    colAction: string;
    openProfileBtn: string;
    needsReviewStatus: string;
    allReviewedStatus: string;
    noSharedTestsYet: string;
    emptySearch: string;
  };
  doctorPatientDetail: {
    backToRoster: string;
    patientSummaryTitle: string;
    sharedSessionsCountLabel: string;
    pendingReviewCountLabel: string;
    latestSpeedLabel: string;
    latestCvLabel: string;
    longitudinalTitle: string;
    longitudinalSubtitle: string;
    longitudinalCaution: string;
    sessionSelectorTitle: string;
    sessionSelectorSubtitle: string;
    unsharedPrivacyNote: string;
    noSharedSessionsTitle: string;
    noSharedSessionsBody: string;
    reviewPanelTitle: string;
    reviewPanelSubtitle: string;
    reviewStatusLabel: string;
    clinicalNoteLabel: string;
    clinicalNotePlaceholder: string;
    clinicalNoteValidation: string;
    saveReviewBtn: string;
    updateReviewBtn: string;
    reviewSavedToast: string;
    reviewedByOn: string;
    clinicalEthicsReminder: string;
  };
}

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    brand: {
      name: 'MS Trace',
      subtitle: 'Neurological Monitoring Platform',
      prototypeTag: 'Prototype v1 • Finger Tapping Module',
    },
    common: {
      rightHand: 'Right Hand',
      leftHand: 'Left Hand',
      allHands: 'All Hands',
      secondsUnit: 'seconds',
      secondsShort: 's',
      tapsUnit: 'taps',
      tapsPerSecondUnit: 'taps/s',
      msUnit: 'ms',
      percentUnit: '%',
      notAvailable: 'Unavailable',
      insufficientData: 'Insufficient data',
      cancel: 'Cancel',
      confirm: 'Confirm',
      save: 'Save',
      close: 'Close',
      back: 'Back',
      viewDetails: 'View Details',
      searchPlaceholder: 'Search…',
      noResults: 'No matching records found.',
      demoMockBadge: 'Sample Demo Data',
      liveRecordedBadge: 'Live Recorded Measurement',
      sharedBadge: 'Shared with Doctor',
      notSharedBadge: 'Saved Locally (Not Shared)',
      reviewedBadge: 'Reviewed',
      pendingReviewBadge: 'Pending Review',
      shareWithDoctor: 'Share with Doctor',
      sharedSuccessToast: 'Session saved and shared with your assigned doctor.',
      languageLabel: 'Language',
      switchLanguageAria: 'Switch interface language',
      aboutPlatform: 'About MS Trace',
      demoRoleSwitcher: 'Demo Account',
      patientRoleLabel: 'Patient',
      doctorRoleLabel: 'Doctor',
      activeAccount: 'Active Account',
    },
    disclaimer: {
      bannerTitle: 'Experimental Monitoring Prototype',
      bannerText:
        'MS Trace is an assessment-support prototype, not a cleared medical device. Tapping measurements must not be used independently to diagnose Multiple Sclerosis, assess disease severity, or alter treatment.',
      footerText:
        'MS Trace Digital Finger Tapping Prototype • Test duration, hand protocol, and metric interpretation require clinical validation by qualified neurologists before medical use.',
    },
    aboutModal: {
      title: 'Understanding MS Trace',
      subtitle: 'How this digital finger tapping prototype supports patient–neurologist monitoring',
      closeBtn: 'Got it',
      sections: {
        whatIsTitle: '1. What MS Trace Is',
        whatIsBody:
          'MS Trace is a digital health monitoring prototype built to help people with Multiple Sclerosis track fine motor tapping tasks over time and share structured measurements with their assigned neurologist.',
        whatMeasuresTitle: '2. What the Tapping Test Measures',
        whatMeasuresBody:
          'Using precise millisecond timestamps collected directly from your taps, the test records total tap count, average tapping speed (taps/s), inter-tap interval spacing, rhythm consistency (coefficient of variation), and speed changes across three 10-second segments.',
        howPerformTitle: '3. How to Perform the Test',
        howPerformBody:
          'Select the hand you wish to test (Right or Left), try the optional warm-up pad if needed, and then tap the large circular target with one finger as quickly and steadily as possible for 30 seconds (or use Spacebar / Enter on a keyboard).',
        meaningTitle: '4. What the Measurements Mean',
        meaningBody:
          'Higher tapping rates reflect faster tap repetition during the session. Higher interval coefficient of variation (CV) reflects wider spacing differences between taps. Segment percentage change compares the first 10 seconds with the final 10 seconds as an observational performance-change indicator.',
        doctorFlowTitle: '5. How Results Reach Your Doctor',
        doctorFlowBody:
          'Completed tests are saved locally first. Clicking "Save and Share Results" makes that session visible in your assigned doctor’s dashboard, where the neurologist can compare sessions over time and add a clinical review note.',
      },
      scientificNotice:
        'Clinical integrity note: Sample historical records are clearly tagged "Sample Demo Data", whereas tests you perform right now are tagged "Live Recorded Measurement".',
    },
    nav: {
      dashboard: 'Dashboard',
      tappingTest: 'Tapping Test',
      testHistory: 'Test History',
      myDoctor: 'My Doctor',
      profile: 'Profile',
      settings: 'Settings',
      doctorOverview: 'Doctor Dashboard',
      patientRoster: 'Patients',
      clinicalReviews: 'Patient Details',
    },
    patientDashboard: {
      welcomePrefix: 'Welcome back,',
      welcomeSubtext:
        'Track your digital finger tapping sessions and share results with your care team.',
      startNewTestCta: 'Start New Tapping Test',
      latestTestTitle: 'Latest Completed Tapping Test',
      latestTestEmptyTitle: 'No Completed Tests Yet',
      latestTestEmptyBody:
        'Complete your first 30-second digital finger tapping session to view speed, rhythm, and segment metrics.',
      completedOnLabel: 'Completed on',
      totalTapsLabel: 'Total Tap Count',
      averageSpeedLabel: 'Average Speed',
      rhythmCvLabel: 'Interval Variability (CV)',
      performanceChangeLabel: 'Segment Rate Change',
      recentSessionsTitle: 'Recent Test Sessions',
      viewAllHistory: 'View Full History',
      assignedDoctorTitle: 'Assigned Neurologist',
      viewDoctorPage: 'View Doctor & Sharing',
      quickStatsTitle: 'Session Overview',
      completedSessionsCount: 'Completed Tests',
      sharedSessionsCount: 'Shared with Doctor',
      reviewedSessionsCount: 'Doctor Reviewed',
      liveSessionsCount: 'Live Recorded',
      noSessionsHint: 'Your recent completed sessions will appear here.',
    },
    testIntro: {
      badge: 'Standardized Prototype Protocol',
      title: 'Digital Finger Tapping Test',
      subtitle:
        'Prepare for a calm, distraction-free 30-second motor tapping measurement.',
      whatMeasuredTitle: 'What This Test Records',
      whatMeasuredItems: [
        'Total accepted taps and overall tapping speed (taps per second).',
        'Timing intervals between consecutive taps to observe rhythm consistency.',
        'Tapping speed across three 10-second segments to observe within-test rate changes.',
      ],
      instructionsTitle: 'Instructions for the Test',
      instructionsParagraphs: [
        'During this test, you will repeatedly tap the target area on your screen using one finger, as quickly and consistently as possible.',
        'Try to maintain a steady rhythm throughout the test. Avoid resting your finger on the target or pressing and holding.',
        'Continue tapping until the timer reaches zero. On desktop, you may also use the Spacebar or Enter key.',
      ],
      handSelectionTitle: 'Select Hand to Test',
      handSelectionHint: 'Choose which hand you will use for this session.',
      durationTitle: 'Test Duration',
      durationValue: '30 seconds (three 10-second segments)',
      protocolNote:
        'Prototype duration is configurable in software; final clinical protocol requires medical specialist confirmation.',
      practiceTitle: 'Optional Warm-Up Practice Area',
      practiceSubtitle:
        'Try a few practice taps below to become familiar with the target response. Practice taps are not saved.',
      practiceCirclePrompt: 'Tap here to practice',
      practiceCountLabel: 'Practice taps',
      practiceResetBtn: 'Reset count',
      soundToggleLabel: 'Subtle tap audio tick',
      soundToggleHint: 'Optional soft click sound when each tap registers (off by default).',
      startOfficialTestBtn: 'Start Official 30s Test',
      accessibilityNote:
        'Accessibility: Large target surface, works with touch, mouse, or keyboard (Space / Enter). Holding down does not repeat taps.',
    },
    activeTest: {
      distractionFreeLabel: 'Active Measurement Session',
      testingHandPrefix: 'Testing',
      remainingTimeLabel: 'Time Remaining',
      tapsRecordedLabel: 'Taps Recorded',
      progressLabel: 'Session Progress',
      tapTargetAriaLabel: 'Tapping target area. Tap repeatedly with one finger or press Spacebar.',
      tapPromptMain: 'TAP HERE',
      tapPromptSub: 'Tap steadily until the timer reaches 0.0 s',
      keyboardHint: 'Touch, click, or tap Space / Enter (one press per tap)',
      soundOn: 'Sound On',
      soundOff: 'Sound Off',
      cancelTestBtn: 'Cancel Test',
      cancelModalTitle: 'Cancel Active Tapping Test?',
      cancelModalBody:
        'If you stop now, this session will be marked incomplete and discarded. Incomplete sessions are never saved as completed test results.',
      cancelModalKeepGoing: 'Return to Test',
      cancelModalDiscard: 'Discard Session',
      abortedBannerTitle: 'Session Interrupted — Not Recorded as Completed',
      abortedBannerBody:
        'The tapping test was cancelled before the 30-second timer finished, so no incomplete data was added to your history or shared with your doctor.',
      abortedTryAgainBtn: 'Return to Test Setup',
      abortedBackDashboardBtn: 'Go to Dashboard',
    },
    results: {
      title: 'Tapping Test Results',
      subtitle: 'Metrics computed strictly from recorded millisecond tap timestamps.',
      backToHistory: 'Back to Test History',
      backToDashboard: 'Back to Dashboard',
      recordedAtLabel: 'Session Timestamp',
      handTestedLabel: 'Hand Tested',
      durationLabel: 'Duration',
      inputMethodLabel: 'Input Modality',
      inputMethods: {
        pointer: 'Touch / Mouse',
        keyboard: 'Keyboard',
        mixed: 'Pointer + Keyboard',
      },
      statusCardTitle: 'Record & Doctor Sharing Status',
      sharingStatusLabel: 'Sharing Status',
      reviewStatusLabel: 'Clinical Review',
      retakeTestBtn: 'Retake Test',
      saveAndShareBtn: 'Save and Share Results',
      alreadySharedBtn: 'Shared with Assigned Doctor',
      doctorNoteCardTitle: 'Neurologist Review Note',
      reviewedOnPrefix: 'Reviewed on',
      metrics: {
        totalTapsTitle: 'Total Tap Count',
        totalTapsDesc: 'Accepted individual taps during the 30-second window.',
        avgSpeedTitle: 'Average Tapping Speed',
        avgSpeedDesc: 'Overall rate across the completed duration.',
        meanIntervalTitle: 'Mean Inter-Tap Interval',
        meanIntervalDesc: 'Average elapsed time between consecutive taps.',
        rhythmTitle: 'Rhythm Consistency Analysis',
        rhythmCvLabel: 'Coefficient of Variation (CV)',
        rhythmSdLabel: 'Interval Standard Deviation (SD)',
        rhythmFormulaTitle: 'Formula: CV = (Standard Deviation / Mean Inter-Tap Interval) × 100',
        rhythmExplanation:
          'Higher interval variability (higher CV) indicates less consistent spacing between consecutive taps. This prototype does not classify specific CV values as medically abnormal.',
        rhythmInsufficient:
          'At least 3 recorded taps are required to calculate interval standard deviation and coefficient of variation reliably.',
        fatigueTitle: 'Within-Test Performance Change (3 Segments)',
        fatigueFormulaLabel:
          'Formula: ((Initial 10s Rate − Final 10s Rate) / Initial 10s Rate) × 100',
        fatigueDeclineNote:
          'Positive percentage indicates a slower tapping rate in the final 10 seconds compared with the first 10 seconds.',
        fatigueIncreaseNote:
          'Negative percentage indicates a faster tapping rate in the final 10 seconds compared with the first 10 seconds.',
        fatigueStableNote:
          'Value near zero indicates relatively stable tapping speed between the initial and final 10-second segments.',
        fatigueScientificCaution:
          'Presented strictly as an observational performance-change indicator across time segments, not a clinically validated measure of neurological fatigue.',
        fatigueInsufficient:
          'Unavailable: Requires tapping activity in the initial 10-second segment and at least 3 total taps.',
      },
      charts: {
        rateTimelineTitle: 'Tapping Rate Across Test Duration',
        rateTimelineSubtitle: 'Average tapping speed measured across consecutive 5-second intervals.',
        rateYAxis: 'Rate (taps/s)',
        rateXAxis: 'Time Window',
        tapsInWindowTooltip: 'Taps in window',
        intervalChartTitle: 'Inter-Tap Spacing Timeline',
        intervalChartSubtitle:
          'Individual gaps (ms) between consecutive taps, highlighting steady periods and longer pauses.',
        intervalYAxis: 'Interval (ms)',
        intervalXAxis: 'Tap Sequence (#)',
        meanReferenceLabel: 'Mean Interval',
        intervalEmpty: 'At least 2 taps are needed to visualize intervals between consecutive taps.',
        segmentChartTitle: 'Three-Segment Rate Comparison',
        segmentChartSubtitle: 'Comparison of tapping rate across equal 10-second test segments.',
        segment1Label: 'Segment 1 (0–10s)',
        segment2Label: 'Segment 2 (10–20s)',
        segment3Label: 'Segment 3 (20–30s)',
        segmentYAxis: 'Rate (taps/s)',
        segmentTapsTooltip: 'Segment taps',
        breakdownTitle: 'Detailed Numerical Breakdown',
        breakdownSubtitle: 'Exact raw counts and derived calculations stored for clinical review.',
        metricColumn: 'Measurement',
        valueColumn: 'Value',
        notesColumn: 'Technical Interpretation',
        rawTimestampCountLabel: 'Raw Timestamps Captured',
        rawTimestampNote: 'Stored separately from derived metrics for future algorithm updates.',
        segment1Desc: 'Initial 10-second baseline segment',
        segment2Desc: 'Middle 10-second segment',
        segment3Desc: 'Final 10-second segment',
      },
    },
    history: {
      title: 'Test History',
      subtitle: 'Review your completed tapping tests and observe changes across sessions.',
      filterHandLabel: 'Filter by Hand',
      filterOriginLabel: 'Data Source',
      originAll: 'All Records',
      originLive: 'Live Recorded Only',
      originDemo: 'Sample Demo Only',
      trendChartTitle: 'Multi-Session Measurement Trajectory',
      trendChartSubtitle: 'Average tapping speed and interval variability (CV) across completed tests.',
      trendSpeedSeries: 'Avg Speed (taps/s)',
      trendCvSeries: 'Interval CV (%)',
      trendCautionNote:
        'Observational display only: day-to-day changes in tapping metrics do not automatically reflect changes in Multiple Sclerosis severity.',
      trendEmpty: 'Complete or select at least 2 sessions matching the current filter to display a multi-session chart.',
      sessionsTableTitle: 'Completed Sessions Log',
      colDate: 'Date',
      colHand: 'Hand',
      colOrigin: 'Data Source',
      colTotalTaps: 'Total Taps',
      colSpeed: 'Avg Speed',
      colRhythmCv: 'Rhythm CV',
      colPerfChange: 'Segment Change',
      colDoctorStatus: 'Doctor Status',
      colActions: 'Inspect',
      emptyStateTitle: 'No Completed Tests Match Filter',
      emptyStateBody: 'Adjust your filters above or start a new 30-second digital finger tapping test.',
      startFirstTestBtn: 'Start Tapping Test',
    },
    myDoctor: {
      title: 'My Doctor & Result Sharing',
      subtitle: 'View your assigned neurologist and manage which completed tests have been shared.',
      connectionActive: 'Care Team Link Active (Demo)',
      specialtyLabel: 'Specialty',
      hospitalLabel: 'Clinic / Institution',
      emailLabel: 'Demo Email',
      phoneLabel: 'Demo Clinic Phone',
      officeHoursLabel: 'Clinic Hours',
      demoContactNotice:
        'Fictional demonstration contact details for prototype workflow preview only.',
      sharedTestsTitle: 'Tests Shared with Your Doctor',
      sharedTestsSubtitle: 'These completed sessions are visible in your doctor’s dashboard.',
      unsharedTestsTitle: 'Saved Locally (Not Yet Shared)',
      unsharedTestsSubtitle:
        'Share any local completed test below to place it in your doctor’s review queue.',
      noSharedTests: 'No completed tests have been shared with your doctor yet.',
      noUnsharedTests: 'All of your completed sessions have already been shared with your doctor.',
      shareNowBtn: 'Share with Doctor',
      openSessionBtn: 'Open Results',
      doctorNoteIncluded: 'Doctor note recorded',
    },
    profilePage: {
      title: 'Profile Information',
      subtitle: 'Demonstration account details for this monitoring prototype.',
      patientIdLabel: 'Patient ID',
      fullNameLabel: 'Full Name',
      emailLabel: 'Email Address',
      dobLabel: 'Date of Birth',
      preferredHandLabel: 'Primary / Preferred Hand',
      clinicUnitLabel: 'Monitoring Cohort',
      assignedDoctorLabel: 'Assigned Neurologist',
      doctorProfileNote: 'Neurologist Profile',
      doctorLicenseNote: 'Fictional clinician account for prototype demonstration.',
    },
    settingsPage: {
      title: 'Settings & Accessibility',
      subtitle: 'Customize language, tapping feedback, and visual accessibility preferences.',
      languageSectionTitle: 'Interface Language & Layout',
      languageSectionDesc:
        'Switch between English (LTR) and Arabic (RTL) at any time without losing your data.',
      testPreferencesTitle: 'Tapping Test Preferences',
      defaultHandLabel: 'Default Selected Hand',
      soundFeedbackTitle: 'Subtle Acoustic Tap Tick',
      soundFeedbackDesc: 'Play a soft low-volume click when each tap is registered.',
      accessibilityTitle: 'Visual & Motor Accessibility',
      highContrastTitle: 'High-Contrast Borders & Text',
      highContrastDesc: 'Strengthen card outlines and text contrast for easier reading.',
      reducedMotionTitle: 'Reduce Subtle Animations',
      reducedMotionDesc: 'Disable expanding ripple animations on tapping targets.',
      demoDataSectionTitle: 'Demonstration Persistence',
      demoDataSectionDesc:
        'Sessions, sharing status, and doctor review notes are saved locally in your browser. Resetting restores the original fictional baseline.',
      resetDemoBtn: 'Reset Demo Data',
      resetConfirmTitle: 'Restore Original Demo Data?',
      resetConfirmBody:
        'This will remove any newly recorded live tests and clinical notes created in this browser and restore the initial demonstration accounts.',
      resetSuccessMsg: 'Demonstration data restored to initial baseline.',
    },
    doctorDashboard: {
      title: 'Neurologist Monitoring Dashboard',
      subtitle: 'Review shared patient finger tapping sessions and longitudinal trends.',
      totalPatientsCard: 'Assigned Patients',
      patientsWithRecentCard: 'Patients with Shared Tests',
      pendingReviewsCard: 'Sessions Pending Review',
      totalSharedTestsCard: 'Total Shared Sessions',
      requiringReviewTitle: 'Sessions Requiring Clinical Review',
      requiringReviewEmpty: 'All shared patient tests have been reviewed.',
      recentSharedTestsTitle: 'Recently Completed Shared Tests',
      recentSharedEmpty: 'No shared patient tests available yet.',
      reviewNowBtn: 'Inspect & Review',
      openPatientProfileBtn: 'Patient Profile',
    },
    doctorPatients: {
      title: 'Assigned Patient Roster',
      subtitle: 'Search patients by name or ID and inspect shared tapping measurements.',
      searchPlaceholder: 'Search by patient name or ID (e.g., MST-1042)…',
      filterAll: 'All Patients',
      filterNeedsReview: 'Pending Review',
      filterUpToDate: 'All Reviewed',
      colPatient: 'Patient Name',
      colId: 'Patient ID',
      colLastTest: 'Last Shared Test',
      colLatestSpeed: 'Latest Speed',
      colLatestCount: 'Latest Tap Count',
      colStatus: 'Review Status',
      colAction: 'Action',
      openProfileBtn: 'Open Profile',
      needsReviewStatus: 'Pending Review',
      allReviewedStatus: 'Reviewed',
      noSharedTestsYet: 'No shared tests',
      emptySearch: 'No assigned patients match your current search or filter.',
    },
    doctorPatientDetail: {
      backToRoster: 'Back to Patient Roster',
      patientSummaryTitle: 'Patient Monitoring Summary',
      sharedSessionsCountLabel: 'Shared Sessions',
      pendingReviewCountLabel: 'Pending Review',
      latestSpeedLabel: 'Latest Speed',
      latestCvLabel: 'Latest Rhythm CV',
      longitudinalTitle: 'Historical Session Comparison',
      longitudinalSubtitle: 'Compare tapping speed, total count, and variability across shared tests.',
      longitudinalCaution:
        'Observational telemetry only: longitudinal shifts must be interpreted within full neurological evaluation.',
      sessionSelectorTitle: 'Shared Test Sessions',
      sessionSelectorSubtitle: 'Select any session below to inspect detailed charts and add a clinical review.',
      unsharedPrivacyNote:
        'Only sessions explicitly shared by the patient appear in the clinician view.',
      noSharedSessionsTitle: 'No Shared Sessions Available',
      noSharedSessionsBody:
        'This patient has not shared any completed tapping tests yet.',
      reviewPanelTitle: 'Doctor Review & Clinical Note',
      reviewPanelSubtitle: 'Record a clinical observation note and mark this session as reviewed.',
      reviewStatusLabel: 'Current Status',
      clinicalNoteLabel: 'Clinical Observation Note',
      clinicalNotePlaceholder:
        'Enter observational notes regarding tapping rhythm, spacing, or follow-up plans (avoid automated diagnostic claims)…',
      clinicalNoteValidation: 'Please enter a brief clinical note before marking this test as reviewed.',
      saveReviewBtn: 'Mark as Reviewed & Save Note',
      updateReviewBtn: 'Update Review Note',
      reviewSavedToast: 'Clinical review saved and linked to the patient’s record.',
      reviewedByOn: 'Reviewed on',
      clinicalEthicsReminder:
        'Assessment-support record only — does not generate diagnostic conclusions or treatment recommendations.',
    },
  },
  ar: {
    brand: {
      name: 'MS Trace',
      subtitle: 'منصة متابعة التصلب المتعدد',
      prototypeTag: 'نموذج أولي v1 • اختبار النقر الرقمي بالإصبع',
    },
    common: {
      rightHand: 'اليد اليمنى',
      leftHand: 'اليد اليسرى',
      allHands: 'كلتا اليدين',
      secondsUnit: 'ثانية',
      secondsShort: 'ث',
      tapsUnit: 'نقرة',
      tapsPerSecondUnit: 'نقرة/ث',
      msUnit: 'مللي ثانية',
      percentUnit: '%',
      notAvailable: 'غير متاح',
      insufficientData: 'بيانات غير كافية',
      cancel: 'إلغاء',
      confirm: 'تأكيد',
      save: 'حفظ',
      close: 'إغلاق',
      back: 'رجوع',
      viewDetails: 'عرض التفاصيل',
      searchPlaceholder: 'بحث…',
      noResults: 'لم يتم العثور على سجلات مطابقة.',
      demoMockBadge: 'بيانات تجريبية نموذجية',
      liveRecordedBadge: 'قياس فعلي مسجّل',
      sharedBadge: 'تمت المشاركة مع الطبيب',
      notSharedBadge: 'محفوظ محلياً (غير مشارك)',
      reviewedBadge: 'تمت المراجعة',
      pendingReviewBadge: 'بانتظار المراجعة',
      shareWithDoctor: 'مشاركة مع الطبيب',
      sharedSuccessToast: 'تم حفظ الجلسة ومشاركتها مع طبيبك المسؤول بنجاح.',
      languageLabel: 'اللغة',
      switchLanguageAria: 'تبديل لغة الواجهة',
      aboutPlatform: 'عن المنصة',
      demoRoleSwitcher: 'حساب العرض',
      patientRoleLabel: 'مريض',
      doctorRoleLabel: 'طبيب',
      activeAccount: 'الحساب النشط',
    },
    disclaimer: {
      bannerTitle: 'نموذج أولي تجريبي للمتابعة',
      bannerText:
        'منصة MS Trace هي أداة مساعدة للمتابعة والتقييم وليست جهازاً طبياً معتمداً. لا يجوز استخدام قياسات النقر بشكل مستقل لتشخيص التصلب المتعدد أو تحديد شدة المرض أو تعديل الخطة العلاجية.',
      footerText:
        'النموذج الأولي لاختبار النقر الرقمي بالإصبع (MS Trace) • تتطلب مدة الاختبار وبروتوكول اليد وتفسير المؤشرات اعتماداً من أطباء الأعصاب المختصين قبل الاستخدام السريري.',
    },
    aboutModal: {
      title: 'التعريف بمنصة MS Trace',
      subtitle: 'كيف يدعم نموذج اختبار النقر الرقمي التواصل والمتابعة بين المريض وطبيب الأعصاب',
      closeBtn: 'حسناً',
      sections: {
        whatIsTitle: '1. ما هي منصة MS Trace؟',
        whatIsBody:
          'منصة MS Trace هي نموذج أولي رقمي للمتابعة الصحية صُمم لمساعدة مرضى التصلب المتعدد على أداء اختبارات حركية دقيقة بانتظام ومشاركة قياساتها المنظمة مع طبيب الأعصاب المتابع.',
        whatMeasuresTitle: '2. ماذا يقيس اختبار النقر؟',
        whatMeasuresBody:
          'من خلال تسجيل الطوابع الزمنية الفعلية بدقة المللي ثانية لكل نقرة، يحسب الاختبار إجمالي عدد النقرات، ومتوسط سرعة النقر (نقرة/ثانية)، والفواصل الزمنية بين النقرات، وانتظام الإيقاع (معامل التباين)، والتغير في السرعة عبر ثلاث فترات مدة كل منها 10 ثوانٍ.',
        howPerformTitle: '3. كيفية أداء الاختبار',
        howPerformBody:
          'اختر اليد المراد فحصها (اليمنى أو اليسرى)، وجرّب مساحة التدريب الاختيارية إذا رغبت، ثم انقر على الدائرة المستهدفة بإصبع واحد بأكبر سرعة وثبات ممكنين لمدة 30 ثانية (أو باستخدام مفتاح المسافة أو الإدخال على لوحة المفاتيح).',
        meaningTitle: '4. دلالة القياسات الناتجة',
        meaningBody:
          'تشير سرعة النقر الأعلى إلى تكرار أسرع خلال الجلسة، بينما يدل ارتفاع معامل تباين الفواصل (CV) على تباعد غير منتظم بين النقرات. وتقارن نسبة تغير الأداء بين أول 10 ثوانٍ وآخر 10 ثوانٍ كمؤشر رصدي للتغير في الوتيرة.',
        doctorFlowTitle: '5. كيف تصل النتائج إلى الطبيب؟',
        doctorFlowBody:
          'تُحفظ الجلسات المكتملة محلياً أولاً، وعند الضغط على «حفظ ومشاركة النتائج» تظهر الجلسة مباشرة في لوحة تحكم الطبيب المسؤول، ليتمكن من مقارنة الجلسات عبر الزمن وإضافة ملاحظة المراجعة السريرية.',
      },
      scientificNotice:
        'تنويه الدقة العلمية: السجلات التاريخية النموذجية موسومة بوضوح بعبارة «بيانات تجريبية نموذجية»، بينما تُوسم الاختبارات التي تجريها الآن بعبارة «قياس فعلي مسجّل».',
    },
    nav: {
      dashboard: 'لوحة التحكم',
      tappingTest: 'اختبار النقر',
      testHistory: 'سجل الاختبارات',
      myDoctor: 'طبيبي',
      profile: 'الملف الشخصي',
      settings: 'الإعدادات',
      doctorOverview: 'لوحة الطبيب',
      patientRoster: 'قائمة المرضى',
      clinicalReviews: 'تفاصيل المريض',
    },
    patientDashboard: {
      welcomePrefix: 'مرحباً بك،',
      welcomeSubtext: 'تابع جلسات اختبار النقر الرقمي وشارك نتائجك بسهولة مع فريقك الطبي.',
      startNewTestCta: 'بدء اختبار نقر جديد',
      latestTestTitle: 'أحدث اختبار نقر مكتمل',
      latestTestEmptyTitle: 'لا توجد اختبارات مكتملة بعد',
      latestTestEmptyBody:
        'أكمل أول جلسة اختبار نقر لمدة 30 ثانية لعرض مؤشرات السرعة وانتظام الإيقاع وتغير الأداء.',
      completedOnLabel: 'تاريخ الإتمام',
      totalTapsLabel: 'إجمالي النقرات',
      averageSpeedLabel: 'متوسط السرعة',
      rhythmCvLabel: 'تباين الإيقاع (CV)',
      performanceChangeLabel: 'تغير السرعة بين الفترات',
      recentSessionsTitle: 'الجلسات الأخيرة',
      viewAllHistory: 'عرض السجل الكامل',
      assignedDoctorTitle: 'طبيب الأعصاب المسؤول',
      viewDoctorPage: 'بيانات الطبيب والمشاركة',
      quickStatsTitle: 'ملخص الجلسات',
      completedSessionsCount: 'الاختبارات المكتملة',
      sharedSessionsCount: 'المشاركة مع الطبيب',
      reviewedSessionsCount: 'تمت مراجعتها طبياً',
      liveSessionsCount: 'قياسات فعلية مسجّلة',
      noSessionsHint: 'ستظهر جلساتك المكتملة الأخيرة هنا.',
    },
    testIntro: {
      badge: 'بروتوكول النموذج القياسي',
      title: 'اختبار النقر الرقمي بالإصبع',
      subtitle: 'استعد لجلسة قياس حركية هادئة وخالية من المشتتات لمدة 30 ثانية.',
      whatMeasuredTitle: 'ماذا يسجّل هذا الاختبار؟',
      whatMeasuredItems: [
        'إجمالي النقرات المقبولة ومتوسط سرعة النقر (نقرة في الثانية).',
        'الفواصل الزمنية بين كل نقرتين متتاليتين لقياس انتظام الإيقاع.',
        'معدل النقر عبر ثلاث فترات متساوية (10 ثوانٍ لكل فترة) لرصد تغير الأداء.',
      ],
      instructionsTitle: 'تعليمات أداء الاختبار',
      instructionsParagraphs: [
        'خلال هذا الاختبار، ستقوم بالنقر المتكرر على المنطقة المستهدفة على الشاشة باستخدام إصبع واحد، بأقصى سرعة وثبات ممكنين.',
        'حاول الحفاظ على إيقاع منتظم طوال مدة الاختبار، وتجنب إبقاء إصبعك ضاغطاً باستمرار على الشاشة.',
        'استمر في النقر حتى يصل المؤقت إلى الصفر. على أجهزة الحاسوب، يمكنك أيضاً استخدام مفتاح المسافة أو الإدخال.',
      ],
      handSelectionTitle: 'اختر اليد المستخدمة للاختبار',
      handSelectionHint: 'حدد اليد التي ستؤدي بها هذه الجلسة.',
      durationTitle: 'مدة الاختبار',
      durationValue: '30 ثانية (ثلاث فترات مدة كل منها 10 ثوانٍ)',
      protocolNote:
        'مدة الاختبار قابلة للتعديل برمجياً؛ ويجب اعتماد البروتوكول السريري النهائي من قِبل الأطباء المختصين.',
      practiceTitle: 'منطقة تدريب تمهيدية اختيارية',
      practiceSubtitle:
        'جرّب بضع نقرات أدناه للتعرّف على استجابة الدائرة المستهدفة. لا يتم حفظ نقرات التدريب.',
      practiceCirclePrompt: 'انقر هنا للتدريب',
      practiceCountLabel: 'نقرات التدريب',
      practiceResetBtn: 'تصفير العداد',
      soundToggleLabel: 'صوت نقرة خفيف للتأكيد',
      soundToggleHint: 'نغمة هادئة اختيارية عند تسجيل كل نقرة (معطلة افتراضياً).',
      startOfficialTestBtn: 'بدء الاختبار الرسمي (30 ثانية)',
      accessibilityNote:
        'إمكانية الوصول: هدف كبير الحجم يدعم اللمس والفأرة ولوحة المفاتيح (المسافة / الإدخال). الضغط المستمر لا يُحسب كتكرار.',
    },
    activeTest: {
      distractionFreeLabel: 'جلسة قياس نشطة',
      testingHandPrefix: 'اليد المختبرة:',
      remainingTimeLabel: 'الوقت المتبقي',
      tapsRecordedLabel: 'النقرات المسجّلة',
      progressLabel: 'تقدم الجلسة',
      tapTargetAriaLabel: 'منطقة النقر المستهدفة. انقر بشكل متكرر بإصبع واحد أو اضغط مفتاح المسافة.',
      tapPromptMain: 'انقر هنا',
      tapPromptSub: 'استمر بالنقر بثبات حتى يصل المؤقت إلى 0.0 ث',
      keyboardHint: 'باللمس أو الفأرة أو مفتاح المسافة / الإدخال (ضغطة واحدة لكل نقرة)',
      soundOn: 'الصوت مفعل',
      soundOff: 'الصوت صامت',
      cancelTestBtn: 'إلغاء الاختبار',
      cancelModalTitle: 'إلغاء جلسة النقر النشطة؟',
      cancelModalBody:
        'إذا توقفت الآن، فسيتم اعتبار هذه المحاولة غير مكتملة وإهمالها. لا يتم حفظ الجلسات غير المكتملة في سجل النتائج أو إرسالها للطبيب.',
      cancelModalKeepGoing: 'العودة للاختبار',
      cancelModalDiscard: 'إلغاء الجلسة',
      abortedBannerTitle: 'تم إيقاف الجلسة — لم تُسجّل كاختبار مكتمل',
      abortedBannerBody:
        'تم إلغاء اختبار النقر قبل انتهاء مهلة الـ 30 ثانية، لذا لم تتم إضافة بيانات ناقصة إلى سجلك أو مشاركتها مع طبيبك.',
      abortedTryAgainBtn: 'العودة لإعداد الاختبار',
      abortedBackDashboardBtn: 'الذهاب إلى لوحة التحكم',
    },
    results: {
      title: 'نتائج اختبار النقر',
      subtitle: 'تم احتساب جميع المؤشرات مباشرة من الطوابع الزمنية الفعلية المسجّلة.',
      backToHistory: 'العودة إلى سجل الاختبارات',
      backToDashboard: 'العودة إلى لوحة التحكم',
      recordedAtLabel: 'وقت الجلسة',
      handTestedLabel: 'اليد المختبرة',
      durationLabel: 'المدة',
      inputMethodLabel: 'وسيلة الإدخال',
      inputMethods: {
        pointer: 'لمس / فأرة',
        keyboard: 'لوحة المفاتيح',
        mixed: 'مؤشر + لوحة مفاتيح',
      },
      statusCardTitle: 'حالة الحفظ والمشاركة الطبية',
      sharingStatusLabel: 'حالة المشاركة',
      reviewStatusLabel: 'حالة المراجعة',
      retakeTestBtn: 'إعادة الاختبار',
      saveAndShareBtn: 'حفظ ومشاركة النتائج',
      alreadySharedBtn: 'تمت المشاركة مع الطبيب المسؤول',
      doctorNoteCardTitle: 'ملاحظة مراجعة طبيب الأعصاب',
      reviewedOnPrefix: 'تاريخ المراجعة:',
      metrics: {
        totalTapsTitle: 'إجمالي عدد النقرات',
        totalTapsDesc: 'عدد النقرات المقبولة خلال مدة الـ 30 ثانية.',
        avgSpeedTitle: 'متوسط سرعة النقر',
        avgSpeedDesc: 'المعدل الإجمالي للنقرات خلال كامل المدة.',
        meanIntervalTitle: 'متوسط الفاصل بين النقرات',
        meanIntervalDesc: 'متوسط الزمن الفاصل بين كل نقرتين متتاليتين.',
        rhythmTitle: 'تحليل انتظام الإيقاع',
        rhythmCvLabel: 'معامل التباين (CV)',
        rhythmSdLabel: 'الانحراف المعياري للفواصل (SD)',
        rhythmFormulaTitle: 'المعادلة: معامل التباين = (الانحراف المعياري ÷ متوسط الفاصل) × 100',
        rhythmExplanation:
          'ارتفاع تباين الفواصل (ارتفاع معامل التباين CV) يعني تباعداً أقل انتظاماً بين النقرات المتتالية. لا يصنّف هذا النموذج أي قيمة رقمية على أنها غير طبيعية طبياً.',
        rhythmInsufficient:
          'يتطلب حساب الانحراف المعياري ومعامل التباين بشكل موثوق تسجيل 3 نقرات على الأقل.',
        fatigueTitle: 'مؤشر تغير الأداء خلال الاختبار (3 فترات)',
        fatigueFormulaLabel:
          'المعادلة: ((معدل الفترة الأولى − معدل الفترة الأخيرة) ÷ معدل الفترة الأولى) × 100',
        fatigueDeclineNote:
          'القيمة الموجبة تشير إلى انخفاض معدل النقر في الثواني العشر الأخيرة مقارنة بالثواني العشر الأولى.',
        fatigueIncreaseNote:
          'القيمة السالبة تشير إلى ارتفاع معدل النقر في الثواني العشر الأخيرة مقارنة بالثواني العشر الأولى.',
        fatigueStableNote:
          'القيمة القريبة من الصفر تشير إلى ثبات نسبي في سرعة النقر بين بداية الاختبار ونهايته.',
        fatigueScientificCaution:
          'يُعرض هذا المؤشر كقراءة وصفية لتغير السرعة عبر الفترات الزمنية فقط، ولا يُعد قياساً سريرياً معتمداً للإجهاد العصبي.',
        fatigueInsufficient:
          'غير متاح: يتطلب وجود نقرات في الفترة الزمنية الأولى (0–10 ثوانٍ) وتسجيل 3 نقرات على الأقل.',
      },
      charts: {
        rateTimelineTitle: 'معدل النقر عبر مدة الاختبار',
        rateTimelineSubtitle: 'متوسط سرعة النقر المحسوب ضمن نوافذ زمنية متتابعة كل 5 ثوانٍ.',
        rateYAxis: 'المعدل (نقرة/ث)',
        rateXAxis: 'الفترة الزمنية',
        tapsInWindowTooltip: 'النقرات في الفترة',
        intervalChartTitle: 'مخطط الفواصل الزمنية بين النقرات',
        intervalChartSubtitle:
          'الفاصل الزمني (بالمللي ثانية) بين كل نقرتين متتاليتين لتوضيح الفترات المنتظمة أو التوقفات الأطول.',
        intervalYAxis: 'الفاصل (مللي ثانية)',
        intervalXAxis: 'تسلسل النقرة',
        meanReferenceLabel: 'المتوسط',
        intervalEmpty: 'يتطلب عرض مخطط الفواصل تسجيل نقرتين على الأقل.',
        segmentChartTitle: 'مقارنة السرعة عبر الفترات الثلاث',
        segmentChartSubtitle: 'مقارنة معدل النقر عبر ثلاث فترات متساوية مدة كل منها 10 ثوانٍ.',
        segment1Label: 'الفترة 1 (0–10 ث)',
        segment2Label: 'الفترة 2 (10–20 ث)',
        segment3Label: 'الفترة 3 (20–30 ث)',
        segmentYAxis: 'المعدل (نقرة/ث)',
        segmentTapsTooltip: 'نقرات الفترة',
        breakdownTitle: 'التفصيل الرقمي الكامل',
        breakdownSubtitle: 'القيم الخام والقياسات المشتقة المحفوظة للمراجعة السريرية.',
        metricColumn: 'المؤشر',
        valueColumn: 'القيمة',
        notesColumn: 'التفسير الفني',
        rawTimestampCountLabel: 'الطوابع الزمنية الخام المسجّلة',
        rawTimestampNote: 'تُحفظ بشكل مستقل عن المؤشرات المشتقة لإتاحة إعادة الحساب مستقبلاً.',
        segment1Desc: 'فترة البداية (الثواني 0 إلى 10)',
        segment2Desc: 'الفترة الوسطى (الثواني 10 إلى 20)',
        segment3Desc: 'فترة الختام (الثواني 20 إلى 30)',
      },
    },
    history: {
      title: 'سجل الاختبارات',
      subtitle: 'استعرض اختبارات النقر المكتملة وراقب التغيرات عبر الجلسات المتعددة.',
      filterHandLabel: 'تصفية حسب اليد',
      filterOriginLabel: 'مصدر البيانات',
      originAll: 'جميع السجلات',
      originLive: 'القياسات الفعلية فقط',
      originDemo: 'البيانات التجريبية فقط',
      trendChartTitle: 'مسار القياسات عبر الجلسات',
      trendChartSubtitle: 'تطور متوسط سرعة النقر ومعامل التباين (CV) عبر الاختبارات المكتملة.',
      trendSpeedSeries: 'متوسط السرعة (نقرة/ث)',
      trendCvSeries: 'معامل التباين (%)',
      trendCautionNote:
        'عرض رصدي فقط: لا يعني ارتفاع أو انخفاض المؤشرات بين الجلسات تغيراً تلقائياً في شدة مرض التصلب المتعدد.',
      trendEmpty: 'أكمل جلستين على الأقل أو عدّل المرشحات لعرض الرسم البياني التاريخي.',
      sessionsTableTitle: 'سجل الجلسات المكتملة',
      colDate: 'التاريخ',
      colHand: 'اليد',
      colOrigin: 'المصدر',
      colTotalTaps: 'إجمالي النقرات',
      colSpeed: 'متوسط السرعة',
      colRhythmCv: 'تباين الإيقاع',
      colPerfChange: 'تغير الأداء',
      colDoctorStatus: 'حالة الطبيب',
      colActions: 'فحص',
      emptyStateTitle: 'لا توجد اختبارات مطابقة للتصفية',
      emptyStateBody: 'غيّر خيارات التصفية أعلاه أو ابدأ اختبار نقر جديد لمدة 30 ثانية.',
      startFirstTestBtn: 'بدء اختبار النقر',
    },
    myDoctor: {
      title: 'طبيبي ومشاركة النتائج',
      subtitle: 'استعرض بيانات طبيب الأعصاب المسؤول وتابع حالة مشاركة اختباراتك.',
      connectionActive: 'الربط مع الفريق الطبي نشط (تجريبي)',
      specialtyLabel: 'التخصص',
      hospitalLabel: 'المركز / المؤسسة الطبية',
      emailLabel: 'البريد التجريبي',
      phoneLabel: 'هاتف العيادة التجريبي',
      officeHoursLabel: 'ساعات العيادة',
      demoContactNotice: 'بيانات تواصل افتراضية مخصصة لأغراض عرض النموذج الأولي فقط.',
      sharedTestsTitle: 'الاختبارات المشاركة مع طبيبك',
      sharedTestsSubtitle: 'تظهر هذه الجلسات المكتملة في لوحة متابعة الطبيب المسؤول.',
      unsharedTestsTitle: 'جلسات محفوظة محلياً (لم تُشارك بعد)',
      unsharedTestsSubtitle: 'يمكنك مشاركة أي جلسة محلية أدناه لإرسالها إلى قائمة مراجعة الطبيب.',
      noSharedTests: 'لم تقم بمشاركة أي اختبار مكتمل مع طبيبك حتى الآن.',
      noUnsharedTests: 'تمت مشاركة جميع جلساتك المكتملة مع طبيبك بالفعل.',
      shareNowBtn: 'مشاركة مع الطبيب',
      openSessionBtn: 'عرض النتائج',
      doctorNoteIncluded: 'تم تسجيل ملاحظة الطبيب',
    },
    profilePage: {
      title: 'الملف الشخصي',
      subtitle: 'بيانات الحساب التجريبي في نموذج المتابعة العصبية.',
      patientIdLabel: 'رقم ملف المريض',
      fullNameLabel: 'الاسم الكامل',
      emailLabel: 'البريد الإلكتروني',
      dobLabel: 'تاريخ الميلاد',
      preferredHandLabel: 'اليد الأساسية / المفضلة',
      clinicUnitLabel: 'مسار المتابعة',
      assignedDoctorLabel: 'طبيب الأعصاب المسؤول',
      doctorProfileNote: 'ملف طبيب الأعصاب',
      doctorLicenseNote: 'حساب طبيب افتراضي لعرض تجربة المراجعة السريرية.',
    },
    settingsPage: {
      title: 'الإعدادات وإمكانية الوصول',
      subtitle: 'خصّص لغة الواجهة والتنبيه الصوتي وخيارات التباين البصري.',
      languageSectionTitle: 'لغة الواجهة واتجاه التخطيط',
      languageSectionDesc:
        'بدّل بين العربية (من اليمين لليسار) والإنجليزية (من اليسار لليمين) في أي وقت دون فقدان تقدمك.',
      testPreferencesTitle: 'تفضيلات اختبار النقر',
      defaultHandLabel: 'اليد المحددة افتراضياً',
      soundFeedbackTitle: 'نغمة نقر خفيفة للتأكيد',
      soundFeedbackDesc: 'إصدار صوت نقرة هادئ ومنخفض عند تسجيل كل نقرة.',
      accessibilityTitle: 'إمكانية الوصول البصري والحركي',
      highContrastTitle: 'تباين عالٍ للحدود والنصوص',
      highContrastDesc: 'تعزيز وضوح حدود البطاقات وتباين النصوص لتسهيل القراءة.',
      reducedMotionTitle: 'تقليل الحركات البصرية',
      reducedMotionDesc: 'إيقاف تموجات التأكيد الحركية حول زر النقر.',
      demoDataSectionTitle: 'إدارة بيانات العرض التجريبي',
      demoDataSectionDesc:
        'تُحفظ الجلسات وحالة المشاركة وملاحظات الطبيب محلياً في المتصفح. إعادة التعيين تعيد الحالة النموذجية الأصلية.',
      resetDemoBtn: 'استعادة البيانات التجريبية',
      resetConfirmTitle: 'استعادة البيانات التجريبية الأصلية؟',
      resetConfirmBody:
        'سيؤدي هذا الإجراء إلى حذف الاختبارات الفعلية والملاحظات المسجلة محلياً وإرجاع حسابات العرض إلى حالتها الابتدائية.',
      resetSuccessMsg: 'تمت استعادة البيانات التجريبية الأولية بنجاح.',
    },
    doctorDashboard: {
      title: 'لوحة متابعة طبيب الأعصاب',
      subtitle: 'مراجعة جلسات اختبار النقر المشاركة من المرضى ومقارنة المسار الزمني.',
      totalPatientsCard: 'المرضى المسجلون',
      patientsWithRecentCard: 'مرضى لديهم جلسات مشاركة',
      pendingReviewsCard: 'جلسات بانتظار المراجعة',
      totalSharedTestsCard: 'إجمالي الجلسات المشاركة',
      requiringReviewTitle: 'جلسات تتطلب مراجعة سريرية',
      requiringReviewEmpty: 'تمت مراجعة جميع الجلسات المشاركة حالياً.',
      recentSharedTestsTitle: 'أحدث الجلسات المشاركة',
      recentSharedEmpty: 'لا توجد جلسات مشاركة من المرضى حتى الآن.',
      reviewNowBtn: 'فحص ومراجعة',
      openPatientProfileBtn: 'ملف المريض',
    },
    doctorPatients: {
      title: 'قائمة المرضى المعيّنين',
      subtitle: 'ابحث باسم المريض أو رقمه واستعرض قياسات النقر المشاركة.',
      searchPlaceholder: 'ابحث باسم المريض أو الرقم (مثال: MST-1042)…',
      filterAll: 'جميع المرضى',
      filterNeedsReview: 'بانتظار المراجعة',
      filterUpToDate: 'تمت المراجعة',
      colPatient: 'اسم المريض',
      colId: 'رقم المريض',
      colLastTest: 'آخر اختبار مشارك',
      colLatestSpeed: 'أحدث سرعة',
      colLatestCount: 'أحدث عدد نقرات',
      colStatus: 'حالة المراجعة',
      colAction: 'إجراء',
      openProfileBtn: 'فتح الملف',
      needsReviewStatus: 'بانتظار المراجعة',
      allReviewedStatus: 'تمت المراجعة',
      noSharedTestsYet: 'لا توجد اختبارات مشاركة',
      emptySearch: 'لا يوجد مرضى مطابقون لمعايير البحث أو التصفية الحالية.',
    },
    doctorPatientDetail: {
      backToRoster: 'العودة إلى قائمة المرضى',
      patientSummaryTitle: 'ملخص متابعة المريض',
      sharedSessionsCountLabel: 'الجلسات المشاركة',
      pendingReviewCountLabel: 'بانتظار المراجعة',
      latestSpeedLabel: 'أحدث سرعة',
      latestCvLabel: 'أحدث معامل تباين',
      longitudinalTitle: 'مقارنة الجلسات عبر الزمن',
      longitudinalSubtitle: 'مقارنة سرعة النقر وإجمالي النقرات وتباين الإيقاع عبر الجلسات المشاركة.',
      longitudinalCaution:
        'مؤشرات رصدية مساعدة فقط: يجب تفسير أي تغيرات زمنية ضمن السياق السريري الكامل للفحص العصبي.',
      sessionSelectorTitle: 'الجلسات المشاركة للمريض',
      sessionSelectorSubtitle: 'اختر أي جلسة أدناه لاستعراض الرسوم التفصيلية وإضافة ملاحظة المراجعة.',
      unsharedPrivacyNote: 'تظهر في واجهة الطبيب الجلسات التي قام المريض بمشاركتها صراحة فقط.',
      noSharedSessionsTitle: 'لا توجد جلسات مشاركة',
      noSharedSessionsBody: 'لم يشارك هذا المريض أي جلسة اختبار نقر مكتملة حتى الآن.',
      reviewPanelTitle: 'مراجعة الطبيب والملاحظة السريرية',
      reviewPanelSubtitle: 'سجّل ملاحظة متابعة مختصرة وحدد حالة الجلسة بأنها مراجَعة.',
      reviewStatusLabel: 'الحالة الحالية',
      clinicalNoteLabel: 'ملاحظة المراجعة السريرية',
      clinicalNotePlaceholder:
        'أدخل ملاحظة حول انتظام النقر أو التباعد أو خطة المتابعة (دون استنتاجات تشخيصية آلية)…',
      clinicalNoteValidation: 'يرجى كتابة ملاحظة مراجعة مختصرة قبل اعتماد المراجعة.',
      saveReviewBtn: 'اعتماد المراجعة وحفظ الملاحظة',
      updateReviewBtn: 'تحديث ملاحظة المراجعة',
      reviewSavedToast: 'تم حفظ ملاحظة الطبيب وربطها بسجل المريض.',
      reviewedByOn: 'تمت المراجعة في',
      clinicalEthicsReminder:
        'سجل داعم للتقييم والمتابعة فقط — لا يُصدر تشخيصاً طبياً أو توصيات علاجية آلية.',
    },
  },
};

