import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { StorageService } from '../../services/storage';
import { ShiftSwapRequest } from '../../types';
import {
  ArrowLeftRight,
  Plus,
  CheckCircle2,
  Calendar,
  Clock,
  User,
  AlertCircle
} from 'lucide-react';
import { Button, Card, StatusBadge, Modal, EmptyState } from '../../components/common/UIComponents';

export const ShiftSwapPage: React.FC = () => {
  const { currentWorker, language, t, showToast } = useApp();

  const [swaps, setSwaps] = useState<ShiftSwapRequest[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Form state
  const [shiftDate, setShiftDate] = useState('');
  const [shiftTime, setShiftTime] = useState('08:00 AM – 04:30 PM (Morning)');
  const [targetRole, setTargetRole] = useState(currentWorker.role);
  const [reason, setReason] = useState('');

  const loadSwaps = () => {
    setSwaps(StorageService.getShiftSwaps());
  };

  useEffect(() => {
    loadSwaps();
  }, []);

  const handleCreateSwap = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shiftDate || !reason.trim()) {
      showToast('Please provide a date and reason for shift swap', 'error');
      return;
    }

    try {
      StorageService.createShiftSwap({
        requesterWorkerId: currentWorker.id,
        requesterName: currentWorker.name,
        requesterShiftDate: shiftDate,
        requesterShiftTime: shiftTime,
        industry: currentWorker.industry,
        targetRole,
        reason: reason.trim()
      });

      setIsCreateModalOpen(false);
      setShiftDate('');
      setReason('');
      loadSwaps();
      showToast('Shift swap request posted to the board', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to create swap', 'error');
    }
  };

  const handleAcceptSwap = (swap: ShiftSwapRequest) => {
    if (swap.requesterWorkerId === currentWorker.id) {
      showToast('You cannot accept your own shift swap request.', 'error');
      return;
    }

    if (confirm(`Accept shift on ${swap.requesterShiftDate} (${swap.requesterShiftTime}) from ${swap.requesterName}?`)) {
      try {
        StorageService.acceptShiftSwap(swap.id, currentWorker.id, currentWorker.name);
        loadSwaps();
        showToast('Shift swap accepted! Updated in workforce schedule.', 'success');
      } catch (err: any) {
        showToast(err.message || 'Failed to accept swap', 'error');
      }
    }
  };

  const openSwaps = swaps.filter((s) => s.status === 'Open');
  const myRequests = swaps.filter((s) => s.requesterWorkerId === currentWorker.id);
  const acceptedSwaps = swaps.filter((s) => s.status === 'Accepted');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{t.navShiftSwap}</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Exchange scheduled shifts with qualified peer team members with supervisor transparency.
          </p>
        </div>

        <Button size="sm" icon={Plus} onClick={() => setIsCreateModalOpen(true)}>
          Post Shift Swap Request
        </Button>
      </div>

      {/* Open Swaps Marketplace */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <ArrowLeftRight className="w-4 h-4 text-teal-700" />
          <span>Available Peer Shift Swaps ({openSwaps.length})</span>
        </h3>

        {openSwaps.length === 0 ? (
          <EmptyState
            title="No open swap requests"
            description="There are currently no active shift swap requests posted by colleagues."
            actionText="Create a Request"
            onAction={() => setIsCreateModalOpen(true)}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {openSwaps.map((swap) => {
              const isMine = swap.requesterWorkerId === currentWorker.id;

              return (
                <Card key={swap.id} className="flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-900">
                        <User className="w-3.5 h-3.5 text-slate-500" />
                        <span>{swap.requesterName}</span>
                        {isMine && <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">(You)</span>}
                      </div>
                      <StatusBadge status={swap.status} />
                    </div>

                    <div className="mt-3 space-y-1 text-xs">
                      <div className="flex items-center gap-2 font-semibold text-slate-800">
                        <Calendar className="w-3.5 h-3.5 text-teal-700" />
                        <span>{swap.requesterShiftDate}</span>
                        <span className="text-slate-400">·</span>
                        <Clock className="w-3.5 h-3.5 text-teal-700" />
                        <span>{swap.requesterShiftTime}</span>
                      </div>
                      <p className="text-slate-500 pt-1">Target Skill: {swap.targetRole}</p>
                      <p className="text-slate-700 italic pt-1 bg-slate-50 p-2 rounded border border-slate-100">
                        "{swap.reason}"
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      Posted {new Date(swap.createdAt).toLocaleDateString()}
                    </span>

                    {!isMine ? (
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => handleAcceptSwap(swap)}
                      >
                        Accept Swap
                      </Button>
                    ) : (
                      <span className="text-xs text-slate-500 font-medium">Awaiting peer pickup</span>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* History of Accepted Swaps */}
      {acceptedSwaps.length > 0 && (
        <div className="pt-4 space-y-3">
          <h3 className="text-sm font-bold text-slate-900">Completed / Accepted Swaps</h3>
          <div className="space-y-2 text-xs">
            {acceptedSwaps.map((swap) => (
              <div
                key={swap.id}
                className="p-3 rounded-lg border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div>
                  <span className="font-semibold text-slate-900">{swap.requesterName}</span> swapped with{' '}
                  <span className="font-semibold text-teal-800">{swap.acceptedByName}</span> on{' '}
                  <strong className="text-slate-900">{swap.requesterShiftDate}</strong> ({swap.requesterShiftTime})
                </div>
                <StatusBadge status="Accepted" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Swap Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Post Shift Swap Request"
      >
        <form onSubmit={handleCreateSwap} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Shift Date to Swap
              </label>
              <input
                type="date"
                value={shiftDate}
                onChange={(e) => setShiftDate(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-teal-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Shift Timing
              </label>
              <select
                value={shiftTime}
                onChange={(e) => setShiftTime(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-teal-600 bg-white"
              >
                <option value="08:00 AM – 04:30 PM (Morning)">08:00 AM – 04:30 PM (Morning)</option>
                <option value="02:00 PM – 10:30 PM (Evening)">02:00 PM – 10:30 PM (Evening)</option>
                <option value="10:00 PM – 06:30 AM (Night)">10:00 PM – 06:30 AM (Night)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Qualified Role Needed
            </label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-teal-600"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Reason / Preferred Return Shift
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Urgent family obligation; willing to cover Saturday night shift in return."
              required
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-teal-600"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Post to Swap Board
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
