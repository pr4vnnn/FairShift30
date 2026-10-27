import {
  Worker,
  Shift,
  SafetyIncident,
  ShiftCorrectionRequest,
  SkillRecord,
  WellbeingCheckIn,
  ShiftSwapRequest,
  ActivityEvent,
  FairnessAlert,
  WageEstimate,
  IncidentStatus
} from '../types';
import {
  INITIAL_WORKERS,
  INITIAL_SHIFTS,
  INITIAL_SAFETY_INCIDENTS,
  INITIAL_CORRECTION_REQUESTS,
  INITIAL_SKILLS,
  INITIAL_WELLBEING,
  INITIAL_SWAP_REQUESTS,
  INITIAL_ACTIVITY_LOGS
} from './seedData';

const STORAGE_KEY = 'fairshift360_data_v1';

interface StorageSchema {
  workers: Worker[];
  shifts: Shift[];
  incidents: SafetyIncident[];
  corrections: ShiftCorrectionRequest[];
  skills: SkillRecord[];
  wellbeing: WellbeingCheckIn[];
  swaps: ShiftSwapRequest[];
  activities: ActivityEvent[];
}

function getInitialState(): StorageSchema {
  return {
    workers: INITIAL_WORKERS,
    shifts: INITIAL_SHIFTS,
    incidents: INITIAL_SAFETY_INCIDENTS,
    corrections: INITIAL_CORRECTION_REQUESTS,
    skills: INITIAL_SKILLS,
    wellbeing: INITIAL_WELLBEING,
    swaps: INITIAL_SWAP_REQUESTS,
    activities: INITIAL_ACTIVITY_LOGS
  };
}

function loadState(): StorageSchema {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = getInitialState();
      saveState(initial);
      return initial;
    }
    const parsed = JSON.parse(raw);
    // basic sanity checks
    if (!parsed.workers || !Array.isArray(parsed.shifts)) {
      const initial = getInitialState();
      saveState(initial);
      return initial;
    }
    return parsed;
  } catch {
    const initial = getInitialState();
    saveState(initial);
    return initial;
  }
}

function saveState(state: StorageSchema): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent('fairshift_storage_update'));
  } catch (e) {
    console.error('Failed to save FairShift 360 state to localStorage', e);
  }
}

