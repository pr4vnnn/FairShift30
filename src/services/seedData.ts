import { 
  Worker, 
  Shift, 
  SafetyIncident, 
  ShiftCorrectionRequest, 
  SkillRecord, 
  WellbeingCheckIn, 
  ShiftSwapRequest, 
  ActivityEvent 
} from '../types';

export const INITIAL_WORKERS: Worker[] = [
  {
    id: 'w-101',
    name: 'Muthu Raman',
    nameTa: 'முத்து ராமன்',
    role: 'Senior Rebar & Concrete Mason',
    roleTa: 'மூத்த கான்கிரீட் & ரீபார் மேஸ்திரி',
    industry: 'construction',
    worksite: 'Apex Tower B — Sector 4',
    worksiteTa: 'அபெக்ஸ் டவர் பி — பிரிவு 4',
    department: 'Structural Engineering & Masonry',
    rateType: 'hourly',
    hourlyRate: 240, // ₹240/hr
    dailyRate: 1920,
    phone: '+91 98401 22341',
    emergencyContact: 'Lakshmi Raman (+91 98401 22342)',
    avatarUrl: '',
    joinedDate: '2024-03-15',
    active: true
  },
  {
    id: 'w-102',
    name: 'Priya Sharma',
    nameTa: 'பிரியா சர்மா',
    role: 'Electrical Maintenance Lead',
    roleTa: 'மின் பராமரிப்பு தலைவர்',
    industry: 'facilities',
    worksite: 'University Engineering Complex — Block C',
    worksiteTa: 'பல்கலைக்கழக பொறியியல் வளாகம் — பிளாக் சி',
    department: 'College Facilities & Utilities',
    rateType: 'hourly',
    hourlyRate: 280, // ₹280/hr
    dailyRate: 2240,
    phone: '+91 97102 33451',
    emergencyContact: 'Rajesh Sharma (+91 97102 33452)',
    avatarUrl: '',
    joinedDate: '2023-08-10',
    active: true
  },
  {
    id: 'w-103',
    name: 'Arun Kumar',
    nameTa: 'அருண் குமார்',
    role: 'Scaffold & Height Safety Specialist',
    roleTa: 'சாரக்கட்டு மற்றும் உயர பாதுகாப்பு நிபுணர்',
    industry: 'construction',
    worksite: 'Apex Tower B — Sector 4',
    worksiteTa: 'அபெக்ஸ் டவர் பி — பிரிவு 4',
    department: 'Civil Construction',
    rateType: 'hourly',
    hourlyRate: 220,
    dailyRate: 1760,
    phone: '+91 94441 55672',
    emergencyContact: 'Sundar Kumar (+91 94441 55673)',
    avatarUrl: '',
    joinedDate: '2024-01-20',
    active: true
  },
  {
    id: 'w-104',
    name: 'Kavitha Rajan',
    nameTa: 'கவிதா ராஜன்',
    role: 'HVAC & Environmental Control Tech',
    roleTa: 'HVAC மற்றும் சுற்றுச்சூழல் கட்டுப்பாட்டு தொழில்நுட்ப வல்லுநர்',
    industry: 'facilities',
    worksite: 'University Central Science Laboratories',
    worksiteTa: 'பல்கலைக்கழக மத்திய அறிவியல் ஆய்வகங்கள்',
    department: 'College Facilities & Utilities',
    rateType: 'hourly',
    hourlyRate: 260,
    dailyRate: 2080,
    phone: '+91 98840 66781',
    emergencyContact: 'S. Rajan (+91 98840 66782)',
    avatarUrl: '',
    joinedDate: '2023-11-05',
    active: true
  },
  {
    id: 'w-105',
    name: 'Selvam Perumal',
    nameTa: 'செல்வம் பெருமாள்',
    role: 'Heavy Machinery & Crane Operator',
    roleTa: 'கனரக இயந்திரங்கள் மற்றும் கிரேன் ஆபரேட்டர்',
    industry: 'construction',
    worksite: 'Logistics Depot & Materials Yard',
    worksiteTa: 'தளவாடங்கள் கிடங்கு மற்றும் பொருட்கள் யார்டு',
    department: 'Heavy Equipment Division',
    rateType: 'hourly',
    hourlyRate: 310,
    dailyRate: 2480,
    phone: '+91 97910 88991',
    emergencyContact: 'Valli Perumal (+91 97910 88992)',
    avatarUrl: '',
    joinedDate: '2023-05-12',
    active: true
  }
];

