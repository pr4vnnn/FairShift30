import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { StorageService } from '../../services/storage';
import { Worker, Shift, ShiftCorrectionRequest, Industry } from '../../types';
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  FileEdit,
  Clock,
  Phone,
  HardHat,
  Building2,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { Button, Card, StatusBadge, Drawer, Modal } from '../../components/common/UIComponents';

export const WorkerManagementPage: React.FC = () => {
  const { language, t, showToast } = useApp();

  const [workers, setWorkers] = useState<Worker[]>([]);
  const [corrections, setCorrections] = useState<ShiftCorrectionRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState<'all' | Industry>('all');
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [workerShifts, setWorkerShifts] = useState<Shift[]>([]);

  // Shift correction review modal state
  const [selectedCorrection, setSelectedCorrection] = useState<ShiftCorrectionRequest | null>(null);
  const [reviewAction, setReviewAction] = useState<'Approved' | 'Rejected'>('Approved');
  const [reviewerNote, setReviewerNote] = useState('');

  const loadData = () => {
    setWorkers(StorageService.getWorkers());
    setCorrections(StorageService.getCorrectionRequests());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenWorkerDrawer = (worker: Worker) => {
    setSelectedWorker(worker);
    setWorkerShifts(StorageService.getWorkerShifts(worker.id));
  };

  const handleOpenReviewModal = (corr: ShiftCorrectionRequest, action: 'Approved' | 'Rejected') => {
    setSelectedCorrection(corr);
    setReviewAction(action);
    setReviewerNote(
      action === 'Approved'
        ? 'Verified against site muster roll physical log. Adjustment authorized.'
        : 'Discrepancy with site supervisor CCTV timing; original clock-in upheld.'
    );
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCorrection || !reviewerNote.trim()) {
      showToast('Please provide a reviewer explanation', 'error');
      return;
    }

    try {
      StorageService.reviewCorrectionRequest(
        selectedCorrection.id,
        reviewAction,
        reviewerNote.trim()
      );
      setSelectedCorrection(null);
      loadData();
      showToast(`Shift correction ${reviewAction.toLowerCase()} successfully`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to review request', 'error');
    }
  };

  // Filter workers
  const filteredWorkers = workers.filter((w) => {
    const matchesIndustry = selectedIndustry === 'all' || w.industry === selectedIndustry;
    const matchesSearch =
      w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.worksite.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesIndustry && matchesSearch;
  });

  const pendingCorrections = corrections.filter((c) => c.status === 'Pending');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{t.navWorkerDirectory}</h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Manage trade teams, view shift records, and process time adjustment appeals.
        </p>
      </div>

      {/* Pending Shift Correction Queue */}
      {pendingCorrections.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-amber-950 flex items-center gap-2">
              <FileEdit className="w-4 h-4 text-amber-700" />
              <span>Pending Shift Correction Requests ({pendingCorrections.length})</span>
            </h3>
            <span className="text-xs text-amber-800 font-semibold">Requires Supervisor Verification</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingCorrections.map((corr) => (
              <div
                key={corr.id}
                className="bg-white p-4 rounded-xl border border-amber-200 shadow-xs space-y-3 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{corr.workerName}</span>
                  <span className="text-slate-500 font-mono">Shift: {corr.shiftDate}</span>
                </div>

                <div className="text-slate-600 space-y-1">
                  <p>
                    <strong className="text-slate-700">Original Record:</strong>{' '}
                    {new Date(corr.originalClockIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} –{' '}
                    {new Date(corr.originalClockOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <p>
                    <strong className="text-teal-700">Proposed Timing:</strong>{' '}
                    {new Date(corr.proposedClockIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} –{' '}
                    {new Date(corr.proposedClockOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <p className="text-slate-700 italic bg-slate-50 p-2 rounded border border-slate-100">
                    "{corr.reason}"
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    icon={XCircle}
                    onClick={() => handleOpenReviewModal(corr, 'Rejected')}
                    className="text-rose-700 border-rose-200 hover:bg-rose-50"
                  >
                    Reject
                  </Button>
                  <Button
                    size="sm"
                    variant="primary"
                    icon={CheckCircle2}
                    onClick={() => handleOpenReviewModal(corr, 'Approved')}
                  >
                    Approve Adjustment
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Directory Search & Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by worker name, role, ID, or site..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:outline-teal-600"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Industry:</span>
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-semibold">
              <button
                onClick={() => setSelectedIndustry('all')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  selectedIndustry === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedIndustry('construction')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  selectedIndustry === 'construction' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Construction
              </button>
              <button
                onClick={() => setSelectedIndustry('facilities')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  selectedIndustry === 'facilities' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Facilities
              </button>
            </div>
          </div>
        </div>

        {/* Workers Table */}
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Worker / Trade</th>
                <th className="py-3 px-4">Industry & Site</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Base Rate (INR)</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredWorkers.map((w) => (
                <tr key={w.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{w.name}</div>
                    <div className="text-slate-500 text-[11px]">{w.role}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5 font-medium text-slate-800">
                      {w.industry === 'construction' ? (
                        <HardHat className="w-3.5 h-3.5 text-amber-600" />
                      ) : (
                        <Building2 className="w-3.5 h-3.5 text-teal-600" />
                      )}
                      <span className="capitalize">{w.industry}</span>
                    </div>
                    <div className="text-slate-500 text-[11px] truncate max-w-xs">{w.worksite}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{w.department}</td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-900 tabular-nums">
                    ₹{w.hourlyRate}/hr
                  </td>
                  <td className="py-3 px-4 text-slate-500">{w.phone}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleOpenWorkerDrawer(w)}
                      className="text-teal-700 hover:text-teal-900 font-semibold hover:underline"
                    >
                      View Details & Shifts →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Worker Detail Drawer */}
      <Drawer
        isOpen={!!selectedWorker}
        onClose={() => setSelectedWorker(null)}
        title={selectedWorker?.name || 'Worker Profile'}
        subtitle={`${selectedWorker?.role} · ${selectedWorker?.department}`}
      >
        {selectedWorker && (
          <div className="space-y-6 text-xs">
            {/* Rates & Info */}
            <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <span className="text-slate-500 block">Hourly Base Rate:</span>
                <span className="font-bold text-sm text-teal-800">₹{selectedWorker.hourlyRate}/hr</span>
              </div>
              <div>
                <span className="text-slate-500 block">Standard Daily (8h):</span>
                <span className="font-bold text-sm text-slate-800">₹{selectedWorker.dailyRate}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Assigned Worksite:</span>
                <span className="font-semibold text-slate-900">{selectedWorker.worksite}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Emergency Contact:</span>
                <span className="font-semibold text-slate-900">{selectedWorker.emergencyContact}</span>
              </div>
            </div>

            {/* Shift History for this worker */}
            <div>
              <h4 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-teal-700" />
                <span>Recorded Shifts ({workerShifts.length})</span>
              </h4>

              {workerShifts.length === 0 ? (
                <p className="text-slate-500 italic">No shifts logged yet.</p>
              ) : (
                <div className="space-y-2">
                  {workerShifts.map((s) => (
                    <div
                      key={s.id}
                      className="p-3 rounded-lg border border-slate-200 bg-white flex items-center justify-between"
                    >
                      <div>
                        <div className="font-semibold text-slate-900">{s.date}</div>
                        <div className="text-slate-500 text-[11px]">
                          {new Date(s.clockInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} –{' '}
                          {s.clockOutTime ? new Date(s.clockOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Active'} · Break: {s.breakMinutes}m
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-slate-900">{s.netHours} hrs</div>
                        {s.overtimeHours > 0 && (
                          <div className="text-amber-700 font-semibold text-[11px]">+{s.overtimeHours}h OT</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Drawer>

      {/* Review Modal for Shift Corrections */}
      <Modal
        isOpen={!!selectedCorrection}
        onClose={() => setSelectedCorrection(null)}
        title={`${reviewAction} Shift Correction Request`}
      >
        {selectedCorrection && (
          <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
            <p className="text-slate-600">
              Provide an official supervisor review note for{' '}
              <strong className="text-slate-900">{selectedCorrection.workerName}</strong>'s adjustment request on{' '}
              <strong className="text-slate-900">{selectedCorrection.shiftDate}</strong>.
            </p>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Supervisor Review & Verification Reason
              </label>
              <textarea
                rows={3}
                value={reviewerNote}
                onChange={(e) => setReviewerNote(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-teal-600"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setSelectedCorrection(null)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                variant={reviewAction === 'Approved' ? 'primary' : 'danger'}
              >
                Confirm {reviewAction}
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
