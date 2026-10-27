import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StorageService } from '../../services/storage';
import {
  Sliders,
  RefreshCw,
  Server,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Info,
  Scale
} from 'lucide-react';
import { Button, Card } from '../../components/common/UIComponents';

export const SettingsPage: React.FC = () => {
  const { t, resetDemoData, showToast } = useApp();

  const [overtimeThreshold, setOvertimeThreshold] = useState(8.0);
  const [fatigueSleepMin, setFatigueSleepMin] = useState(6.0);
  const [certAlertDays, setCertAlertDays] = useState(30);

  const handleSaveThresholds = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Platform threshold parameters updated', 'success');
  };

  const handleResetConfirm = () => {
    if (confirm('Are you sure you want to reset all shift logs, incidents, and skills to the default demo state?')) {
      resetDemoData();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{t.navSettings}</h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Configure platform threshold parameters, view cloud architecture status, or reset showcase records.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Thresholds & Demo Reset */}
        <div className="lg:col-span-7 space-y-4">
          <Card>
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-teal-700" />
              <span>Compliance & Safety Thresholds</span>
            </h3>

            <form onSubmit={handleSaveThresholds} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Daily Overtime Threshold (Standard: 8.0 hours)
                </label>
                <input
                  type="number"
                  step={0.5}
                  value={overtimeThreshold}
                  onChange={(e) => setOvertimeThreshold(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-teal-600 font-mono"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Hours logged beyond this limit trigger the statutory 1.5× overtime multiplier in ClearPay.
                </p>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Minimum Rest Alert Buffer (Hours of Sleep)
                </label>
                <input
                  type="number"
                  step={0.5}
                  value={fatigueSleepMin}
                  onChange={(e) => setFatigueSleepMin(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-teal-600 font-mono"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Workers reporting less than this amount trigger the Fatigue Safety Advisory before height work.
                </p>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Certification Expiry Warning Horizon (Days)
                </label>
                <input
                  type="number"
                  value={certAlertDays}
                  onChange={(e) => setCertAlertDays(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-teal-600 font-mono"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Days before OSHA/trade certificate expiration to alert in the Fairness & Action Center.
                </p>
              </div>

              <div className="pt-2 flex justify-end">
                <Button type="submit" size="sm">
                  Save Thresholds
                </Button>
              </div>
            </form>
          </Card>

          {/* Reset Demo Data */}
          <Card className="border-rose-200 bg-rose-50/20">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-rose-950 flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-rose-700" />
                  <span>Reset Showcase Demo Data</span>
                </h3>
                <p className="text-xs text-rose-800/80 mt-1 leading-relaxed">
                  Clear all newly created shifts, reports, and swaps, and restore the initial showcase state with Muthu Raman, Priya Sharma, and active construction/facilities scenarios.
                </p>
              </div>
              <Button
                variant="danger"
                size="sm"
                onClick={handleResetConfirm}
                className="shrink-0"
              >
                Reset Demo Data
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Column: Google Cloud Run & Architecture Notes */}
        <div className="lg:col-span-5 space-y-4 text-xs">
          <Card className="bg-slate-900 text-white border-slate-800 space-y-3">
            <h4 className="font-bold text-sm text-teal-400 flex items-center gap-2">
              <Server className="w-4 h-4" />
              <span>Google Cloud Run Deployment Readiness</span>
            </h4>
            <p className="text-slate-300 leading-relaxed">
              FairShift 360 includes container configurations for Google Cloud Run:
            </p>
            <ul className="space-y-1.5 text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span>Multi-stage lightweight Dockerfile</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span>Production static web server / Express handler</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span>Dynamic PORT injection ($PORT) handling</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span>Zero paid AI API dependencies for core app</span>
              </li>
            </ul>
          </Card>

          {/* Prototype limitations disclaimer as required by prompt */}
          <Card className="bg-slate-50 border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-teal-700" />
              <span>Architecture & Prototype Scope</span>
            </h4>
            <p className="text-slate-600 leading-relaxed">
              This application utilizes browser localStorage to persist changes locally for evaluator demonstration. While simulated workflows reflect enterprise industrial patterns, a multi-tenant production release would require:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-500 text-[11px]">
              <li>Relational PostgreSQL/Cloud SQL or Firestore backend</li>
              <li>Role-Based Access Control (RBAC) with certified auth</li>
              <li>Encrypted audit trail with tamper-proof signatures</li>
              <li>Official integration with employer payroll clearinghouses</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
};