export const INITIAL_SHIFTS: Shift[] = [
  // Today's active shift for Muthu Raman (w-101)
  {
    id: 's-1001',
    workerId: 'w-101',
    workerName: 'Muthu Raman',
    industry: 'construction',
    date: new Date().toISOString().slice(0, 10),
    clockInTime: new Date(Date.now() - 4.5 * 3600000).toISOString(), // 4.5 hours ago
    breakMinutes: 30,
    netHours: 4.0,
    regularHours: 4.0,
    overtimeHours: 0,
    status: 'active',
    notes: 'Tower B Level 6 concrete reinforcement'
  },
  // Previous completed shifts for Muthu Raman (w-101)
  {
    id: 's-1002',
    workerId: 'w-101',
    workerName: 'Muthu Raman',
    industry: 'construction',
    date: '2026-10-25',
    clockInTime: '2026-10-25T08:00:00.000Z',
    clockOutTime: '2026-10-25T18:30:00.000Z', // 10.5h - 1h break = 9.5h (1.5h OT)
    breakMinutes: 60,
    netHours: 9.5,
    regularHours: 8.0,
    overtimeHours: 1.5,
    status: 'completed',
    notes: 'Column pour inspection and rebar tying'
  },
  {
    id: 's-1003',
    workerId: 'w-101',
    workerName: 'Muthu Raman',
    industry: 'construction',
    date: '2026-10-24',
    clockInTime: '2026-10-24T08:15:00.000Z',
    clockOutTime: '2026-10-24T17:15:00.000Z',
    breakMinutes: 60,
    netHours: 8.0,
    regularHours: 8.0,
    overtimeHours: 0,
    status: 'completed',
    notes: 'Safety induction & beam reinforcement'
  },
  {
    id: 's-1004',
    workerId: 'w-101',
    workerName: 'Muthu Raman',
    industry: 'construction',
    date: '2026-10-23',
    clockInTime: '2026-10-23T08:00:00.000Z',
    clockOutTime: '2026-10-23T19:00:00.000Z', // 11h - 1h break = 10h (2h OT)
    breakMinutes: 60,
    netHours: 10.0,
    regularHours: 8.0,
    overtimeHours: 2.0,
    status: 'completed',
    notes: 'Foundation slab cure monitoring'
  },
  // Shifts for Priya Sharma (w-102)
  {
    id: 's-1005',
    workerId: 'w-102',
    workerName: 'Priya Sharma',
    industry: 'facilities',
    date: new Date().toISOString().slice(0, 10),
    clockInTime: new Date(Date.now() - 3 * 3600000).toISOString(),
    breakMinutes: 15,
    netHours: 2.75,
    regularHours: 2.75,
    overtimeHours: 0,
    status: 'active',
    notes: 'Substation B scheduled breaker audit'
  },
  {
    id: 's-1006',
    workerId: 'w-102',
    workerName: 'Priya Sharma',
    industry: 'facilities',
    date: '2026-10-25',
    clockInTime: '2026-10-25T07:30:00.000Z',
    clockOutTime: '2026-10-25T16:00:00.000Z',
    breakMinutes: 45,
    netHours: 7.75,
    regularHours: 7.75,
    overtimeHours: 0,
    status: 'completed',
    notes: 'Library emergency lighting test'
  },
  // Shifts for Arun Kumar (w-103)
  {
    id: 's-1007',
    workerId: 'w-103',
    workerName: 'Arun Kumar',
    industry: 'construction',
    date: '2026-10-25',
    clockInTime: '2026-10-25T08:00:00.000Z',
    clockOutTime: '2026-10-25T18:00:00.000Z',
    breakMinutes: 60,
    netHours: 9.0,
    regularHours: 8.0,
    overtimeHours: 1.0,
    status: 'completed',
    notes: 'Scaffold plank fastening Level 5'
  },
  // Shifts for Kavitha Rajan (w-104)
  {
    id: 's-1008',
    workerId: 'w-104',
    workerName: 'Kavitha Rajan',
    industry: 'facilities',
    date: '2026-10-25',
    clockInTime: '2026-10-25T08:30:00.000Z',
    clockOutTime: '2026-10-25T17:00:00.000Z',
    breakMinutes: 45,
    netHours: 7.75,
    regularHours: 7.75,
    overtimeHours: 0,
    status: 'completed',
    notes: 'Chemistry fume exhaust maintenance'
  }
];

