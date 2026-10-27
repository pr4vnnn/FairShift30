import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { StorageService } from '../../services/storage';
import {
  Calculator,
  Printer,
  HelpCircle,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  FileSpreadsheet,
  ArrowRight,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { Button, Card, StatCard } from '../../components/common/UIComponents';

export const ClearPayPage: React.FC = () => {
  const { currentWorker, language, t, showToast } = useApp();

  // Mode: weekly or monthly
  const [periodType, setPeriodType] = useState<'weekly' | 'monthly'>('weekly');
  const [rateType, setRateType] = useState<'hourly' | 'daily'>('hourly');

  // Configurable inputs
  const [baseRate, setBaseRate] = useState<number>(currentWorker.hourlyRate || 240);
  const [regularHours, setRegularHours] = useState<number>(periodType === 'weekly' ? 40 : 160);
  const [overtimeHours, setOvertimeHours] = useState<number>(periodType === 'weekly' ? 4.5 : 18);
  const [overtimeMultiplier, setOvertimeMultiplier] = useState<number>(1.5);
  const [bonuses, setBonuses] = useState<number>(800); // site allowance / attendance
  const [deductions, setDeductions] = useState<number>(450); // canteen / uniform / safety fund

  // Sync when toggling weekly vs monthly
  const handlePeriodChange = (newPeriod: 'weekly' | 'monthly') => {
    setPeriodType(newPeriod);
    if (newPeriod === 'weekly') {
      setRegularHours(40);
      setOvertimeHours(4.5);
      setBonuses(800);
      setDeductions(450);
    } else {
      setRegularHours(160);
      setOvertimeHours(18);
      setBonuses(3200);
      setDeductions(1800);
    }
  };

  // Perform calculation via StorageService real formula logic
  const calculation = useMemo(() => {
    return StorageService.calculateWageEstimate({
      workerId: currentWorker.id,
      periodType,
      rateType,
      baseRate,
      regularHours: Number(regularHours) || 0,
      overtimeHours: Number(overtimeHours) || 0,
      overtimeMultiplier: Number(overtimeMultiplier) || 1.5,
      bonuses: Number(bonuses) || 0,
      deductions: Number(deductions) || 0
    });
  }, [
    currentWorker.id,
    periodType,
    rateType,
    baseRate,
    regularHours,
    overtimeHours,
    overtimeMultiplier,
    bonuses,
    deductions
  ]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{t.clearPayTitle}</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {t.clearPaySubtitle}
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          icon={Printer}
          onClick={handlePrint}
          className="no-print"
        >
          {t.exportPayslip}
        </Button>
      </div>

      {/* Interactive Control Panel & Inputs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 no-print">
        {/* Left Column: Configurable Sliders & Inputs */}
        <div className="lg:col-span-7 space-y-4">
          <Card>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900">Shift Wage Parameters</h3>
              
              {/* Period toggle: Weekly vs Monthly */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-medium">
                <button
                  onClick={() => handlePeriodChange('weekly')}
                  className={`px-3 py-1.5 rounded-md transition-colors ${
                    periodType === 'weekly' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Weekly Estimate
                </button>
                <button
                  onClick={() => handlePeriodChange('monthly')}
                  className={`px-3 py-1.5 rounded-md transition-colors ${
                    periodType === 'monthly' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Monthly Estimate
                </button>
              </div>
            </div>

            <div className="space-y-4 mt-4 text-xs">
              {/* Base Rate */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Base Hourly Rate (₹/hr)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400 font-bold">₹</span>
                    <input
                      type="number"
                      min={50}
                      max={2000}
                      value={baseRate}
                      onChange={(e) => setBaseRate(Number(e.target.value))}
                      className="w-full pl-7 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-teal-600 font-semibold text-slate-900 tabular-nums"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Profile Standard: ₹{currentWorker.hourlyRate}/hr</p>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Overtime Multiplier (Standard: 1.5×)
                  </label>
                  <select
                    value={overtimeMultiplier}
                    onChange={(e) => setOvertimeMultiplier(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-teal-600 bg-white font-semibold text-slate-900"
                  >
                    <option value={1.25}>1.25× (Standard weekday OT)</option>
                    <option value={1.5}>1.50× (Statutory standard)</option>
                    <option value={2.0}>2.00× (Double time / Sunday / Holiday)</option>
                  </select>
                  <p className="text-[11px] text-slate-500 mt-1">Applied to hours beyond 8h per day</p>
                </div>
              </div>

              {/* Hours Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                <div>
                  <div className="flex justify-between font-semibold text-slate-700 mb-1">
                    <span>{t.regularHours}</span>
                    <span className="tabular-nums text-teal-800">{regularHours} hrs</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={periodType === 'weekly' ? 60 : 240}
                    step={1}
                    value={regularHours}
                    onChange={(e) => setRegularHours(Number(e.target.value))}
                    className="w-full accent-teal-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between font-semibold text-slate-700 mb-1">
                    <span>{t.overtimeHours}</span>
                    <span className="tabular-nums text-amber-700 font-bold">{overtimeHours} hrs</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={periodType === 'weekly' ? 30 : 100}
                    step={0.5}
                    value={overtimeHours}
                    onChange={(e) => setOvertimeHours(Number(e.target.value))}
                    className="w-full accent-amber-600"
                  />
                </div>
              </div>

              {/* Bonuses and Deductions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {t.bonuses} (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400 font-bold">₹</span>
                    <input
                      type="number"
                      min={0}
                      step={50}
                      value={bonuses}
                      onChange={(e) => setBonuses(Number(e.target.value))}
                      className="w-full pl-7 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-teal-600 tabular-nums"
                      placeholder="Site allowance, hazard pay"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {t.deductions} (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400 font-bold">₹</span>
                    <input
                      type="number"
                      min={0}
                      step={50}
                      value={deductions}
                      onChange={(e) => setDeductions(Number(e.target.value))}
                      className="w-full pl-7 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-teal-600 tabular-nums"
                      placeholder="Canteen, uniform, advance"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Timesheet Comparison Callout */}
          <div className="bg-slate-100 rounded-xl p-4 border border-slate-200 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <FileSpreadsheet className="w-4 h-4 text-teal-700" />
              <span>Timesheet Comparison Analysis</span>
            </div>
            <p className="text-slate-600">{calculation.discrepancyNotes}</p>
            <div className="flex items-center gap-4 pt-1 font-mono text-[11px] text-slate-700">
              <span>Actual Stored Hours: <strong>{calculation.actualRecordedHours || 0} hrs</strong></span>
              <span>Input Estimate: <strong>{regularHours + overtimeHours} hrs</strong></span>
            </div>
          </div>
        </div>

        {/* Right Column: Real-time Wage Summary & Formula Breakdown */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 text-white rounded-xl p-6 shadow-md border border-slate-800 space-y-4">
            <p className="text-xs font-semibold text-teal-400 uppercase tracking-wider">
              {periodType === 'weekly' ? 'Weekly Take-Home Projection' : 'Monthly Take-Home Projection'}
            </p>

            <div>
              <div className="text-3xl sm:text-4xl font-extrabold tabular-nums text-teal-300">
                ₹{calculation.estimatedTakeHome.toLocaleString('en-IN')}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Net estimated compensation after adjustments
              </p>
            </div>

            {/* Itemized list */}
            <div className="space-y-2 pt-4 border-t border-slate-800 text-xs">
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Regular Pay ({calculation.regularHours}h @ ₹{calculation.baseRate}):</span>
                <span className="font-semibold tabular-nums text-white">
                  ₹{calculation.regularEarnings.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Overtime ({calculation.overtimeHours}h @ {calculation.overtimeMultiplier}×):</span>
                <span className="font-semibold tabular-nums text-amber-400">
                  + ₹{calculation.overtimeEarnings.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Bonuses & Allowances:</span>
                <span className="font-semibold tabular-nums text-emerald-400">
                  + ₹{calculation.bonuses.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800 pb-2">
                <span className="text-slate-400">Statutory / Canteen Deductions:</span>
                <span className="font-semibold tabular-nums text-rose-400">
                  − ₹{calculation.deductions.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between pt-1 font-bold text-sm">
                <span className="text-slate-300">Net Estimated Pay:</span>
                <span className="text-teal-300 tabular-nums">
                  ₹{calculation.estimatedTakeHome.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Formula Transparency Box */}
          <div className="p-4 rounded-xl border border-teal-200 bg-teal-50/60 text-xs text-slate-700 space-y-1">
            <p className="font-bold text-teal-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-teal-700" />
              <span>Transparent Formula Breakdown</span>
            </p>
            <p className="text-[11px] font-mono text-teal-950 pt-1">
              Regular Earnings = {calculation.regularHours}h × ₹{calculation.baseRate} = ₹{calculation.regularEarnings}
            </p>
            <p className="text-[11px] font-mono text-teal-950">
              OT Earnings = {calculation.overtimeHours}h × ₹{calculation.baseRate} × {calculation.overtimeMultiplier} = ₹{calculation.overtimeEarnings}
            </p>
            <p className="text-[11px] font-mono text-teal-950">
              Take-Home = ₹{calculation.regularEarnings} + ₹{calculation.overtimeEarnings} + ₹{calculation.bonuses} − ₹{calculation.deductions} = ₹{calculation.estimatedTakeHome}
            </p>
          </div>
        </div>
      </div>

      {/* Printable Payslip Container (Visible on screen and optimized for window.print) */}
      <div className="printable-payslip bg-white rounded-xl border border-slate-200 p-8 shadow-xs space-y-6">
        <div className="flex items-start justify-between border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-teal-700" />
              <h2 className="text-lg font-bold text-slate-900">FAIRSHIFT 360 PAYSLIP ESTIMATE</h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Transparent Shift Compensation Record · UN SDG 8 Aligned
            </p>
          </div>

          <div className="text-right text-xs text-slate-500">
            <p className="font-semibold text-slate-800">Generated: {new Date().toLocaleDateString('en-IN')}</p>
            <p>Period: {periodType === 'weekly' ? 'Weekly Timesheet' : 'Monthly Timesheet'}</p>
          </div>
        </div>

        {/* Worker Details Table */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs bg-slate-50 p-4 rounded-lg border border-slate-200">
          <div>
            <span className="text-slate-500 block">Worker Name:</span>
            <span className="font-bold text-slate-900">{currentWorker.name}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Trade / Role:</span>
            <span className="font-semibold text-slate-900">{currentWorker.role}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Worksite:</span>
            <span className="font-semibold text-slate-900">{currentWorker.worksite}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Base Rate:</span>
            <span className="font-bold text-teal-700">₹{calculation.baseRate}/hr</span>
          </div>
        </div>

        {/* Breakdown table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 font-semibold text-slate-700 border-b border-slate-300">
              <tr>
                <th className="py-2.5 px-3">Earning Component</th>
                <th className="py-2.5 px-3">Hours / Basis</th>
                <th className="py-2.5 px-3">Rate Multiplier</th>
                <th className="py-2.5 px-3 text-right">Amount (INR ₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              <tr>
                <td className="py-2.5 px-3 font-sans font-medium text-slate-800">Regular Shift Hours</td>
                <td className="py-2.5 px-3">{calculation.regularHours} hrs</td>
                <td className="py-2.5 px-3">1.0× (@ ₹{calculation.baseRate})</td>
                <td className="py-2.5 px-3 text-right font-bold">₹{calculation.regularEarnings.toLocaleString('en-IN')}</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-sans font-medium text-slate-800">Overtime Hours (OT)</td>
                <td className="py-2.5 px-3">{calculation.overtimeHours} hrs</td>
                <td className="py-2.5 px-3">{calculation.overtimeMultiplier}× (@ ₹{calculation.baseRate * calculation.overtimeMultiplier})</td>
                <td className="py-2.5 px-3 text-right font-bold text-amber-700">₹{calculation.overtimeEarnings.toLocaleString('en-IN')}</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-sans font-medium text-slate-800">Allowances & Incentives</td>
                <td className="py-2.5 px-3">Direct Incentive</td>
                <td className="py-2.5 px-3">—</td>
                <td className="py-2.5 px-3 text-right text-emerald-700">+ ₹{calculation.bonuses.toLocaleString('en-IN')}</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-sans font-medium text-slate-800">Statutory Deductions</td>
                <td className="py-2.5 px-3">Direct Deduction</td>
                <td className="py-2.5 px-3">—</td>
                <td className="py-2.5 px-3 text-right text-rose-700">− ₹{calculation.deductions.toLocaleString('en-IN')}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-300 font-bold text-sm bg-slate-50">
                <td colSpan={3} className="py-3 px-3 text-slate-900 font-sans">
                  Total Estimated Take-Home Pay
                </td>
                <td className="py-3 px-3 text-right text-teal-800 font-mono">
                  ₹{calculation.estimatedTakeHome.toLocaleString('en-IN')}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Disclaimers */}
        <p className="text-[11px] text-slate-400 italic pt-2">
          {t.disclaimerPayroll}
        </p>
      </div>
    </div>
  );
};
