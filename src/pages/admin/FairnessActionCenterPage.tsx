import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { StorageService } from '../../services/storage';
import { FairnessAlert } from '../../types';
import {
  Scale,
  AlertTriangle,
  Clock,
  Award,
  FileEdit,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Info
} from 'lucide-react';
import { Button, Card, StatCard } from '../../components/common/UIComponents';

export const FairnessActionCenterPage: React.FC = () => {
  const navigate = useNavigate();
  const { language, t } = useApp();

  const [alerts, setAlerts] = useState<FairnessAlert[]>([]);

  useEffect(() => {
    setAlerts(StorageService.getFairnessAlerts());
  }, []);

  const getAlertIcon = (type: FairnessAlert['type']) => {
    switch (type) {
      case 'safety_delay':
        return AlertTriangle;
      case 'overtime_fatigue':
        return Clock;
      case 'pending_correction':
        return FileEdit;
      case 'cert_expiring':
        return Award;
      default:
        return Scale;
    }
  };

  const criticalCount = alerts.filter((a) => a.severity === 'critical' || a.severity === 'high').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{t.navFairnessCenter}</h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Explainable compliance engine detecting safety delays, wage discrepancies, shift fatigue, and expired certifications.
        </p>
      </div>

      {/* Philosophy banner */}
      <div className="bg-slate-900 text-white rounded-xl p-6 shadow-md border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-teal-400 uppercase tracking-wider">
            <Scale className="w-3.5 h-3.5" />
            <span>Explainable Algorithmic Integrity</span>
          </div>
          <h2 className="text-lg font-bold text-white">
            Traceable Accountability · No Black-Box Judgments
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Every item in this center is grounded directly in verifiable shift logs, timestamp deltas, and certified trade documents. We highlight risks so supervisors can act proactively before accidents occur.
          </p>
        </div>

        <div className="shrink-0 bg-slate-800 p-4 rounded-lg border border-slate-700 text-center text-xs">
          <div className="text-2xl font-extrabold text-teal-400 tabular-nums">
            {alerts.length}
          </div>
          <div className="text-slate-400 mt-0.5">Active Signals</div>
        </div>
      </div>

      {/* Alerts Grid */}
      <div className="space-y-4">
        {alerts.length === 0 ? (
          <Card className="text-center py-12">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900">All Integrity Metrics Nominal</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              No outstanding safety bottlenecks, unreviewed corrections, or impending trade license lapses detected.
            </p>
          </Card>
        ) : (
          alerts.map((alert) => {
            const Icon = getAlertIcon(alert.type);
            const isHigh = alert.severity === 'critical' || alert.severity === 'high';

            return (
              <Card
                key={alert.id}
                className={`border transition-all ${
                  isHigh ? 'border-rose-300 bg-rose-50/20' : 'border-slate-200 bg-white'
                }`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  <div className="lg:col-span-8 space-y-3">
                    <div className="flex items-center gap-2">
                      <div
                        className={`p-1.5 rounded-lg ${
                          isHigh ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm">{alert.title}</h3>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                          isHigh ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {alert.severity} Priority
                      </span>
                    </div>

                    {/* What was detected */}
                    <div className="text-xs">
                      <span className="font-semibold text-slate-700 block">1. What Was Detected:</span>
                      <p className="text-slate-800 mt-0.5 font-medium">{alert.detectedIssue}</p>
                    </div>

                    {/* Why it matters */}
                    <div className="text-xs">
                      <span className="font-semibold text-slate-700 block">2. Why It Matters:</span>
                      <p className="text-slate-600 mt-0.5 leading-relaxed">{alert.whyItMatters}</p>
                    </div>

                    {/* Recommended action */}
                    <div className="text-xs p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-700">
                      <span className="font-semibold text-slate-900 block">3. Recommended Action:</span>
                      <p className="mt-0.5">{alert.recommendedAction}</p>
                    </div>
                  </div>

                  {/* Right Column: Working action button */}
                  <div className="lg:col-span-4 flex flex-col justify-between h-full pt-2 lg:pt-0 border-t lg:border-t-0 lg:border-l border-slate-200 lg:pl-6 space-y-4">
                    <div className="text-xs text-slate-500">
                      <p className="font-semibold text-slate-700">Traceable Identifier:</p>
                      <p className="font-mono text-slate-800 mt-0.5">{alert.relatedRecordId}</p>
                      {alert.relatedWorkerName && (
                        <p className="mt-1">Personnel: <strong className="text-slate-900">{alert.relatedWorkerName}</strong></p>
                      )}
                    </div>

                    <Button
                      size="sm"
                      variant={isHigh ? 'danger' : 'primary'}
                      onClick={() => navigate(alert.targetWorkflow)}
                      icon={ArrowRight}
                      className="w-full font-bold"
                    >
                      Open Target Workflow
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};