export const INITIAL_SAFETY_INCIDENTS: SafetyIncident[] = [
  {
    id: 'inc-201',
    refId: 'FS-SAF-2026-089',
    reporterWorkerId: 'w-101',
    reporterName: 'Muthu Raman',
    isAnonymous: false,
    industry: 'construction',
    category: 'Working at Height',
    severity: 'Critical',
    location: 'Apex Tower B — Sector 4',
    workArea: 'External Scaffolding Bay 3, Level 7',
    description: 'Two safety harness anchor lifeline clamps are heavily corroded and missing locking cotter pins. Workers were asked to move across without a certified secondary safety lanyard.',
    submittedAt: new Date(Date.now() - 36 * 3600000).toISOString(), // 36 hours ago
    status: 'Action in Progress',
    assignedOwner: 'Site Safety Officer K. Sundaram',
    actionNotes: [
      {
        id: 'an-1',
        timestamp: new Date(Date.now() - 32 * 3600000).toISOString(),
        author: 'Safety Officer K. Sundaram',
        note: 'Inspected Bay 3 scaffolding. Red-tagged the section immediately to stop worker access.'
      },
      {
        id: 'an-2',
        timestamp: new Date(Date.now() - 18 * 3600000).toISOString(),
        author: 'Scaffolding Contractor Rep',
        note: 'Replacement galvanized anchorage brackets dispatched to Level 7. Installation crew arriving today.'
      }
    ],
    photoPreviewUrl: ''
  },
  {
    id: 'inc-202',
    refId: 'FS-SAF-2026-092',
    reporterWorkerId: 'w-102',
    reporterName: 'Priya Sharma',
    isAnonymous: false,
    industry: 'facilities',
    category: 'Electrical',
    severity: 'High',
    location: 'University Engineering Complex — Block C',
    workArea: 'Main Switchboard Basement Room B-04',
    description: 'Ground fault interrupter breaker is vibrating and warm to the touch (48°C) under partial 3-phase load. Water drip trail detected from overhead condenser pipe.',
    submittedAt: new Date(Date.now() - 14 * 3600000).toISOString(),
    status: 'Under Review',
    assignedOwner: 'Facilities Engineer Anandhi V.',
    actionNotes: [
      {
        id: 'an-3',
        timestamp: new Date(Date.now() - 10 * 3600000).toISOString(),
        author: 'Facilities Engineer Anandhi V.',
        note: 'Thermal camera verification completed. High-priority pipe drip containment order issued.'
      }
    ]
  },
  {
    id: 'inc-203',
    refId: 'FS-SAF-2026-081',
    reporterWorkerId: '',
    reporterName: 'Anonymous Reporter',
    isAnonymous: true,
    industry: 'construction',
    category: 'Equipment',
    severity: 'Medium',
    location: 'Logistics Depot & Materials Yard',
    workArea: 'Diesel Forklift #3',
    description: 'Reverse backup beeper and left brake lamp fail intermittently when operating on the slope.',
    submittedAt: new Date(Date.now() - 72 * 3600000).toISOString(),
    status: 'Resolved',
    assignedOwner: 'Fleet Manager R. David',
    actionNotes: [
      {
        id: 'an-4',
        timestamp: new Date(Date.now() - 60 * 3600000).toISOString(),
        author: 'Fleet Manager R. David',
        note: 'Taken out of shift rotation and moved to maintenance bay.'
      }
    ],
    resolutionNote: 'Replaced reverse alarm wiring harness and installed new LED brake assembly. Test drive verified and passed 100% safety checklist.',
    resolvedAt: new Date(Date.now() - 24 * 3600000).toISOString()
  },
  {
    id: 'inc-204',
    refId: 'FS-SAF-2026-094',
    reporterWorkerId: 'w-104',
    reporterName: 'Kavitha Rajan',
    isAnonymous: false,
    industry: 'facilities',
    category: 'Chemicals',
    severity: 'High',
    location: 'University Central Science Laboratories',
    workArea: 'Chemistry Prep Room C-210',
    description: 'Ventilation exhaust duct damper in solvent storage room stuck at 15% open. Strong hydrocarbon vapor odor reported by custodial staff.',
    submittedAt: new Date(Date.now() - 6 * 3600000).toISOString(),
    status: 'Submitted',
    actionNotes: []
  }
];

