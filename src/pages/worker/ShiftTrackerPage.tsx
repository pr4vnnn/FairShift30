import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { StorageService } from '../../services/storage';
import { Shift, ShiftCorrectionRequest } from '../../types';
import {
  Clock,
  Play,
  Square,
  Coffee,
  Calendar,
  AlertCircle,
  FileEdit,
  CheckCircle2,
  Filter,
  ArrowRight,
  Info
} from 'lucide-react';
import { Button, Card, StatusBadge, Modal, EmptyState } from '../../components/common/UIComponents';

export const ShiftTrackerPage: React.FC = () => {
  const { currentWorker, language, t, showToast } = useApp();

  const [shifts, setShifts] = useState<Shift[]>([]);
  const [activeShift, setActiveShift] = useState<Shift | undefined>(undefined);
  const [corrections, setCorrections] = useState<ShiftCorrectionRequest[]>([]);
  const [selectedShiftForCorrection, setSelectedShiftForCorrection] = useState<Shift | null>(null);
  const [isCorrectionModalOpen, setIsCorrectionModalOpen] = useState(false);

  // Correction form state
  const [proposedClockIn, setProposedClockIn] = useState('');
  const [proposedClockOut, setProposedClockOut] = useState('');
  const [correctionReason, setCorrectionReason] = useState('');

  // Date filter state
  const [filterPeriod, setFilterPeriod] = useState<'all' | '7days' | '30days'>('all');

  const loadData = () => {
    const allWorkerShifts = StorageService.getWorkerShifts(currentWorker.id);
    setShifts(allWorkerShifts);
    setActiveShift(StorageService.getActiveShift(currentWorker.id));
    setCorrections(
      StorageService.getCorrectionRequests().filter((c) => c.workerId === currentWorker.id)
    );
  };

  useEffect(() => {
    loadData();
  }, [currentWorker.id]);

  const handleClockIn = () => {
    try {
      StorageService.clockIn(currentWorker.id);
      loadData();
      showToast(`${t.clockIn} recorded successfully`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Error clocking in', 'error');
    }
  };

  const handleClockOut = () => {
    try {
      StorageService.clockOut(currentWorker.id);
      loadData();
      showToast(`${t.clockOut} recorded successfully`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Error clocking out', 'error');
    }
  };

  const handleAddBreak = (mins: number) => {
    if (!activeShift) return;
    StorageService.addBreakMinutes(activeShift.id, mins);
    loadData();
    showToast(`Added ${mins} minutes to break time`, 'info');
  };

  const handleOpenCorrection = (shift: Shift) => {
    setSelectedShiftForCorrection(shift);
    const inTime = shift.clockInTime ? new Date(shift.clockInTime).toISOString().slice(0, 16) : '';
    const outTime = shift.clockOutTime ? new Date(shift.clockOutTime).toISOString().slice(0, 16) : '';
    setProposedClockIn(inTime);
    setProposedClockOut(outTime);
    setCorrectionReason('');
    setIsCorrectionModalOpen(true);
  };

  const handleSubmitCorrection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShiftForCorrection || !proposedClockIn || !proposedClockOut || !correctionReason.trim()) {
      showToast('Please fill all correction fields and reason', 'error');
      return;
    }

    try {
      StorageService.createCorrectionRequest({
        workerId: currentWorker.id,
        workerName: currentWorker.name,
        shiftId: selectedShiftForCorrection.id,
        shiftDate: selectedShiftForCorrection.date,
        originalClockIn: selectedShiftForCorrection.clockInTime,
        originalClockOut: selectedShiftForCorrection.clockOutTime || new Date().toISOString(),
        proposedClockIn: new Date(proposedClockIn).toISOString(),
        proposedClockOut: new Date(proposedClockOut).toISOString(),
        reason: correctionReason.trim()
      });
      setIsCorrectionModalOpen(false);
      loadData();
      showToast('Shift correction request submitted to supervisor', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to submit correction', 'error');
    }
  };

  // Filter shifts
  const filteredShifts = shifts.filter((s) => {
    if (filterPeriod === 'all') return true;
    const diffDays = (Date.now() - new Date(s.clockInTime).getTime()) / 86400000;
    if (filterPeriod === '7days') return diffDays <= 7;
    if (filterPeriod === '30days') return diffDays <= 30;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{t.navShifts}</h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Smart shift recording, automatic break deductions, overtime tracking, and adjustment requests.
        </p>
      </div>

      {/* Clock in/out widget card */}
      <Card className="bg-gradient-to-r from-slate-900 to-slate-800 text-white border-slate-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  activeShift ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'
                }`}
              />
              <span className="text-xs uppercase font-semibold text-slate-300">
                {activeShift ? t.onShift : t.offShift}
              </span>
            </div>

            {activeShift ? (
              <div>
                <p className="text-lg font-bold">
                  Clocked In Today at{' '}
                  <span className="text-teal-300 tabular-nums">
                    {new Date(activeShift.clockInTime).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Breaks Recorded: <span className="font-semibold text-white">{activeShift.breakMinutes} mins</span> · Overtime threshold: 8.0 hrs
                </p>
                
                {/* Break adjustment */}
                <div className="mt-3 flex items-center gap-2 text-xs">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Coffee className="w-3.5 h-3.5" />
                    <span>Quick Break:</span>
                  </span>
                  <button
                    onClick={() => handleAddBreak(15)}
                    className="px-2.5 py-1 bg-slate-700/80 hover:bg-slate-600 rounded text-slate-200"
                  >
                    +15m
                  </button>
                  <button
                    onClick={() => handleAddBreak(30)}
                    className="px-2.5 py-1 bg-slate-700/80 hover:bg-slate-600 rounded text-slate-200"
                  >
                    +30m
                  </button>
                  <button
                    onClick={() => handleAddBreak(60)}
                    className="px-2.5 py-1 bg-slate-700/80 hover:bg-slate-600 rounded text-slate-200"
                  >
                    +60m Lunch
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-base font-semibold">Not Currently Clocked In</p>
                <p className="text-xs text-slate-400 mt-1">
                  Start your shift to record attendance and net working hours.
                </p>
              </div>
            )}
          </div>

          <div className="shrink-0 flex items-center gap-3">
            {activeShift ? (
              <Button
                variant="danger"
                size="lg"
                icon={Square}
                onClick={handleClockOut}
                className="font-bold"
              >
                {t.clockOut}
              </Button>
            ) : (
              <Button
                variant="primary"
                size="lg"
                icon={Play}
                onClick={handleClockIn}
                className="font-bold bg-teal-500 hover:bg-teal-400 text-slate-950"
              >
                {t.clockIn}
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Pending / Reviewed Correction Requests */}
      {corrections.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <FileEdit className="w-4 h-4 text-teal-700" />
            <span>Shift Correction Requests</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {corrections.map((corr) => (
              <div
                key={corr.id}
                className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900">Shift Date: {corr.shiftDate}</span>
                  <StatusBadge status={corr.status} />
                </div>
                <p className="text-slate-600">
                  <strong className="text-slate-700">Requested:</strong> {new Date(corr.proposedClockIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – {new Date(corr.proposedClockOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
                <p className="text-slate-500 italic">"{corr.reason}"</p>
                {corr.reviewerNote && (
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700">
                    <p className="font-semibold text-[11px] text-slate-800">Supervisor Note:</p>
                    <p className="mt-0.5">{corr.reviewerNote}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Timesheet & History */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h3 className="text-base font-bold text-slate-900">Timesheet History</h3>
            <p className="text-xs text-slate-500">
              Net hours exclude logged break durations. Overtime is calculated past 8 hours/day.
            </p>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-medium">
            <button
              onClick={() => setFilterPeriod('all')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                filterPeriod === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Shifts
            </button>
            <button
              onClick={() => setFilterPeriod('7days')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                filterPeriod === '7days' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Last 7 Days
            </button>
            <button
              onClick={() => setFilterPeriod('30days')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                filterPeriod === '30days' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Last 30 Days
            </button>
          </div>
        </div>

        {filteredShifts.length === 0 ? (
          <EmptyState
            title="No shifts found"
            description="You have not recorded any shifts in this selected period."
            actionText="Clock In Now"
            onAction={handleClockIn}
          />
        ) : (
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Clock In</th>
                  <th className="py-3 px-4">Clock Out</th>
                  <th className="py-3 px-4">Break (mins)</th>
                  <th className="py-3 px-4">Net Hours</th>
                  <th className="py-3 px-4">Regular</th>
                  <th className="py-3 px-4">Overtime</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredShifts.map((shift) => (
                  <tr key={shift.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900 whitespace-nowrap">
                      {shift.date}
                    </td>
                    <td className="py-3 px-4 tabular-nums text-slate-700 whitespace-nowrap">
                      {new Date(shift.clockInTime).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="py-3 px-4 tabular-nums text-slate-700 whitespace-nowrap">
                      {shift.clockOutTime
                        ? new Date(shift.clockOutTime).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : '— (Active)'}
                    </td>
                    <td className="py-3 px-4 tabular-nums text-slate-600">
                      {shift.breakMinutes}m
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900 tabular-nums">
                      {shift.netHours}h
                    </td>
                    <td className="py-3 px-4 tabular-nums text-slate-600">
                      {shift.regularHours}h
                    </td>
                    <td className="py-3 px-4 tabular-nums text-amber-700 font-semibold">
                      {shift.overtimeHours > 0 ? `+${shift.overtimeHours}h` : '0h'}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={shift.status} />
                    </td>
                    <td className="py-3 px-4 text-right">
                      {shift.status === 'completed' && (
                        <button
                          onClick={() => handleOpenCorrection(shift)}
                          className="text-teal-700 hover:text-teal-900 font-semibold hover:underline"
                        >
                          Request Correction
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Shift Correction Modal */}
      <Modal
        isOpen={isCorrectionModalOpen}
        onClose={() => setIsCorrectionModalOpen(false)}
        title="Request Shift Timing Correction"
      >
        <form onSubmit={handleSubmitCorrection} className="space-y-4 text-xs">
          <p className="text-slate-600">
            Submit a proposed adjustment for the shift on{' '}
            <strong className="text-slate-900">{selectedShiftForCorrection?.date}</strong>. Your supervisor will review and verify against site logs.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Proposed Clock In Time
              </label>
              <input
                type="datetime-local"
                value={proposedClockIn}
                onChange={(e) => setProposedClockIn(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-teal-600 bg-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Proposed Clock Out Time
              </label>
              <input
                type="datetime-local"
                value={proposedClockOut}
                onChange={(e) => setProposedClockOut(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-teal-600 bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Reason for Adjustment
            </label>
            <textarea
              rows={3}
              value={correctionReason}
              onChange={(e) => setCorrectionReason(e.target.value)}
              placeholder="e.g. Biometric scanner network outage at main gate; supervisor signed physical muster roll."
              required
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-teal-600 bg-white"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setIsCorrectionModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Submit Correction Request
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
