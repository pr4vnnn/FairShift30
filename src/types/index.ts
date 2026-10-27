/**
 * FairShift 360 - Type Definitions
 * Aligned with UN SDG 8: Decent Work and Economic Growth
 */

export type Industry = 'construction' | 'facilities';

export type RoleType = 'worker' | 'admin';

export type Language = 'en' | 'ta';

export interface Worker {
  id: string;
  name: string;
  nameTa: string;
  role: string;
  roleTa: string;
  industry: Industry;
  worksite: string;
  worksiteTa: string;
  department: string;
  rateType: 'hourly' | 'daily';
  hourlyRate: number; // in INR ₹
  dailyRate: number;  // in INR ₹
  phone: string;
  emergencyContact: string;
  avatarUrl?: string;
  joinedDate: string;
  active: boolean;
}

export interface Shift {
  id: string;
  workerId: string;
  workerName: string;
  industry: Industry;
  date: string; // YYYY-MM-DD
  clockInTime: string; // ISO string
  clockOutTime?: string; // ISO string, optional if active
  breakMinutes: number;
  netHours: number;
  regularHours: number;
  overtimeHours: number;
  status: 'active' | 'completed';
  isMissingClockOut?: boolean;
  notes?: string;
}

export interface WageEstimate {
  id: string;
  workerId: string;
  calculationDate: string;
  periodType: 'weekly' | 'monthly';
  rateType: 'hourly' | 'daily';
  baseRate: number;
  regularHours: number;
  overtimeHours: number;
  overtimeMultiplier: number; // e.g. 1.5
  bonuses: number;
  deductions: number;
  regularEarnings: number;
  overtimeEarnings: number;
  grossEarnings: number;
  estimatedTakeHome: number;
  actualRecordedHours?: number;
  discrepancyHours?: number;
  discrepancyNotes?: string;
}

export type IncidentCategory = 
  | 'Equipment' 
  | 'Electrical' 
  | 'Fire' 
  | 'Chemicals' 
  | 'Working at Height' 
  | 'Harassment' 
  | 'Fatigue' 
  | 'Other';

export type IncidentSeverity = 'Low' | 'Medium' | 'High' | 'Critical';

export type IncidentStatus = 'Submitted' | 'Under Review' | 'Action in Progress' | 'Resolved';

export interface IncidentActionNote {
  id: string;
  timestamp: string;
  author: string;
  note: string;
}

export interface SafetyIncident {
  id: string;
  refId: string; // e.g. FS-SAF-2026-101
  reporterWorkerId?: string; // empty if anonymous-display
  reporterName?: string;     // empty or "Anonymous Reporter" if anonymous
  isAnonymous: boolean;
  industry: Industry;
  category: IncidentCategory;
  severity: IncidentSeverity;
  location: string;
  workArea?: string;
  description: string;
  submittedAt: string;
  status: IncidentStatus;
  assignedOwner?: string;
  actionNotes: IncidentActionNote[];
  resolutionNote?: string;
  resolvedAt?: string;
  photoPreviewUrl?: string;
}

export interface ShiftCorrectionRequest {
  id: string;
  workerId: string;
  workerName: string;
  shiftId: string;
  shiftDate: string;
  originalClockIn: string;
  originalClockOut: string;
  proposedClockIn: string;
  proposedClockOut: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  submittedAt: string;
  reviewerNote?: string;
  reviewedAt?: string;
}

export interface SkillRecord {
  id: string;
  workerId: string;
  skillName: string;
  skillNameTa?: string;
  category: string;
  confidenceLevel: 1 | 2 | 3 | 4 | 5;
  certificationName?: string;
  issuedDate?: string;
  expiryDate?: string;
  isEmployerVerified: boolean;
  taskCompetency: string;
}

export interface WellbeingCheckIn {
  id: string;
  workerId: string;
  timestamp: string;
  date: string;
  sleepHours: number;
  fatigueScore: 1 | 2 | 3 | 4 | 5; // 1 = fully rested, 5 = severe exhaustion
  workloadFeeling: 'Light' | 'Manageable' | 'Challenging' | 'Overwhelming';
  privateNotes?: string;
  concernFlagged: boolean;
  flagReason?: string;
}

export interface ShiftSwapRequest {
  id: string;
  requesterWorkerId: string;
  requesterName: string;
  requesterShiftDate: string;
  requesterShiftTime: string;
  industry: Industry;
  targetRole: string;
  reason: string;
  status: 'Open' | 'Accepted' | 'Cancelled';
  acceptedByWorkerId?: string;
  acceptedByName?: string;
  acceptedAt?: string;
  createdAt: string;
}

export interface ActivityEvent {
  id: string;
  timestamp: string;
  type: 'shift' | 'safety' | 'wage' | 'skill' | 'wellbeing' | 'swap' | 'correction';
  title: string;
  titleTa?: string;
  details: string;
  actor: string;
  actorRole: RoleType;
}

export interface FairnessAlert {
  id: string;
  type: 'safety_delay' | 'wage_discrepancy' | 'overtime_fatigue' | 'pending_correction' | 'cert_expiring';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  detectedIssue: string;
  whyItMatters: string;
  relatedRecordId: string;
  relatedWorkerName?: string;
  recommendedAction: string;
  targetWorkflow: string; // router path or tab
}