export const INITIAL_CORRECTION_REQUESTS: ShiftCorrectionRequest[] = [
  {
    id: 'corr-301',
    workerId: 'w-101',
    workerName: 'Muthu Raman',
    shiftId: 's-1003',
    shiftDate: '2026-10-24',
    originalClockIn: '2026-10-24T08:15:00.000Z',
    originalClockOut: '2026-10-24T17:15:00.000Z',
    proposedClockIn: '2026-10-24T07:45:00.000Z',
    proposedClockOut: '2026-10-24T17:45:00.000Z',
    reason: 'Gate biometric scanner had offline network fault; supervisor manual entry log signed at 07:45 AM. Stayed till 17:45 PM for concrete test cube delivery.',
    status: 'Pending',
    submittedAt: new Date(Date.now() - 20 * 3600000).toISOString()
  }
];

export const INITIAL_SKILLS: SkillRecord[] = [
  // Muthu Raman (w-101)
  {
    id: 'sk-401',
    workerId: 'w-101',
    skillName: 'Heavy Structural Rebar Tying & Bending',
    skillNameTa: 'கனரக கட்டமைப்பு ரீபார் கட்டுதல் & வளைத்தல்',
    category: 'Masonry & Concrete',
    confidenceLevel: 5,
    certificationName: 'National Trade Certificate (NTC) Masonry',
    issuedDate: '2022-04-10',
    expiryDate: '2027-04-10',
    isEmployerVerified: true,
    taskCompetency: 'Qualified for multi-storey high-rise shear walls and pile caps'
  },
  {
    id: 'sk-402',
    workerId: 'w-101',
    skillName: 'Working at Heights & Fall Arrest Systems',
    skillNameTa: 'உயரங்களில் பணிபுரிதல் & வீழ்ச்சி தடுப்பு பாதுகாப்பு',
    category: 'Safety & Compliance',
    confidenceLevel: 4,
    certificationName: 'OSHA 30 Construction Rigging & Fall Protection',
    issuedDate: '2023-11-20',
    expiryDate: new Date(Date.now() + 18 * 86400000).toISOString().slice(0, 10), // Expiring in 18 days!
    isEmployerVerified: true,
    taskCompetency: 'Authorized for suspended cradle and external perimeter staging'
  },
  {
    id: 'sk-403',
    workerId: 'w-101',
    skillName: 'Blueprint & Structural Drawings Reading',
    skillNameTa: 'கட்டமைப்பு வரைபடங்கள் வாசித்தல்',
    category: 'Technical Planning',
    confidenceLevel: 4,
    taskCompetency: 'Can interpret reinforcement bar schedules and CAD details independently',
    isEmployerVerified: false
  },
  // Priya Sharma (w-102)
  {
    id: 'sk-404',
    workerId: 'w-102',
    skillName: '3-Phase Industrial Distribution Panels',
    category: 'Electrical Utilities',
    confidenceLevel: 5,
    certificationName: 'Certified Electrical Supervisor License (Grade A)',
    issuedDate: '2021-06-15',
    expiryDate: '2026-11-15', // Expiring in ~20 days!
    isEmployerVerified: true,
    taskCompetency: 'Authorized for high-voltage breaker switching up to 11kV'
  },
  {
    id: 'sk-405',
    workerId: 'w-102',
    skillName: 'Campus Fire Alarm & Smoke Damper Integration',
    category: 'Life Safety Systems',
    confidenceLevel: 5,
    certificationName: 'NFPA 72 Fire Alarm Code Specialist',
    issuedDate: '2023-02-10',
    expiryDate: '2028-02-10',
    isEmployerVerified: true,
    taskCompetency: 'Annual sensor calibration and annunciator loop testing'
  }
];

