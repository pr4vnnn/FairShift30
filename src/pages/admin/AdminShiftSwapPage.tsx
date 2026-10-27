import React, { useState, useEffect } from 'react';
import { StorageService } from '../../services/storage';
import { ShiftSwapRequest } from '../../types';
import {
  ArrowLeftRight,
  Calendar,
  Clock,
  User,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Card, StatusBadge, EmptyState } from '../../components/common/UIComponents';

export const AdminShiftSwapPage: React.FC = () => {
  const [swaps, setSwaps] = useState<ShiftSwapRequest[]>([]);

  useEffect(() => {
    setSwaps(StorageService.getShiftSwaps());
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">ShiftSwap Supervisory Review</h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Monitor peer shift exchanges to ensure role qualifications and rest periods are respected.
        </p>
      </div>

      <Card>
        <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
          <ArrowLeftRight className="w-4 h-4 text-teal-700" />
          <span>All Workforce Shift Exchanges ({swaps.length})</span>
        </h3>

        {swaps.length === 0 ? (
          <EmptyState
            title="No shift swaps logged"
            description="No shift swap requests have been initiated in this period."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Requester</th>
                  <th className="py-3 px-4">Shift Date & Time</th>
                  <th className="py-3 px-4">Target Role Scope</th>
                  <th className="py-3 px-4">Reason</th>
                  <th className="py-3 px-4">Accepted By</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {swaps.map((swap) => (
                  <tr key={swap.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">{swap.requesterName}</td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{swap.requesterShiftDate}</div>
                      <div className="text-[11px] text-slate-500">{swap.requesterShiftTime}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-700">{swap.targetRole}</td>
                    <td className="py-3 px-4 text-slate-600 max-w-xs truncate" title={swap.reason}>
                      {swap.reason}
                    </td>
                    <td className="py-3 px-4">
                      {swap.acceptedByName ? (
                        <span className="font-semibold text-teal-800">{swap.acceptedByName}</span>
                      ) : (
                        <span className="text-slate-400 italic">Open / Unclaimed</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={swap.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};
