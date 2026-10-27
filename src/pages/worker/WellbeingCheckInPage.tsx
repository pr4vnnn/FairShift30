import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { StorageService } from '../../services/storage';
import { WellbeingCheckIn } from '../../types';
import {
  HeartPulse,
  Moon,
  BatteryMedium,
  CheckCircle2,
  AlertTriangle,
  Info,
  Calendar,
  Lock
} from 'lucide-react';
import { Button, Card, StatCard } from '../../components/common/UIComponents';

export const WellbeingCheckInPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentWorker, language, t, showToast } = useApp();

  const [logs, setLogs] = useState<WellbeingCheckIn[]>([]);
  const [sleepHours, setSleepHours] = useState<number>(7);
  const [fatigueScore, setFatigueScore] = useState<1 | 2 | 3 | 4 | 5>(2);
  const [workloadFeeling, setWorkloadFeeling] = useState<'Light' | 'Manageable' | 'Challenging' | 'Overwhelming'>('Manageable');
  const [privateNotes, setPrivateNotes] = useState('');
  const [lastCheckIn, setLastCheckIn] = useState<WellbeingCheckIn | null>(null);

  const loadData = () => {
    const list = StorageService.getWellbeingLogs(currentWorker.id);
    setLogs(list);
    if (list.length > 0) {
      setLastCheckIn(list[0]);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentWorker.id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = StorageService.createWellbeingCheckIn({
        workerId: currentWorker.id,
        sleepHours,
        fatigueScore,
        workloadFeeling,
        privateNotes: privateNotes.trim() || undefined
      });

      setLastCheckIn(created);
      loadData();
      setPrivateNotes('');
      showToast('Pre-shift check-in recorded', 'success');
    } catch (err: any) {
      showToast(err.message || 'Error recording check-in', 'error');
    }
  };

  const isConcern = sleepHours < 6 || fatigueScore >= 4 || workloadFeeling === 'Overwhelming';

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{t.wellbeingTitle}</h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          {t.wellbeingSubtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Check-in Form */}
        <div className="lg:col-span-7 space-y-4">
          <Card>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <HeartPulse className="w-4 h-4 text-teal-700" />
                <span>Today's Pre-Shift Check-In</span>
              </h3>
              <span className="text-xs text-slate-500">Optional · Worker-Confidential</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 mt-4 text-xs">
              {/* Sleep Hours Slider */}
              <div>
                <div className="flex justify-between font-semibold text-slate-700 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Moon className="w-3.5 h-3.5 text-slate-500" />
                    <span>{t.sleepHoursLabel}</span>
                  </span>
                  <span className="font-bold text-teal-800 tabular-nums text-sm">{sleepHours} Hours</span>
                </div>
                <input
                  type="range"
                  min={2}
                  max={12}
                  step={0.5}
                  value={sleepHours}
                  onChange={(e) => setSleepHours(Number(e.target.value))}
                  className="w-full accent-teal-600 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>&lt; 5h (Deficit)</span>
                  <span>7 - 8h (Recommended)</span>
                  <span>10h+</span>
                </div>
              </div>

              {/* Fatigue Score (1 - 5) */}
              <div>
                <label className="block font-semibold text-slate-700 mb-2">
                  {t.fatigueScoreLabel}
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { score: 1, label: '1 - Fresh', desc: 'Alert & energized' },
                    { score: 2, label: '2 - Good', desc: 'Normal energy' },
                    { score: 3, label: '3 - Moderate', desc: 'Slightly tired' },
                    { score: 4, label: '4 - Heavy', desc: 'Fatigued' },
                    { score: 5, label: '5 - Exhausted', desc: 'Severely sluggish' }
                  ].map((item) => (
                    <button
                      key={item.score}
                      type="button"
                      onClick={() => setFatigueScore(item.score as any)}
                      className={`p-2.5 rounded-lg border text-center transition-colors ${
                        fatigueScore === item.score
                          ? item.score >= 4
                            ? 'bg-rose-50 border-rose-400 text-rose-900 font-bold ring-1 ring-rose-400'
                            : 'bg-teal-50 border-teal-500 text-teal-900 font-bold ring-1 ring-teal-400'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="font-semibold">{item.label}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5 hidden sm:block">{item.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Workload Feeling */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  {t.workloadLabel}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['Light', 'Manageable', 'Challenging', 'Overwhelming'] as const).map((feeling) => (
                    <button
                      key={feeling}
                      type="button"
                      onClick={() => setWorkloadFeeling(feeling)}
                      className={`py-2 px-3 rounded-lg border text-xs font-medium transition-colors ${
                        workloadFeeling === feeling
                          ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      {feeling}
                    </button>
                  ))}
                </div>
              </div>

              {/* Private Notes */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Optional Personal Note</span>
                  <span className="text-[11px] font-normal text-slate-400 flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    <span>Private to you</span>
                  </span>
                </label>
                <textarea
                  rows={2}
                  value={privateNotes}
                  onChange={(e) => setPrivateNotes(e.target.value)}
                  placeholder="e.g. Back stiffness from yesterday's rebar bending; prefer ground-level task today if possible."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-teal-600"
                />
              </div>

              {/* Concern Rule Callout */}
              {isConcern && (
                <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Fatigue Safety Advisory</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    {t.wellbeingAdvice} Consider taking regular hydration breaks and informing your safety lead before working on scaffolding or with high-voltage panels.
                  </p>
                </div>
              )}

              {/* Buttons */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => navigate('/worker')}
                  className="text-slate-500 hover:text-slate-700 font-medium"
                >
                  Skip for today
                </button>
                <Button type="submit" size="md">
                  Record Wellbeing Check
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* History & Principles Column */}
        <div className="lg:col-span-5 space-y-4 text-xs">
          {/* Privacy & Medical Scope Card */}
          <Card className="bg-slate-50 border-slate-200">
            <h4 className="font-bold text-slate-900 flex items-center gap-2">
              <Info className="w-4 h-4 text-teal-700" />
              <span>Safety & Privacy Principles</span>
            </h4>
            <p className="text-slate-600 mt-2 leading-relaxed">
              This module does not diagnose medical conditions or predict accidents. Its purpose is to encourage proactive self-awareness and safe pacing before high-risk tasks. Personal notes are never published to public muster rolls.
            </p>
          </Card>

          {/* Past Check-ins */}
          <Card>
            <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-500" />
              <span>Recent Wellbeing Check-Ins</span>
            </h4>

            {logs.length === 0 ? (
              <p className="text-slate-500 italic">No previous check-in records found.</p>
            ) : (
              <div className="space-y-3">
                {logs.slice(0, 4).map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-lg border border-slate-200 bg-white space-y-1"
                  >
                    <div className="flex items-center justify-between font-semibold text-slate-900">
                      <span>{log.date}</span>
                      <span className={`text-[11px] px-2 py-0.5 rounded ${
                        log.concernFlagged ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {log.concernFlagged ? 'Fatigue Flagged' : 'Normal Rest'}
                      </span>
                    </div>
                    <div className="text-slate-600 text-[11px] flex gap-3">
                      <span>Sleep: <strong>{log.sleepHours}h</strong></span>
                      <span>Fatigue: <strong>{log.fatigueScore}/5</strong></span>
                      <span>Load: <strong>{log.workloadFeeling}</strong></span>
                    </div>
                    {log.flagReason && (
                      <p className="text-[11px] text-amber-800 italic pt-1">{log.flagReason}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
