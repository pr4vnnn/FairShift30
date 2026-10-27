import React, { useState, useEffect } from 'react';
import { StorageService } from '../../services/storage';
import { Shift, SafetyIncident, Worker } from '../../types';
import {
  BarChart3,
  TrendingUp,
  Clock,
  ShieldAlert,
  Users,
  Award,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { Card, StatCard } from '../../components/common/UIComponents';

export const WorkforceInsightsPage: React.FC = () => {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [incidents, setIncidents] = useState<SafetyIncident[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);

  useEffect(() => {
    setShifts(StorageService.getShifts());
    setIncidents(StorageService.getSafetyIncidents());
    setWorkers(StorageService.getWorkers());
  }, []);

  // Category breakdown for safety incidents
  const incidentCategories = incidents.reduce((acc, inc) => {
    acc[inc.category] = (acc[inc.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Overtime distribution by worker
  const workerHours = workers.map((w) => {
    const wShifts = shifts.filter((s) => s.workerId === w.id);
    const regHours = Math.round(wShifts.reduce((acc, s) => acc + s.regularHours, 0) * 10) / 10;
    const otHours = Math.round(wShifts.reduce((acc, s) => acc + s.overtimeHours, 0) * 10) / 10;
    const total = regHours + otHours;
    return {
      worker: w,
      regHours,
      otHours,
      total
    };
  });

  const totalShiftsLogged = shifts.length;
  const totalCompletedHours = Math.round(shifts.reduce((acc, s) => acc + s.netHours, 0) * 10) / 10;
  const totalOvertime = Math.round(shifts.reduce((acc, s) => acc + s.overtimeHours, 0) * 10) / 10;
  const resolvedCount = incidents.filter((i) => i.status === 'Resolved').length;
  const resolutionRate = incidents.length > 0 ? Math.round((resolvedCount / incidents.length) * 100) : 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Workforce Analytics & Safety Metrics</h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Grounded metrics computed dynamically from active shift timesheets and verified safety logs.
        </p>
      </div>

      {/* Aggregate KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Net Hours Logged"
          value={`${totalCompletedHours} hrs`}
          subtext={`Across ${totalShiftsLogged} total recorded shifts`}
          icon={Clock}
        />
        <StatCard
          label="Cumulative Overtime"
          value={`${totalOvertime} hrs`}
          subtext="1.5× rate statutory obligation"
          icon={TrendingUp}
        />
        <StatCard
          label="Hazard Resolution Rate"
          value={`${resolutionRate}%`}
          subtext={`${resolvedCount} of ${incidents.length} closed`}
          icon={ShieldAlert}
        />
        <StatCard
          label="Active Site Workers"
          value={workers.length}
          subtext="Construction & Facilities teams"
          icon={Users}
        />
      </div>

      {/* Two Column Visual Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Overtime & Hours per Worker */}
        <div className="lg:col-span-7 space-y-4">
          <Card>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-teal-700" />
                <span>Working Hours Distribution by Personnel</span>
              </h3>
              <span className="text-[11px] text-slate-500 font-mono">Regular vs Overtime</span>
            </div>

            <div className="space-y-4 mt-4 text-xs">
              {workerHours.map(({ worker, regHours, otHours, total }) => {
                const maxBar = 40; // reference width scale
                const regPct = Math.min(100, (regHours / maxBar) * 100);
                const otPct = Math.min(100, (otHours / maxBar) * 100);

                return (
                  <div key={worker.id} className="space-y-1">
                    <div className="flex justify-between font-semibold text-slate-800">
                      <span>{worker.name} ({worker.role.slice(0, 24)}...)</span>
                      <span className="font-mono tabular-nums">{total} hrs ({otHours}h OT)</span>
                    </div>

                    <div className="h-4 w-full bg-slate-100 rounded-md overflow-hidden flex">
                      <div
                        style={{ width: `${regPct}%` }}
                        className="bg-teal-700 h-full"
                        title={`Regular Hours: ${regHours}h`}
                      />
                      <div
                        style={{ width: `${otPct}%` }}
                        className="bg-amber-500 h-full"
                        title={`Overtime Hours: ${otHours}h`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-6 text-[11px] text-slate-500">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-teal-700 rounded-xs" />
                <span>Regular Shift Hours (&le; 8h/day)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-amber-500 rounded-xs" />
                <span>Overtime Shift Hours (&gt; 8h/day)</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Hazard Category Breakdown */}
        <div className="lg:col-span-5 space-y-4">
          <Card>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-700" />
                <span>Reported Hazard Categories</span>
              </h3>
              <span className="text-[11px] text-slate-500 font-mono">Live Count</span>
            </div>

            <div className="space-y-3 mt-4 text-xs">
              {Object.entries(incidentCategories).map(([cat, count]) => {
                const pct = Math.round((count / incidents.length) * 100);

                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex justify-between font-medium text-slate-700">
                      <span>{cat}</span>
                      <span className="font-mono font-bold text-slate-900">{count} ({pct}%)</span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${pct}%` }}
                        className="h-full bg-rose-600 rounded-full"
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="text-[11px] text-slate-500 mt-4 pt-3 border-t border-slate-100 italic">
              Working at Height and Electrical hazards remain the highest reported risks across active job sites.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};
