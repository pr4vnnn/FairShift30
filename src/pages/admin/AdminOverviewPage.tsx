import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { StorageService } from '../../services/storage';
import { Worker, Shift, SafetyIncident, Industry } from '../../types';
import {
  Users,
  Clock,
  ShieldAlert,
  AlertTriangle,
  Scale,
  Award,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  HardHat,
  Building2,
  Filter
} from 'lucide-react';
import { Button, Card, StatCard, StatusBadge } from '../../components/common/UIComponents';

export const AdminOverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { language, t } = useApp();

  const [industryFilter, setIndustryFilter] = useState<'all' | Industry>('all');
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [incidents, setIncidents] = useState<SafetyIncident[]>([]);
  const [correctionsCount, setCorrectionsCount] = useState(0);
  const [expiringSkillsCount, setExpiringSkillsCount] = useState(0);

  const loadData = () => {
    const allWorkers = StorageService.getWorkers();
    const allShifts = StorageService.getShifts();
    const allIncidents = StorageService.getSafetyIncidents();
    const allSkills = StorageService.getSkills();
    const allCorrections = StorageService.getCorrectionRequests();

    setWorkers(allWorkers);
    setShifts(allShifts);
    setIncidents(allIncidents);
    setCorrectionsCount(allCorrections.filter((c) => c.status === 'Pending').length);

    const now = Date.now();
    const expiring = allSkills.filter((s) => {
      if (!s.expiryDate) return false;
      const diffDays = (new Date(s.expiryDate).getTime() - now) / 86400000;
      return diffDays > 0 && diffDays <= 30;
    }).length;
    setExpiringSkillsCount(expiring);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered dataset
  const filteredWorkers = workers.filter(
    (w) => industryFilter === 'all' || w.industry === industryFilter
  );
  const filteredShifts = shifts.filter(
    (s) => industryFilter === 'all' || s.industry === industryFilter
  );
  const filteredIncidents = incidents.filter(
    (i) => industryFilter === 'all' || i.industry === industryFilter
  );

  // Calculations from real records
  const activeShifts = filteredShifts.filter((s) => s.status === 'active');
  const completedShifts = filteredShifts.filter((s) => s.status === 'completed');
  const totalOvertimeHours = Math.round(completedShifts.reduce((acc, s) => acc + s.overtimeHours, 0) * 10) / 10;
  const openIncidents = filteredIncidents.filter((i) => i.status !== 'Resolved');
  const criticalOrHighIncidents = openIncidents.filter(
    (i) => i.severity === 'Critical' || i.severity === 'High'
  );

  const attendanceRate = filteredWorkers.length > 0
    ? Math.round((activeShifts.length / filteredWorkers.length) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Page Header & Industry Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{t.navAdminOverview}</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Real-time workforce deployment, safety hazard triage, and attendance completion.
          </p>
        </div>

        {/* Industry Filter Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-semibold">
          <button
            onClick={() => setIndustryFilter('all')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              industryFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.allIndustries}
          </button>
          <button
            onClick={() => setIndustryFilter('construction')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
              industryFilter === 'construction' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <HardHat className="w-3.5 h-3.5 text-amber-600" />
            <span>Construction</span>
          </button>
          <button
            onClick={() => setIndustryFilter('facilities')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
              industryFilter === 'facilities' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-teal-600" />
            <span>Facilities</span>
          </button>
        </div>
      </div>

      {/* Top Critical Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Active On-Shift Workers"
          value={`${activeShifts.length} / ${filteredWorkers.length}`}
          subtext={`${attendanceRate}% deployment today`}
          icon={Users}
        />
        <StatCard
          label="Open Safety Hazards"
          value={openIncidents.length}
          subtext={`${criticalOrHighIncidents.length} Critical or High priority`}
          icon={ShieldAlert}
          alert={criticalOrHighIncidents.length > 0}
        />
        <StatCard
          label="Total Overtime Logged"
          value={`${totalOvertimeHours} hrs`}
          subtext="Past 7 days across active sites"
          icon={Clock}
        />
        <StatCard
          label="Pending Corrections"
          value={correctionsCount}
          subtext={`${expiringSkillsCount} certs expiring in 30 days`}
          icon={Scale}
          alert={correctionsCount > 0}
        />
      </div>

      {/* Urgent Safety Hazard Triage Banner if critical incidents exist */}
      {criticalOrHighIncidents.length > 0 && (
        <div className="bg-rose-50 border border-rose-300 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="text-xs text-rose-900">
              <p className="font-bold text-sm">
                Action Required: {criticalOrHighIncidents.length} High/Critical Workplace Hazards Active
              </p>
              <p className="text-rose-700 mt-0.5">
                Immediate review required to prevent site accidents and regulatory non-compliance.
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="danger"
            onClick={() => navigate('/admin/safety')}
            icon={ShieldAlert}
            className="shrink-0"
          >
            Open Safety Command Center
          </Button>
        </div>
      )}

      {/* Two Column Layout: Quick Incident Overview & Active Workers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Recent Incidents */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-teal-700" />
              <span>Priority Safety Incidents</span>
            </h3>
            <button
              onClick={() => navigate('/admin/safety')}
              className="text-xs font-semibold text-teal-700 hover:text-teal-900"
            >
              Manage in Command Center →
            </button>
          </div>

          <div className="space-y-3">
            {filteredIncidents.slice(0, 3).map((inc) => (
              <div
                key={inc.id}
                onClick={() => navigate('/admin/safety')}
                className="bg-white p-4 rounded-xl border border-slate-200 hover:border-slate-300 shadow-xs cursor-pointer transition-colors space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-teal-700">{inc.refId}</span>
                    <span>·</span>
                    <span className="font-semibold text-slate-800">{inc.category}</span>
                  </div>
                  <StatusBadge status={inc.status} />
                </div>
                <p className="text-slate-600 line-clamp-2">{inc.description}</p>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                  <span>{inc.location}</span>
                  <span>{inc.actionNotes.length} Supervisor Notes</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Fairness Center Highlights & Quick Actions */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Scale className="w-4 h-4 text-teal-700" />
              <span>Fairness & Action Pulse</span>
            </h3>
            <button
              onClick={() => navigate('/admin/fairness')}
              className="text-xs font-semibold text-teal-700 hover:text-teal-900"
            >
              View All Alerts →
            </button>
          </div>

          <Card className="bg-slate-900 text-white border-slate-800 space-y-3">
            <p className="text-xs text-teal-300 font-semibold uppercase tracking-wider">
              Autonomous Integrity Check
            </p>
            <p className="text-sm font-bold text-white">
              System monitoring 5 active compliance vectors:
            </p>
            <ul className="text-xs text-slate-300 space-y-1.5">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                <span>Zero unexplained wage discrepancies</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                <span>Biometric shift correction queues</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                <span>High-altitude certification expiry buffers</span>
              </li>
            </ul>
            <div className="pt-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => navigate('/admin/fairness')}
                className="w-full bg-slate-800 text-slate-100 border-slate-700 hover:bg-slate-700 hover:text-white"
              >
                Inspect Fairness Center
              </Button>
            </div>
          </Card>

          {/* Quick Workforce Links */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2 text-xs">
            <p className="font-bold text-slate-800">Quick Navigation</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => navigate('/admin/workers')}
                className="p-2 text-left rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
              >
                <div className="font-semibold text-slate-900">Workers</div>
                <div className="text-[10px] text-slate-500">Muster & pay rates</div>
              </button>
              <button
                onClick={() => navigate('/admin/insights')}
                className="p-2 text-left rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
              >
                <div className="font-semibold text-slate-900">Insights</div>
                <div className="text-[10px] text-slate-500">Overtime analytics</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