export const StorageService = {
  resetToDefaults(): void {
    const fresh = getInitialState();
    saveState(fresh);
  },

  // Workers
  getWorkers(): Worker[] {
    return loadState().workers;
  },

  getWorkerById(id: string): Worker | undefined {
    return loadState().workers.find((w) => w.id === id);
  },

  updateWorker(worker: Worker): void {
    const state = loadState();
    const idx = state.workers.findIndex((w) => w.id === worker.id);
    if (idx >= 0) {
      state.workers[idx] = worker;
      saveState(state);
    }
  },

  // Shifts
  getShifts(): Shift[] {
    return loadState().shifts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  getWorkerShifts(workerId: string): Shift[] {
    return loadState().shifts
      .filter((s) => s.workerId === workerId)
      .sort((a, b) => new Date(b.clockInTime).getTime() - new Date(a.clockInTime).getTime());
  },

  getActiveShift(workerId: string): Shift | undefined {
    return loadState().shifts.find((s) => s.workerId === workerId && s.status === 'active');
  },

  clockIn(workerId: string, notes?: string): Shift {
    const state = loadState();
    const existing = state.shifts.find((s) => s.workerId === workerId && s.status === 'active');
    if (existing) {
      throw new Error('Worker already has an active shift. Please clock out of current shift first.');
    }
    const worker = state.workers.find((w) => w.id === workerId);
    if (!worker) throw new Error('Worker not found');

    const now = new Date();
    const newShift: Shift = {
      id: `s-${Date.now()}`,
      workerId,
      workerName: worker.name,
      industry: worker.industry,
      date: now.toISOString().slice(0, 10),
      clockInTime: now.toISOString(),
      breakMinutes: 0,
      netHours: 0,
      regularHours: 0,
      overtimeHours: 0,
      status: 'active',
      notes: notes || `${worker.worksite} shift`
    };

    state.shifts.unshift(newShift);
    state.activities.unshift({
      id: `act-${Date.now()}`,
      timestamp: now.toISOString(),
      type: 'shift',
      title: 'Clock In Recorded',
      titleTa: 'வேலை தொடக்கம் பதிவு செய்யப்பட்டது',
      details: `${worker.name} clocked in at ${worker.worksite}.`,
      actor: worker.name,
      actorRole: 'worker'
    });

    saveState(state);
    return newShift;
  },

  clockOut(workerId: string, breakMinutesInput?: number): Shift {
    const state = loadState();
    const shiftIdx = state.shifts.findIndex((s) => s.workerId === workerId && s.status === 'active');
    if (shiftIdx < 0) {
      throw new Error('No active shift found to clock out.');
    }

    const shift = state.shifts[shiftIdx];
    const now = new Date();
    const clockIn = new Date(shift.clockInTime);
    const breakMins = breakMinutesInput !== undefined ? breakMinutesInput : shift.breakMinutes;

    const totalDurationHours = Math.max(0, (now.getTime() - clockIn.getTime()) / 3600000);
    const netWorkingHours = Math.max(0, Math.round((totalDurationHours - (breakMins / 60)) * 100) / 100);

    const OVERTIME_THRESHOLD = 8.0;
    const regularHours = Math.min(netWorkingHours, OVERTIME_THRESHOLD);
    const overtimeHours = Math.max(0, Math.round((netWorkingHours - OVERTIME_THRESHOLD) * 100) / 100);

    const updatedShift: Shift = {
      ...shift,
      clockOutTime: now.toISOString(),
      breakMinutes: breakMins,
      netHours: netWorkingHours,
      regularHours,
      overtimeHours,
      status: 'completed'
    };

    state.shifts[shiftIdx] = updatedShift;
    state.activities.unshift({
      id: `act-${Date.now()}`,
      timestamp: now.toISOString(),
      type: 'shift',
      title: 'Clock Out Recorded',
      titleTa: 'வேலை முடிவு பதிவு செய்யப்பட்டது',
      details: `${shift.workerName} completed shift: ${netWorkingHours} hrs (${overtimeHours} OT hrs).`,
      actor: shift.workerName,
      actorRole: 'worker'
    });

    saveState(state);
    return updatedShift;
  },

  addBreakMinutes(shiftId: string, additionalMinutes: number): void {
    const state = loadState();
    const shift = state.shifts.find((s) => s.id === shiftId);
    if (!shift) return;

    shift.breakMinutes += additionalMinutes;
    if (shift.status === 'completed' && shift.clockOutTime) {
      const inTime = new Date(shift.clockInTime).getTime();
      const outTime = new Date(shift.clockOutTime).getTime();
      const gross = Math.max(0, (outTime - inTime) / 3600000);
      shift.netHours = Math.max(0, Math.round((gross - shift.breakMinutes / 60) * 100) / 100);
      shift.regularHours = Math.min(shift.netHours, 8.0);
      shift.overtimeHours = Math.max(0, Math.round((shift.netHours - 8.0) * 100) / 100);
    }
    saveState(state);
  },

  // Safety Incidents
  getSafetyIncidents(): SafetyIncident[] {
    return loadState().incidents.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
  },

  getSafetyIncidentById(id: string): SafetyIncident | undefined {
    return loadState().incidents.find((inc) => inc.id === id);
  },

  createSafetyIncident(incidentData: {
    reporterWorkerId?: string;
    reporterName?: string;
    isAnonymous: boolean;
    industry: 'construction' | 'facilities';
    category: SafetyIncident['category'];
    severity: SafetyIncident['severity'];
    location: string;
    workArea?: string;
    description: string;
    photoPreviewUrl?: string;
  }): SafetyIncident {
    const state = loadState();
    const count = state.incidents.length + 100;
    const refId = `FS-SAF-2026-${String(count).padStart(3, '0')}`;
    const now = new Date().toISOString();

    const newIncident: SafetyIncident = {
      id: `inc-${Date.now()}`,
      refId,
      reporterWorkerId: incidentData.isAnonymous ? '' : incidentData.reporterWorkerId,
      reporterName: incidentData.isAnonymous ? 'Anonymous Reporter' : incidentData.reporterName,
      isAnonymous: incidentData.isAnonymous,
      industry: incidentData.industry,
      category: incidentData.category,
      severity: incidentData.severity,
      location: incidentData.location,
      workArea: incidentData.workArea,
      description: incidentData.description,
      submittedAt: now,
      status: 'Submitted',
      actionNotes: [],
      photoPreviewUrl: incidentData.photoPreviewUrl
    };

    state.incidents.unshift(newIncident);
    state.activities.unshift({
      id: `act-${Date.now()}`,
      timestamp: now,
      type: 'safety',
      title: `${incidentData.severity} Safety Incident Logged`,
      titleTa: `${incidentData.severity} பாதுகாப்பு புகார் பதிவு செய்யப்பட்டது`,
      details: `${refId} (${incidentData.category}) at ${incidentData.location}.`,
      actor: incidentData.isAnonymous ? 'Anonymous' : (incidentData.reporterName || 'Worker'),
      actorRole: 'worker'
    });

    saveState(state);
    return newIncident;
  },

  updateIncidentStatus(incidentId: string, newStatus: IncidentStatus, assignedOwner?: string): void {
    const state = loadState();
    const inc = state.incidents.find((i) => i.id === incidentId);
    if (!inc) return;

    inc.status = newStatus;
    if (assignedOwner) inc.assignedOwner = assignedOwner;

    state.activities.unshift({
      id: `act-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'safety',
      title: `Incident Status Updated to ${newStatus}`,
      titleTa: `பாதுகாப்பு புகார் நிலை ${newStatus} ஆக மாற்றப்பட்டது`,
      details: `Ref ${inc.refId} updated to ${newStatus}.`,
      actor: assignedOwner || 'Safety Supervisor',
      actorRole: 'admin'
    });

    saveState(state);
  },

  addActionNote(incidentId: string, note: string, author: string): void {
    const state = loadState();
    const inc = state.incidents.find((i) => i.id === incidentId);
    if (!inc) return;

    inc.actionNotes.push({
      id: `an-${Date.now()}`,
      timestamp: new Date().toISOString(),
      author,
      note
    });

    // If status was Submitted, advance to Under Review or Action in Progress
    if (inc.status === 'Submitted') {
      inc.status = 'Action in Progress';
    }

    state.activities.unshift({
      id: `act-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'safety',
      title: 'Action Note Added',
      titleTa: 'நடவடிக்கை குறிப்பு சேர்க்கப்பட்டது',
      details: `Supervisor note added to ${inc.refId}.`,
      actor: author,
      actorRole: 'admin'
    });

    saveState(state);
  },

  resolveIncident(incidentId: string, resolutionNote: string, author: string): void {
    if (!resolutionNote.trim()) {
      throw new Error('A detailed resolution note is required before marking an incident resolved.');
    }
    const state = loadState();
    const inc = state.incidents.find((i) => i.id === incidentId);
    if (!inc) return;

    inc.status = 'Resolved';
    inc.resolutionNote = resolutionNote;
    inc.resolvedAt = new Date().toISOString();

    state.activities.unshift({
      id: `act-${Date.now()}`,
      timestamp: inc.resolvedAt,
      type: 'safety',
      title: 'Incident Resolved & Verified',
      titleTa: 'பாதுகாப்பு புகார் தீர்க்கப்பட்டு சரிபார்க்கப்பட்டது',
      details: `Ref ${inc.refId} resolved by ${author}.`,
      actor: author,
      actorRole: 'admin'
    });

    saveState(state);
  },

  // Shift Corrections
  getCorrectionRequests(): ShiftCorrectionRequest[] {
    return loadState().corrections.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
  },

  createCorrectionRequest(req: {
    workerId: string;
    workerName: string;
    shiftId: string;
    shiftDate: string;
    originalClockIn: string;
    originalClockOut: string;
    proposedClockIn: string;
    proposedClockOut: string;
    reason: string;
  }): ShiftCorrectionRequest {
    const state = loadState();
    const newCorr: ShiftCorrectionRequest = {
      id: `corr-${Date.now()}`,
      ...req,
      status: 'Pending',
      submittedAt: new Date().toISOString()
    };
    state.corrections.unshift(newCorr);

    state.activities.unshift({
      id: `act-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'correction',
      title: 'Shift Correction Requested',
      titleTa: 'ஷிப்ட் திருத்தம் கோரப்பட்டது',
      details: `${req.workerName} requested time correction for shift ${req.shiftDate}.`,
      actor: req.workerName,
      actorRole: 'worker'
    });

    saveState(state);
    return newCorr;
  },

  reviewCorrectionRequest(id: string, status: 'Approved' | 'Rejected', reviewerNote: string): void {
    const state = loadState();
    const corr = state.corrections.find((c) => c.id === id);
    if (!corr) return;

    corr.status = status;
    corr.reviewerNote = reviewerNote;
    corr.reviewedAt = new Date().toISOString();

    if (status === 'Approved') {
      // update the underlying shift
      const shift = state.shifts.find((s) => s.id === corr.shiftId);
      if (shift) {
        shift.clockInTime = corr.proposedClockIn;
        shift.clockOutTime = corr.proposedClockOut;
        const gross = Math.max(0, (new Date(corr.proposedClockOut).getTime() - new Date(corr.proposedClockIn).getTime()) / 3600000);
        shift.netHours = Math.max(0, Math.round((gross - shift.breakMinutes / 60) * 100) / 100);
        shift.regularHours = Math.min(shift.netHours, 8.0);
        shift.overtimeHours = Math.max(0, Math.round((shift.netHours - 8.0) * 100) / 100);
      }
    }

    state.activities.unshift({
      id: `act-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'correction',
      title: `Shift Correction ${status}`,
      titleTa: `ஷிப்ட் திருத்தம் ${status === 'Approved' ? 'ஏற்றுக்கொள்ளப்பட்டது' : 'நிராகரிக்கப்பட்டது'}`,
      details: `Request for ${corr.shiftDate} was ${status.toLowerCase()} by supervisor.`,
      actor: 'Shift Supervisor',
      actorRole: 'admin'
    });

    saveState(state);
  },

  // Skills
  getSkills(workerId?: string): SkillRecord[] {
    const skills = loadState().skills;
    if (workerId) return skills.filter((s) => s.workerId === workerId);
    return skills;
  },

  addSkill(skill: Omit<SkillRecord, 'id'>): SkillRecord {
    const state = loadState();
    const newSkill: SkillRecord = {
      ...skill,
      id: `sk-${Date.now()}`
    };
    state.skills.unshift(newSkill);
    saveState(state);
    return newSkill;
  },

  deleteSkill(id: string): void {
    const state = loadState();
    state.skills = state.skills.filter((s) => s.id !== id);
    saveState(state);
  },

  // Wellbeing
  getWellbeingLogs(workerId?: string): WellbeingCheckIn[] {
    const logs = loadState().wellbeing;
    if (workerId) return logs.filter((l) => l.workerId === workerId).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  },

  createWellbeingCheckIn(data: {
    workerId: string;
    sleepHours: number;
    fatigueScore: 1 | 2 | 3 | 4 | 5;
    workloadFeeling: 'Light' | 'Manageable' | 'Challenging' | 'Overwhelming';
    privateNotes?: string;
  }): WellbeingCheckIn {
    const state = loadState();
    const isConcern = data.sleepHours < 6 || data.fatigueScore >= 4 || data.workloadFeeling === 'Overwhelming';
    let flagReason = '';
    if (data.sleepHours < 6) flagReason += 'Sleep under 6h. ';
    if (data.fatigueScore >= 4) flagReason += 'Self-reported high fatigue (4+/5). ';
    if (data.workloadFeeling === 'Overwhelming') flagReason += 'Workload reported as overwhelming.';

    const newLog: WellbeingCheckIn = {
      id: `wb-${Date.now()}`,
      workerId: data.workerId,
      timestamp: new Date().toISOString(),
      date: new Date().toISOString().slice(0, 10),
      sleepHours: data.sleepHours,
      fatigueScore: data.fatigueScore,
      workloadFeeling: data.workloadFeeling,
      privateNotes: data.privateNotes,
      concernFlagged: isConcern,
      flagReason: flagReason.trim()
    };

    state.wellbeing.unshift(newLog);
    saveState(state);
    return newLog;
  },

  // Shift Swaps
  getShiftSwaps(): ShiftSwapRequest[] {
    return loadState().swaps.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  createShiftSwap(data: {
    requesterWorkerId: string;
    requesterName: string;
    requesterShiftDate: string;
    requesterShiftTime: string;
    industry: 'construction' | 'facilities';
    targetRole: string;
    reason: string;
  }): ShiftSwapRequest {
    const state = loadState();
    const newSwap: ShiftSwapRequest = {
      id: `swap-${Date.now()}`,
      ...data,
      status: 'Open',
      createdAt: new Date().toISOString()
    };
    state.swaps.unshift(newSwap);
    saveState(state);
    return newSwap;
  },

  acceptShiftSwap(swapId: string, acceptorWorkerId: string, acceptorName: string): void {
    const state = loadState();
    const swap = state.swaps.find((s) => s.id === swapId);
    if (!swap) return;
    if (swap.status !== 'Open') {
      throw new Error('This shift swap is no longer open.');
    }
    if (swap.requesterWorkerId === acceptorWorkerId) {
      throw new Error('You cannot accept your own shift swap request.');
    }

    swap.status = 'Accepted';
    swap.acceptedByWorkerId = acceptorWorkerId;
    swap.acceptedByName = acceptorName;
    swap.acceptedAt = new Date().toISOString();

    state.activities.unshift({
      id: `act-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'swap',
      title: 'Shift Swap Accepted',
      titleTa: 'ஷிப்ட் பரிமாற்றம் ஏற்றுக்கொள்ளப்பட்டது',
      details: `${acceptorName} agreed to take shift on ${swap.requesterShiftDate} from ${swap.requesterName}.`,
      actor: acceptorName,
      actorRole: 'worker'
    });

    saveState(state);
  },

  // Activities
  getActivityLogs(): ActivityEvent[] {
    return loadState().activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  },

  // Real Wage Calculation
  calculateWageEstimate(params: {
    workerId: string;
    periodType: 'weekly' | 'monthly';
    rateType: 'hourly' | 'daily';
    baseRate: number;
    regularHours: number;
    overtimeHours: number;
    overtimeMultiplier: number;
    bonuses: number;
    deductions: number;
  }): WageEstimate {
    const regularEarnings = Math.round(params.regularHours * params.baseRate);
    const overtimeEarnings = Math.round(params.overtimeHours * params.baseRate * params.overtimeMultiplier);
    const grossEarnings = regularEarnings + overtimeEarnings + params.bonuses;
    const estimatedTakeHome = Math.max(0, grossEarnings - params.deductions);

    // Calculate actual recorded hours from localStorage shifts for comparison
    const state = loadState();
    const workerShifts = state.shifts.filter((s) => s.workerId === params.workerId);
    
    // Sum hours in past 7 days (if weekly) or past 30 days (if monthly)
    const now = Date.now();
    const daysLimit = params.periodType === 'weekly' ? 7 : 30;
    const periodMs = daysLimit * 86400000;

    const recentShifts = workerShifts.filter((s) => (now - new Date(s.clockInTime).getTime()) <= periodMs);
    const actualRecordedHours = recentShifts.reduce((acc, s) => acc + s.netHours, 0);

    const plannedHours = params.regularHours + params.overtimeHours;
    const discrepancyHours = Math.round((actualRecordedHours - plannedHours) * 10) / 10;

    let discrepancyNotes = 'Estimated hours align with timesheet records.';
    if (Math.abs(discrepancyHours) > 0.5) {
      if (discrepancyHours > 0) {
        discrepancyNotes = `You logged ${actualRecordedHours} hrs on site, which is ${discrepancyHours} hrs more than the input estimate (${plannedHours} hrs). Check for uncounted overtime.`;
      } else {
        discrepancyNotes = `Your input estimate is ${plannedHours} hrs, but only ${actualRecordedHours} hrs are recorded on site timesheets in this period.`;
      }
    }

    return {
      id: `est-${Date.now()}`,
      workerId: params.workerId,
      calculationDate: new Date().toISOString(),
      periodType: params.periodType,
      rateType: params.rateType,
      baseRate: params.baseRate,
      regularHours: params.regularHours,
      overtimeHours: params.overtimeHours,
      overtimeMultiplier: params.overtimeMultiplier,
      bonuses: params.bonuses,
      deductions: params.deductions,
      regularEarnings,
      overtimeEarnings,
      grossEarnings,
      estimatedTakeHome,
      actualRecordedHours,
      discrepancyHours,
      discrepancyNotes
    };
  },

  // Fairness & Action Center Alert Engine
  getFairnessAlerts(): FairnessAlert[] {
    const state = loadState();
    const alerts: FairnessAlert[] = [];
    const now = Date.now();

    // 1. Unresolved critical or high safety incidents awaiting action > 24 hours
    state.incidents.forEach((inc) => {
      const elapsedHours = (now - new Date(inc.submittedAt).getTime()) / 3600000;
      if (inc.status !== 'Resolved' && (inc.severity === 'Critical' || inc.severity === 'High')) {
        if (elapsedHours > 24) {
          alerts.push({
            id: `alert-sec-${inc.id}`,
            type: 'safety_delay',
            severity: inc.severity === 'Critical' ? 'critical' : 'high',
            title: `Safety Hazard Awaiting Resolution (${Math.round(elapsedHours)}h elapsed)`,
            detectedIssue: `Report ${inc.refId} ("${inc.category}") at ${inc.location} has remained ${inc.status.toLowerCase()} for >24 hours.`,
            whyItMatters: 'Unaddressed critical workplace hazards create immediate physical injury liability and violate OSHA/factory safety protocols.',
            relatedRecordId: inc.id,
            recommendedAction: 'Assign an emergency safety contractor, inspect worksite immediately, and provide an action note.',
            targetWorkflow: '/admin/safety'
          });
        }
      }
    });

    // 2. Pending shift correction requests
    state.corrections.filter((c) => c.status === 'Pending').forEach((c) => {
      alerts.push({
        id: `alert-corr-${c.id}`,
        type: 'pending_correction',
        severity: 'medium',
        title: `Pending Shift Correction for ${c.workerName}`,
        detectedIssue: `Worker requested adjustment for ${c.shiftDate} citing: "${c.reason.slice(0, 70)}..."`,
        whyItMatters: 'Unprocessed time corrections directly skew weekly wage calculations and lead to worker distrust.',
        relatedRecordId: c.id,
        relatedWorkerName: c.workerName,
        recommendedAction: 'Compare biometric log / site supervisor muster roll and approve or reject with written reason.',
        targetWorkflow: '/admin/workers'
      });
    });

    // 3. Repeated long shifts (> 9.5 hours)
    state.shifts.filter((s) => s.status === 'completed' && s.netHours >= 9.5).forEach((s) => {
      alerts.push({
        id: `alert-shift-${s.id}`,
        type: 'overtime_fatigue',
        severity: s.netHours >= 10.5 ? 'high' : 'medium',
        title: `Extended Shift (${s.netHours} hrs) — Fatigue Warning`,
        detectedIssue: `${s.workerName} worked ${s.netHours} continuous hours on ${s.date} (${s.overtimeHours} hrs overtime).`,
        whyItMatters: 'Prolonged physical shifts in masonry and heavy machinery elevate accident probability by over 38%.',
        relatedRecordId: s.id,
        relatedWorkerName: s.workerName,
        recommendedAction: 'Review supervisor scheduling to prevent back-to-back double shifts and verify rest intervals.',
        targetWorkflow: '/admin/attendance'
      });
    });

    // 4. Certifications expiring within 30 days
    state.skills.filter((sk) => sk.expiryDate).forEach((sk) => {
      const daysUntilExpiry = (new Date(sk.expiryDate!).getTime() - now) / 86400000;
      if (daysUntilExpiry > 0 && daysUntilExpiry <= 30) {
        const worker = state.workers.find((w) => w.id === sk.workerId);
        alerts.push({
          id: `alert-skill-${sk.id}`,
          type: 'cert_expiring',
          severity: 'medium',
          title: `Certification Expiring in ${Math.ceil(daysUntilExpiry)} Days`,
          detectedIssue: `${worker?.name || 'Worker'}'s "${sk.certificationName}" expires on ${sk.expiryDate}.`,
          whyItMatters: 'Lapsed height safety and electrical licenses disqualify personnel from active site works under regulatory audits.',
          relatedRecordId: sk.id,
          relatedWorkerName: worker?.name,
          recommendedAction: 'Schedule renewal training or recertification assessment.',
          targetWorkflow: '/admin/workers'
        });
      }
    });

    return alerts;
  }
};