export const INITIAL_WELLBEING: WellbeingCheckIn[] = [
  {
    id: 'wb-501',
    workerId: 'w-101',
    timestamp: new Date(Date.now() - 4.6 * 3600000).toISOString(),
    date: new Date().toISOString().slice(0, 10),
    sleepHours: 7,
    fatigueScore: 2,
    workloadFeeling: 'Manageable',
    concernFlagged: false,
    privateNotes: 'Slept adequately, ready for morning concrete pour.'
  },
  {
    id: 'wb-502',
    workerId: 'w-101',
    timestamp: '2026-10-24T07:40:00.000Z',
    date: '2026-10-24',
    sleepHours: 5,
    fatigueScore: 4,
    workloadFeeling: 'Challenging',
    concernFlagged: true,
    flagReason: 'Self-reported low sleep (5 hrs) and fatigue score 4/5 before structural pour.',
    privateNotes: 'Long transit delay last night.'
  }
];

export const INITIAL_SWAP_REQUESTS: ShiftSwapRequest[] = [
  {
    id: 'swap-601',
    requesterWorkerId: 'w-103',
    requesterName: 'Arun Kumar',
    requesterShiftDate: '2026-10-29',
    requesterShiftTime: '08:00 AM – 04:30 PM (Morning)',
    industry: 'construction',
    targetRole: 'Scaffold Specialist / Mason',
    reason: 'Family medical appointment in hometown during morning hours. Can take Friday or Saturday evening shift in return.',
    status: 'Open',
    createdAt: new Date(Date.now() - 12 * 3600000).toISOString()
  },
  {
    id: 'swap-602',
    requesterWorkerId: 'w-104',
    requesterName: 'Kavitha Rajan',
    requesterShiftDate: '2026-10-30',
    requesterShiftTime: '02:00 PM – 10:30 PM (Evening)',
    industry: 'facilities',
    targetRole: 'HVAC Tech / Electrical Maintenance',
    reason: 'University convocation preparation setup duty. Need morning coverage.',
    status: 'Accepted',
    acceptedByWorkerId: 'w-102',
    acceptedByName: 'Priya Sharma',
    acceptedAt: new Date(Date.now() - 4 * 3600000).toISOString(),
    createdAt: new Date(Date.now() - 24 * 3600000).toISOString()
  }
];

export const INITIAL_ACTIVITY_LOGS: ActivityEvent[] = [
  {
    id: 'act-701',
    timestamp: new Date(Date.now() - 10 * 60000).toISOString(),
    type: 'shift',
    title: 'Clock In Recorded',
    titleTa: 'வேலை தொடக்கம் பதிவு செய்யப்பட்டது',
    details: 'Muthu Raman clocked in at Apex Tower B Sector 4.',
    actor: 'Muthu Raman',
    actorRole: 'worker'
  },
  {
    id: 'act-702',
    timestamp: new Date(Date.now() - 36 * 3600000).toISOString(),
    type: 'safety',
    title: 'Critical Safety Hazard Reported',
    titleTa: 'அவசர பாதுகாப்பு புகார் சமர்ப்பிக்கப்பட்டது',
    details: 'Reference FS-SAF-2026-089: Scaffolding anchor clamp defect reported.',
    actor: 'Muthu Raman',
    actorRole: 'worker'
  },
  {
    id: 'act-703',
    timestamp: new Date(Date.now() - 32 * 3600000).toISOString(),
    type: 'safety',
    title: 'Supervisor Action Note Added',
    titleTa: 'மேற்பார்வையாளர் நடவடிக்கை குறிப்பு சேர்க்கப்பட்டது',
    details: 'Safety Officer K. Sundaram red-tagged Bay 3 scaffolding section.',
    actor: 'Safety Officer K. Sundaram',
    actorRole: 'admin'
  },
  {
    id: 'act-704',
    timestamp: new Date(Date.now() - 20 * 3600000).toISOString(),
    type: 'correction',
    title: 'Shift Correction Requested',
    titleTa: 'ஷிப்ட் திருத்தம் கோரப்பட்டது',
    details: 'Muthu Raman submitted adjustment for 24 Oct biometric scanner lag.',
    actor: 'Muthu Raman',
    actorRole: 'worker'
  }
];
