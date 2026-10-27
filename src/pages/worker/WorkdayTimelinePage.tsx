import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { StorageService } from '../../services/storage';
import { ActivityEvent } from '../../types';
import {
  ListOrdered,
  Clock,
  ShieldAlert,
  Calculator,
  FileEdit,
  ArrowLeftRight,
  Award,
  Filter
} from 'lucide-react';
import { Card } from '../../components/common/UIComponents';

export const WorkdayTimelinePage: React.FC = () => {
  const { currentWorker, language, t } = useApp();

  const [activities, setActivities] = useState<ActivityEvent[]>([]);
  const [filterType, setFilterType] = useState<string>('all');

  useEffect(() => {
    setActivities(StorageService.getActivityLogs());
  }, []);

  const filtered = activities.filter((act) => {
    if (filterType === 'all') return true;
    return act.type === filterType;
  });

  const getIcon = (type: ActivityEvent['type']) => {
    switch (type) {
      case 'shift':
        return Clock;
      case 'safety':
        return ShieldAlert;
      case 'wage':
        return Calculator;
      case 'correction':
        return FileEdit;
      case 'swap':
        return ArrowLeftRight;
      default:
        return ListOrdered;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{t.navWorkdayTimeline}</h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Unified audit trail of shift entries, safety notifications, breaks, and supervisor status changes.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-medium w-fit">
        <button
          onClick={() => setFilterType('all')}
          className={`px-3 py-1.5 rounded-md transition-colors ${
            filterType === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          All Events
        </button>
        <button
          onClick={() => setFilterType('shift')}
          className={`px-3 py-1.5 rounded-md transition-colors ${
            filterType === 'shift' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Shifts & Breaks
        </button>
        <button
          onClick={() => setFilterType('safety')}
          className={`px-3 py-1.5 rounded-md transition-colors ${
            filterType === 'safety' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Safety Reports
        </button>
        <button
          onClick={() => setFilterType('correction')}
          className={`px-3 py-1.5 rounded-md transition-colors ${
            filterType === 'correction' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Corrections
        </button>
      </div>

      {/* Timeline Stream */}
      <Card className="p-6">
        <div className="relative border-l-2 border-slate-200 ml-4 space-y-8">
          {filtered.map((act) => {
            const Icon = getIcon(act.type);
            const isSafety = act.type === 'safety';
            const isShift = act.type === 'shift';

            return (
              <div key={act.id} className="relative pl-6">
                {/* Timeline node */}
                <div
                  className={`absolute -left-[17px] top-0 w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white shadow-xs ${
                    isSafety
                      ? 'bg-rose-600'
                      : isShift
                      ? 'bg-teal-600'
                      : 'bg-slate-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="font-bold text-slate-900 text-sm">
                      {language === 'ta' && act.titleTa ? act.titleTa : act.title}
                    </span>
                    <span className="text-slate-400 font-mono text-[11px]">
                      {new Date(act.timestamp).toLocaleString()}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{act.details}</p>

                  <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-400">
                    <span>Logged by: <strong className="text-slate-700">{act.actor}</strong></span>
                    <span>·</span>
                    <span className="capitalize">{act.actorRole} Action</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
