import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { StorageService } from '../../services/storage';
import {
  Clock,
  Calculator,
  ShieldAlert,
  HeartPulse,
  TrendingUp,
  AlertTriangle,
  Play,
  Square,
  Coffee,
  CheckCircle2,
  ArrowRight,
  HardHat,
  Award,
  ChevronRight
} from 'lucide-react';
import { Button, Card, StatCard, StatusBadge } from '../../components/common/UIComponents';

export const WorkerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { currentWorker, language, t, showToast } = useApp();

  const [activeShift, setActiveShift] = useState(StorageService.getActiveShift(currentWorker.id));
  const [shifts, setShifts] = useState(StorageService.getWorkerShifts(currentWorker.id));
  const [incidents, setIncidents] = useState(StorageService.getSafetyIncidents());
  const [recentActivities, setRecentActivities] = useState(StorageService.getActivityLogs());
  const [breakNotes, setBreakNotes] = useState('');
  const [now, setNow] = useState(new Date());

  // Real-time ticker for shift duration
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const refreshDashboardData = () => {
    setActiveShift(StorageService.getActiveShift(currentWorker.id));
    setShifts(StorageService.getWorkerShifts(currentWorker.id));
    setIncidents(StorageService.getSafetyIncidents());
    setRecentActivities(StorageService.getActivityLogs());
  };

  useEffect(() => {
    refreshDashboardData();
  }, [currentWorker.id]);

  const handleClockIn = () => {
    try {
      StorageService.clockIn(currentWorker.id);
      refreshDashboardData();
      showToast(`${t.clockIn} recorded successfully`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Clock in failed', 'error');
    }
  };

  const handleClockOut = () => {
    try {
      StorageService.clockOut(currentWorker.id);
      refreshDashboardData();
      showToast(`${t.clockOut} recorded successfully`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Clock out failed', 'error');
    }
  };

  const handleAddBreak = (mins: number) => {
    if (!activeShift) return;
    StorageService.addBreakMinutes(activeShift.id, mins);
    refreshDashboardData();
    showToast(`Added ${mins} minutes break`, 'info');
  };

  // Metrics calculation
  const completedShifts = shifts.filter((s) => s.status === 'completed');
  const past7DaysShifts = completedShifts.filter((s) => {
    const shiftDate = new Date(s.clockInTime).getTime();
    return Date.now() - shiftDate <= 7 * 86400000;
  });

  const weeklyHours = past7DaysShifts.reduce((acc, s) => acc + s.netHours, 0);
  const weeklyOT = past7DaysShifts.reduce((acc, s) => acc + s.overtimeHours, 0);
  const estimatedWeeklyPay = Math.round(
    (weeklyHours - weeklyOT) * currentWorker.hourlyRate +
    weeklyOT * currentWorker.hourlyRate * 1.5
  );

  const openIncidents = incidents.filter(
    (i) => i.status !== 'Resolved' && (!i.isAnonymous && i.reporterWorkerId === currentWorker.id)
  );

  // Active shift live elapsed time
  let activeElapsedFormatted = '00:00:00';
  let activeElapsedHours = 0;
  if (activeShift) {
    const inMs = new Date(activeShift.clockInTime).getTime();
    const diffMs = Math.max(0, now.getTime() - inMs);
    const hrs = Math.floor(diffMs / 3600000);
    const mins = Math.floor((diffMs % 3600000) / 60000);
    const secs = Math.floor((diffMs % 60000) / 1000);
    activeElapsedFormatted = `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    activeElapsedHours = Math.round((diffMs / 3600000 - activeShift.breakMinutes / 60) * 10) / 10;
  }

  return (
    <div className="space-y-6">
      {/* Top Welcome Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span>{currentWorker.department}</span>
            <span>·</span>
            <span>{language === 'ta' ? currentWorker.worksiteTa : currentWorker.worksite}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            {language === 'ta' ? `வணக்கம், ${currentWorker.nameTa}!` : `Welcome back, ${currentWorker.name}!`}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {language === 'ta' ? currentWorker.roleTa : currentWorker.role} · Base Rate: ₹{currentWorker.hourlyRate}/hr
          </p>
        </div>

        {/* Quick Wellbeing Check CTA if not completed today */}
        <div className="shrink-0 flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/worker/wellbeing')}
            icon={HeartPulse}
          >
            {t.startCheckIn}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/worker/clearpay')}
            icon={Calculator}
          >
            {t.navClearPay}
          </Button>
        </div>
      </div>

      {/* Primary Action Card: Shift Status & Clock */}
      <div className="bg-slate-900 text-white rounded-xl p-6 shadow-md border border-slate-800">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                  activeShift ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'
                }`}
              />
              <span className="text-xs uppercase font-semibold tracking-wider text-slate-300">
                {activeShift ? t.onShift : t.offShift}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tabular-nums tracking-tight">
              {activeShift ? activeElapsedFormatted : '00:00:00'}
            </h2>

            <p className="text-xs text-slate-400">
              {activeShift
                ? `Clocked in at ${new Date(activeShift.clockInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · Break logged: ${activeShift.breakMinutes}m`
                : 'Ready to record today\'s work shift? Timestamps are saved automatically to your device.'}
            </p>

            {/* Quick Break Buttons if on shift */}
            {activeShift && (
              <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
                <span className="text-slate-400 flex items-center gap-1">
                  <Coffee className="w-3.5 h-3.5" />
                  <span>Log Break:</span>
                </span>
                <button
                  onClick={() => handleAddBreak(15)}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 transition-colors"
                >
                  +15 mins
                </button>
                <button
                  onClick={() => handleAddBreak(30)}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 transition-colors"
                >
                  +30 mins
                </button>
                <button
                  onClick={() => handleAddBreak(45)}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 transition-colors"
                >
                  +45 mins
                </button>
              </div>
            )}
          </div>

          <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col items-stretch justify-center gap-3">
            {activeShift ? (
              <Button
                variant="danger"
                size="lg"
                icon={Square}
                onClick={handleClockOut}
                className="w-full font-bold shadow-md shadow-rose-900/30"
              >
                {t.clockOut}
              </Button>
            ) : (
              <Button
                variant="primary"
                size="lg"
                icon={Play}
                onClick={handleClockIn}
                className="w-full font-bold bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-md shadow-teal-500/20"
              >
                {t.clockIn}
              </Button>
            )}

            <Button
              variant="secondary"
              size="sm"
              icon={ShieldAlert}
              onClick={() => navigate('/worker/safevoice')}
              className="w-full bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700 hover:text-white"
            >
              Report Workplace Hazard (SafeVoice)
            </Button>
          </div>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Past 7 Days Hours"
          value={`${weeklyHours} hrs`}
          subtext={`Includes ${weeklyOT} hrs overtime`}
          icon={Clock}
        />
        <StatCard
          label="Estimated 7-Day Pay"
          value={`₹${estimatedWeeklyPay.toLocaleString('en-IN')}`}
          subtext="Base + 1.5× OT rate"
          icon={Calculator}
        />
        <StatCard
          label="Open Safety Reports"
          value={openIncidents.length}
          subtext={openIncidents.length > 0 ? 'Under supervisor review' : 'No pending reports'}
          icon={ShieldAlert}
          alert={openIncidents.length > 0}
        />
        <StatCard
          label="Active Skill Certs"
          value="2 Verified"
          subtext="1 Expiring within 30 days"
          icon={Award}
        />
      </div>

      {/* Middle Grid: Open Incidents & Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Open Safety Incident Tracking */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-teal-700" />
              <span>My Active Safety Reports</span>
            </h3>
            <button
              onClick={() => navigate('/worker/safevoice')}
              className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {openIncidents.length === 0 ? (
            <Card className="text-center py-8">
              <CheckCircle2 className="w-8 h-8 text-teal-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-800">No Open Safety Hazards</p>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                All previously submitted reports have been investigated and closed by the safety committee.
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {openIncidents.map((inc) => (
                <div
                  key={inc.id}
                  onClick={() => navigate('/worker/safevoice')}
                  className="bg-white p-4 rounded-xl border border-slate-200 hover:border-slate-300 shadow-xs cursor-pointer transition-colors space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-mono font-bold text-teal-700">{inc.refId}</span>
                      <span>·</span>
                      <span className="text-slate-500">{inc.category}</span>
                    </div>
                    <StatusBadge status={inc.status} />
                  </div>

                  <p className="text-xs font-medium text-slate-800 line-clamp-2">
                    {inc.description}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                    <span>{inc.location}</span>
                    <span>{inc.actionNotes.length} Supervisor Notes</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Work Modules & Tools */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-base font-bold text-slate-900">Workforce Shortcuts</h3>
          
          <div className="space-y-2">
            <button
              onClick={() => navigate('/worker/clearpay')}
              className="w-full bg-white p-4 rounded-xl border border-slate-200 hover:border-teal-300 text-left flex items-center justify-between group transition-colors shadow-xs"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-teal-50 text-teal-700 group-hover:bg-teal-100 transition-colors">
                  <Calculator className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">ClearPay Calculator</p>
                  <p className="text-xs text-slate-500">Estimate overtime and verify take-home pay</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700" />
            </button>

            <button
              onClick={() => navigate('/worker/skills')}
              className="w-full bg-white p-4 rounded-xl border border-slate-200 hover:border-teal-300 text-left flex items-center justify-between group transition-colors shadow-xs"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-teal-50 text-teal-700 group-hover:bg-teal-100 transition-colors">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Skill Passport</p>
                  <p className="text-xs text-slate-500">View OSHA & height rigging certifications</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700" />
            </button>

            <button
              onClick={() => navigate('/worker/swap')}
              className="w-full bg-white p-4 rounded-xl border border-slate-200 hover:border-teal-300 text-left flex items-center justify-between group transition-colors shadow-xs"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-teal-50 text-teal-700 group-hover:bg-teal-100 transition-colors">
                  <HardHat className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">ShiftSwap Board</p>
                  <p className="text-xs text-slate-500">Request or cover colleague shifts</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
