import React, { useState } from 'react';
import { Calendar, Plus, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { useHRMS } from '../../context/HRMSContext';

const EmployeeLeaves = () => {
  const { addToast } = useHRMS();
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [leaveType, setLeaveType] = useState('Casual Leave');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');

  const [myLeaveHistory, setMyLeaveHistory] = useState([
    { id: 1, type: 'Casual Leave', dates: 'Aug 14 - Aug 15, 2026', days: 2, status: 'Approved', reason: 'Personal family event' },
    { id: 2, type: 'Sick Leave', dates: 'Jul 02, 2026', days: 1, status: 'Approved', reason: 'Medical appointment' },
    { id: 3, type: 'Annual Leave', dates: 'Oct 24 - Oct 28, 2026', days: 5, status: 'Pending', reason: 'Vacation trip' }
  ]);

  const handleApplyLeave = (e) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      addToast('Please select start and end dates.', 'danger');
      return;
    }
    const newEntry = {
      id: Date.now(),
      type: leaveType,
      dates: `${startDate} - ${endDate}`,
      days: 3,
      status: 'Pending',
      reason: reason || 'Personal reasons'
    };
    setMyLeaveHistory([newEntry, ...myLeaveHistory]);
    setShowApplyModal(false);
    addToast('Leave request submitted successfully for approval.', 'success');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
            <Calendar size={22} />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-500">Casual Leave Balance</span>
            <h3 className="text-lg font-bold text-slate-900">8 / 12 Days</h3>
            <span className="text-[11px] text-slate-400">4 Days Used</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
            <Calendar size={22} />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-500">Sick Leave Balance</span>
            <h3 className="text-lg font-bold text-slate-900">5 / 7 Days</h3>
            <span className="text-[11px] text-slate-400">2 Days Used</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
            <Calendar size={22} />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-500">Annual Vacation Leave</span>
            <h3 className="text-lg font-bold text-slate-900">14 / 15 Days</h3>
            <span className="text-[11px] text-slate-400">1 Day Used</span>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50/50">
          <h3 className="font-semibold text-slate-900 text-sm">My Leave Applications & History</h3>
          <button 
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition cursor-pointer" 
            onClick={() => setShowApplyModal(true)}
          >
            <Plus size={16} />
            <span>Apply for Leave</span>
          </button>
        </div>
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                <th className="px-6 py-3.5">Leave Type</th>
                <th className="px-6 py-3.5">Dates Requested</th>
                <th className="px-6 py-3.5">Duration</th>
                <th className="px-6 py-3.5">Reason</th>
                <th className="px-6 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {myLeaveHistory.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-6 py-3.5 font-semibold text-slate-900">{item.type}</td>
                  <td className="px-6 py-3.5 text-slate-600">{item.dates}</td>
                  <td className="px-6 py-3.5 text-slate-600">{item.days} Day(s)</td>
                  <td className="px-6 py-3.5 text-slate-600 max-w-[280px]">{item.reason}</td>
                  <td className="px-6 py-3.5">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      item.status === 'Approved' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : item.status === 'Pending' 
                        ? 'bg-amber-100 text-amber-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs" onClick={() => setShowApplyModal(false)}>
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900">Apply for Leave</h3>
              <button className="rounded-lg p-1 text-slate-400 hover:text-slate-600 transition cursor-pointer" onClick={() => setShowApplyModal(false)}>✕</button>
            </div>
            <form onSubmit={handleApplyLeave} className="p-6 space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700">Leave Category</label>
                <select 
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 bg-white" 
                  value={leaveType} 
                  onChange={(e) => setLeaveType(e.target.value)}
                >
                  <option value="Casual Leave">Casual Leave</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Annual Leave">Annual Leave</option>
                  <option value="Unpaid Leave">Unpaid Leave</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-700">Start Date</label>
                  <input type="date" className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-700">End Date</label>
                  <input type="date" className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700">Reason for Request</label>
                <textarea className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20" rows={3} placeholder="Explain reason for leave..." value={reason} onChange={(e) => setReason(e.target.value)} />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button type="button" className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer" onClick={() => setShowApplyModal(false)}>Cancel</button>
                <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition cursor-pointer">Submit Application</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeLeaves;
