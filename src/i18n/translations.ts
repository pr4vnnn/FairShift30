/**
 * FairShift 360 - Centralized i18n Translation Dictionary
 * English and Tamil (தமிழ்)
 */

export const translations = {
  en: {
    // Brand
    brandName: 'FairShift 360',
    tagline: 'Fair Work. Clear Pay. Safer Workplaces.',
    sdgGoal: 'Aligned with UN SDG 8: Decent Work & Economic Growth',
    demoNotice: 'Prototype demonstration mode with local storage persistence. Not an emergency response service or official payroll.',
    
    // Roles & Navigation
    workerPortal: 'Worker Portal',
    employerPortal: 'Employer / Admin Portal',
    switchToWorker: 'Worker View',
    switchToEmployer: 'Employer View',
    roleWorker: 'Worker',
    roleAdmin: 'Administrator',
    activeWorker: 'Active Worker',
    
    // Worker Nav
    navDashboard: 'Dashboard',
    navShifts: 'My Shifts',
    navClearPay: 'ClearPay Calculator',
    navSafeVoice: 'SafeVoice Reports',
    navSkillPassport: 'Skill Passport',
    navWellbeing: 'Wellbeing Check',
    navShiftSwap: 'ShiftSwap Board',
    navWorkdayTimeline: 'Workday Timeline',
    
    // Admin Nav
    navAdminOverview: 'Command Overview',
    navWorkerDirectory: 'Worker Management',
    navSafetyCenter: 'Safety Command Center',
    navFairnessCenter: 'Fairness & Action Center',
    navWorkforceInsights: 'Workforce Insights',
    navAdminSwap: 'ShiftSwap Review',
    navSettings: 'System Settings',

    // General Actions
    clockIn: 'Clock In',
    clockOut: 'Clock Out',
    submit: 'Submit',
    cancel: 'Cancel',
    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    viewDetails: 'View Details',
    filter: 'Filter',
    search: 'Search',
    resetDemo: 'Reset Demo Data',
    exportPayslip: 'Print / Save Payslip',
    requestCorrection: 'Request Shift Correction',
    addSkill: 'Add New Skill',
    startCheckIn: 'Pre-Shift Wellbeing Check',
    
    // Statuses
    statusActive: 'Active Shift',
    statusCompleted: 'Completed',
    statusPending: 'Pending',
    statusApproved: 'Approved',
    statusRejected: 'Rejected',
    statusSubmitted: 'Submitted',
    statusUnderReview: 'Under Review',
    statusActionInProgress: 'Action in Progress',
    statusResolved: 'Resolved',
    statusOpen: 'Open',
    statusAccepted: 'Accepted',
    
    // Severities
    severityLow: 'Low',
    severityMedium: 'Medium',
    severityHigh: 'High',
    severityCritical: 'Critical',
    
    // Industries
    industryConstruction: 'Construction Site',
    industryFacilities: 'College Facilities & Maintenance',
    allIndustries: 'All Industries',

    // SafeVoice
    safeVoiceTitle: 'SafeVoice — Workplace Safety Reporting',
    safeVoiceSubtitle: 'Report safety hazards, faulty machinery, or unsafe working conditions quickly and transparently.',
    emergencyNoticeTitle: 'Immediate Hazard Notice',
    emergencyNoticeDesc: 'If you or someone else is in immediate life-threatening danger, move away to a safe area immediately and alert the site safety lead or dial local emergency services (112/100). This app does not replace emergency response.',
    categoryLabel: 'Incident Category',
    severityLabel: 'Severity Level',
    locationLabel: 'Worksite & Work Area',
    descriptionLabel: 'Detailed Hazard Description',
    anonymousToggle: 'Submit with Anonymous Display',
    anonymousNote: 'When enabled, your name is masked from general supervisor views. (Note: browser localStorage provides prototype demonstration, not military-grade anonymity).',
    reportSuccess: 'Incident reported successfully! Reference ID: ',
    myReportsTitle: 'My Reported Hazards',
    timelineTitle: 'Incident Progress & Response Timeline',
    addFollowUp: 'Add Follow-Up Note',
    actionNotesTitle: 'Supervisor & Safety Officer Actions',
    resolutionNoteTitle: 'Final Resolution Details',
    
    // ClearPay
    clearPayTitle: 'ClearPay — Transparent Wage Calculator',
    clearPaySubtitle: 'Understand exactly how your working hours translate to earnings with verified formulas and zero hidden deductions.',
    regularHours: 'Regular Hours',
    overtimeHours: 'Overtime Hours',
    hourlyRate: 'Hourly Rate',
    dailyRate: 'Daily Rate',
    overtimeMultiplier: 'Overtime Multiplier',
    bonuses: 'Incentives & Allowances',
    deductions: 'Statutory / Agreed Deductions',
    estimatedTakeHome: 'Estimated Take-Home Pay',
    formulaExplanation: 'Regular Earnings = Regular Hours × Base Rate | Overtime Earnings = Overtime Hours × Base Rate × Multiplier | Estimated Take-Home = Regular + Overtime + Bonuses − Deductions',
    comparisonNotice: 'Comparing estimate against actual recorded shifts in the current period.',
    discrepancyDetected: 'Hour Discrepancy Detected',
    hoursMatched: 'Hours Match Recorded Shifts',
    disclaimerPayroll: 'Calculations are transparent estimates for worker insight and discussion, not legal tax declarations or official banking payroll receipts.',

    // Shift Tracking
    shiftStatus: 'Current Shift Status',
    onShift: 'Currently On Shift',
    offShift: 'Clocked Out / Not On Shift',
    elapsedTime: 'Time Elapsed',
    breakTime: 'Break Minutes',
    netWorkingHours: 'Net Working Hours',
    addBreak: 'Log Break',
    missingClockOutWarning: 'System flagged this shift as exceeding typical shift limits without clock-out. Please review or submit a correction.',

    // Skill Passport
    skillPassportTitle: 'Worker Skill Passport',
    skillPassportSubtitle: 'Worker-owned record of verified trade competencies, equipment licenses, and safety training certificates.',
    employerVerified: 'Employer Verified',
    selfReported: 'Self Reported',
    expiringSoon: 'Certificate Expiring Soon',

    // Wellbeing
    wellbeingTitle: 'Pre-Shift Fatigue & Wellbeing Check',
    wellbeingSubtitle: 'Optional check-in to promote safe shifts and manage fatigue responsibly.',
    sleepHoursLabel: 'Hours of Sleep in Last 24 Hours',
    fatigueScoreLabel: 'How rested do you feel today? (1 = Fully Rested, 5 = Severely Fatigued)',
    workloadLabel: 'Perceived Physical Workload Ahead',
    wellbeingAdvice: 'FairShift Safety Guide: High fatigue combined with working at height or operating heavy machinery elevates accident risks. Please notify your safety coordinator.',

    // Common labels
    date: 'Date',
    time: 'Time',
    worker: 'Worker',
    supervisor: 'Supervisor',
    notes: 'Notes',
    action: 'Action',
    resolved: 'Resolved',
    unresolved: 'Unresolved'
  },
  ta: {
    // Brand
    brandName: 'ஃபேர்ஷிப்ட் 360',
    tagline: 'நியாயமான பணி. வெளிப்படையான ஊதியம். பாதுகாப்பான பணியிடங்கள்.',
    sdgGoal: 'ஐ.நா. நிலையான வளர்ச்சி இலக்கு 8: கண்ணியமான வேலை மற்றும் பொருளாதார வளர்ச்சி',
    demoNotice: 'முன்மாதிரி செயல்முறை முறை. இது அவசரகால மீட்பு அமைப்பு அல்லது உத்தியோகபூர்வ ஊதிய ரசீது அல்ல.',
    
    // Roles & Navigation
    workerPortal: 'தொழிலாளர் தளம்',
    employerPortal: 'நிர்வாகி / மேற்பார்வையாளர் தளம்',
    switchToWorker: 'தொழிலாளர் பார்வை',
    switchToEmployer: 'நிர்வாகி பார்வை',
    roleWorker: 'தொழிலாளர்',
    roleAdmin: 'நிர்வாகி',
    activeWorker: 'செயலில் உள்ள தொழிலாளர்',
    
    // Worker Nav
    navDashboard: 'முகப்பு பலகை',
    navShifts: 'எனது ஷிப்டுகள்',
    navClearPay: 'தெளிவான ஊதிய கணிப்பான்',
    navSafeVoice: 'பாதுகாப்பு புகார்கள்',
    navSkillPassport: 'திறன் பாஸ்போர்ட்',
    navWellbeing: 'நலவாழ்வு சோதனை',
    navShiftSwap: 'ஷிப்ட் பரிமாற்ற பலகை',
    navWorkdayTimeline: 'வேலை நாள் காலவரிசை',
    
    // Admin Nav
    navAdminOverview: 'நிர்வாக கண்ணோட்டம்',
    navWorkerDirectory: 'பணியாளர் மேலாண்மை',
    navSafetyCenter: 'பாதுகாப்பு கட்டளை மையம்',
    navFairnessCenter: 'நீதி மற்றும் செயல் மையம்',
    navWorkforceInsights: 'பணியாளர் புள்ளிவிவரங்கள்',
    navAdminSwap: 'ஷிப்ட் பரிமாற்ற சரிபார்ப்பு',
    navSettings: 'கணினி அமைப்புகள்',

    // General Actions
    clockIn: 'வேலை தொடங்கு (Clock In)',
    clockOut: 'வேலை முடி (Clock Out)',
    submit: 'சமர்ப்பி',
    cancel: 'ரத்து செய்',
    save: 'சேமி',
    edit: 'திருத்து',
    delete: 'நீக்கு',
    viewDetails: 'விவரங்களைப் பார்',
    filter: 'வடிகட்டு',
    search: 'தேடு',
    resetDemo: 'டெமோ தரவை மீட்டமை',
    exportPayslip: 'ஊதிய சீட்டை அச்சிடு / சேமி',
    requestCorrection: 'ஷிப்ட் திருத்தம் கோரு',
    addSkill: 'புதிய திறன் சேர்',
    startCheckIn: 'நலவாழ்வு சோதனை செய்',
    
    // Statuses
    statusActive: 'செயலில் உள்ள ஷிப்ட்',
    statusCompleted: 'முடிந்தது',
    statusPending: 'நிலுவையில் உள்ளது',
    statusApproved: 'ஒப்புதல் அளிக்கப்பட்டது',
    statusRejected: 'நிராகரிக்கப்பட்டது',
    statusSubmitted: 'சமர்ப்பிக்கப்பட்டது',
    statusUnderReview: 'பரிசீலனையில்',
    statusActionInProgress: 'நடவடிக்கை எடுக்கப்படுகிறது',
    statusResolved: 'தீர்க்கப்பட்டது',
    statusOpen: 'திறந்துள்ளது',
    statusAccepted: 'ஏற்றுக்கொள்ளப்பட்டது',
    
    // Severities
    severityLow: 'குறைந்த ஆபத்து',
    severityMedium: 'நடுத்தர ஆபத்து',
    severityHigh: 'அதிக ஆபத்து',
    severityCritical: 'மிக அவசரமானது',
    
    // Industries
    industryConstruction: 'கட்டுமான தளம்',
    industryFacilities: 'கல்லூரி வசதிகள் மற்றும் பராமரிப்பு',
    allIndustries: 'அனைத்து துறைகளும்',

    // SafeVoice
    safeVoiceTitle: 'SafeVoice — பணியிட பாதுகாப்பு புகார்',
    safeVoiceSubtitle: 'பணியிட ஆபத்துகள், பழுதடைந்த இயந்திரங்கள் அல்லது பாதுகாப்பற்ற நிலைமைகளை உடனடியாக வெளிப்படையாக அறிவியுங்கள்.',
    emergencyNoticeTitle: 'உடனடி ஆபத்து எச்சரிக்கை',
    emergencyNoticeDesc: 'உயிருக்கு உடனடி ஆபத்து ஏற்பட்டால், உடனடியாக பாதுகாப்பான இடத்திற்குச் சென்று அவசர உதவி எண் (112/100) அல்லது தள பாதுகாப்பு அதிகாரியை அணுகவும்.',
    categoryLabel: 'ஆபத்து வகை',
    severityLabel: 'தீவிர நிலை',
    locationLabel: 'பணி தளம் மற்றும் பகுதி',
    descriptionLabel: 'விவரமான விளக்கம்',
    anonymousToggle: 'பெயர் மறைத்து சமர்ப்பி (Anonymous)',
    anonymousNote: 'செயல்படுத்தினால், மேற்பார்வையாளர் பார்வையில் உங்கள் பெயர் மறைக்கப்படும்.',
    reportSuccess: 'புகார் வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது! குறிப்பு எண்: ',
    myReportsTitle: 'எனது பாதுகாப்பு புகார்கள்',
    timelineTitle: 'நடவடிக்கை மற்றும் முன்னேற்ற காலவரிசை',
    addFollowUp: 'கூடுதல் குறிப்பு சேர்',
    actionNotesTitle: 'மேற்பார்வையாளர் நடவடிக்கை குறிப்புகள்',
    resolutionNoteTitle: 'இறுதி தீர்வு விவரங்கள்',
    
    // ClearPay
    clearPayTitle: 'ClearPay — வெளிப்படையான ஊதிய கணிப்பான்',
    clearPaySubtitle: 'உங்கள் வேலை நேரம் எவ்வாறு ஊதியமாக கணக்கிடப்படுகிறது என்பதை துல்லியமாக அறிந்து கொள்ளுங்கள்.',
    regularHours: 'வழக்கமான வேலை நேரம்',
    overtimeHours: 'கூடுதல் வேலை நேரம் (OT)',
    hourlyRate: 'மணி நேர ஊதியம்',
    dailyRate: 'நாள் ஊதியம்',
    overtimeMultiplier: 'கூடுதல் நேர பெருக்கி',
    bonuses: 'ஊக்கத்தொகை & படிகள்',
    deductions: 'சட்டரீதியான பிடித்தங்கள்',
    estimatedTakeHome: 'மதிப்பிடப்பட்ட கையில் கிடைக்கும் ஊதியம்',
    formulaExplanation: 'வழக்கமான ஊதியம் = வழக்கமான நேரம் × அடிப்படை விகிதம் | கூடுதல் ஊதியம் = கூடுதல் நேரம் × விகிதம் × பெருக்கி | நிகர ஊதியம் = வழக்கமான + கூடுதல் + படிகள் − பிடித்தங்கள்',
    comparisonNotice: 'பதிவு செய்யப்பட்ட உண்மையான ஷிப்ட் நேரத்துடன் ஒப்பிடப்படுகிறது.',
    discrepancyDetected: 'வேலை நேரத்தில் முரண்பாடு கண்டறியப்பட்டது',
    hoursMatched: 'பதிவு செய்யப்பட்ட நேரத்துடன் பொருந்துகிறது',
    disclaimerPayroll: 'இந்த கணக்கீடு தொழிலாளர் புரிதலுக்கான மதிப்பீடாகும்; அதிகாரப்பூர்வ வங்கி ரசீது அல்ல.',

    // Shift Tracking
    shiftStatus: 'தற்போதைய ஷிப்ட் நிலை',
    onShift: 'தற்போது பணியில் உள்ளார்',
    offShift: 'பணியில் இல்லை (Clocked Out)',
    elapsedTime: 'கடந்த நேரம்',
    breakTime: 'இடைவேளை நேரம் (நிமிடங்கள்)',
    netWorkingHours: 'நிகர வேலை நேரம்',
    addBreak: 'இடைவேளை பதிவு செய்',
    missingClockOutWarning: 'இந்த ஷிப்ட் வழமையான நேரத்தை தாண்டியும் முடிவடையவில்லை. தயவுசெய்து திருத்தம் கோருங்கள்.',

    // Skill Passport
    skillPassportTitle: 'தொழிலாளர் திறன் பாஸ்போர்ட்',
    skillPassportSubtitle: 'சான்றளிக்கப்பட்ட தொழில் திறன்கள் மற்றும் பாதுகாப்பு பயிற்சி சான்றிதழ்களின் பதிவு.',
    employerVerified: 'நிறுவனத்தால் சரிபார்க்கப்பட்டது',
    selfReported: 'சுய அறிவிப்பு',
    expiringSoon: 'சான்றிதழ் விரைவில் காலாவதியாகிறது',

    // Wellbeing
    wellbeingTitle: 'பணிக்கு முந்தைய உடல்நல & சோர்வு பரிசோதனை',
    wellbeingSubtitle: 'பாதுகாப்பான பணி சூழலுக்காக சுய விருப்பத்தின் பேரில் செய்யப்படும் சோர்வு ஆய்வு.',
    sleepHoursLabel: 'கடந்த 24 மணி நேரத்தில் தூங்கிய நேரம்',
    fatigueScoreLabel: 'இன்றைய சோர்வு நிலை (1 = சுறுசுறுப்பு, 5 = கடுமையான சோர்வு)',
    workloadLabel: 'எதிர்பார்க்கப்படும் பணிச்சுமை',
    wellbeingAdvice: 'அதிக சோர்வுடன் உயரமான இடங்களில் வேலை செய்வதும் கனரக இயந்திரங்களை இயக்குவதும் விபத்து அபாயத்தை அதிகரிக்கும். மேற்பார்வையாளருக்கு தெரிவிக்கவும்.',

    // Common labels
    date: 'தேதி',
    time: 'நேரம்',
    worker: 'தொழிலாளர்',
    supervisor: 'மேற்பார்வையாளர்',
    notes: 'குறிப்புகள்',
    action: 'செயல்',
    resolved: 'தீர்க்கப்பட்டது',
    unresolved: 'தீர்க்கப்படவில்லை'
  }
};
