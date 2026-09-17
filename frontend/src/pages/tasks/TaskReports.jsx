import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  TrendingUp, 
  Users, 
  Calendar,
  CheckSquare
} from 'lucide-react';
import { fetchTaskReportsApi } from '../../api/hrmsApi';
import StatCard from '../../components/StatCard';
import { useHRMS } from '../../context/HRMSContext';

const TaskReports = () => {
  const { tasks, employees } = useHRMS();
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReports = async () => {
      try {
        const res = await fetchTaskReportsApi();
        if (res.success && res.data) {
          setReportData(res.data);
        }
      } catch (err) {
        console.warn('Error fetching task reports API:', err.message);
      } finally {
        setLoading(false);
      }
    };
    loadReports();
  }, [tasks]);

  const total = reportData?.total || tasks.length;
  const completed = reportData?.completed || tasks.filter(t => t.status === 'Completed').length;
  const inProgress = reportData?.inProgress || tasks.filter(t => t.status === 'In Progress').length;
  const pending = reportData?.pending || tasks.filter(t => t.status === 'Pending').length;
  const completionRate = reportData?.completionRate || (total > 0 ? Math.round((completed / total) * 100) : 0);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Task Analytics & Reports</h1>
        <p className="text-sm text-slate-500 mt-1">Real-time productivity insights across database employees</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard title="Total Tasks" value={total} icon={CheckSquare} color="primary" />
        <StatCard title="Completion Rate" value={`${completionRate}%`} icon={TrendingUp} color="success" />
        <StatCard title="In Progress" value={inProgress} icon={AlertCircle} color="info" />
        <StatCard title="Pending Review" value={pending} icon={Clock} color="warning" />
      </div>

      {/* Visual Progress Bar & Breakdown */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-slate-900">Overall Task Progress</h3>
        
        {/* Progress Bar */}
        <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden flex">
          <div style={{ width: `${total > 0 ? (completed / total) * 100 : 0}%` }} className="bg-emerald-500 transition-all duration-500" title={`Completed: ${completed}`} />
          <div style={{ width: `${total > 0 ? (inProgress / total) * 100 : 0}%` }} className="bg-amber-500 transition-all duration-500" title={`In Progress: ${inProgress}`} />
          <div style={{ width: `${total > 0 ? (pending / total) * 100 : 0}%` }} className="bg-rose-500 transition-all duration-500" title={`Pending: ${pending}`} />
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 flex-wrap text-sm text-slate-600 pt-2">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-emerald-500 shrink-0" />
            <span>Completed: <strong className="text-slate-900">{completed}</strong> ({total > 0 ? Math.round((completed/total)*100) : 0}%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-amber-500 shrink-0" />
            <span>In Progress: <strong className="text-slate-900">{inProgress}</strong> ({total > 0 ? Math.round((inProgress/total)*100) : 0}%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-rose-500 shrink-0" />
            <span>Pending: <strong className="text-slate-900">{pending}</strong> ({total > 0 ? Math.round((pending/total)*100) : 0}%)</span>
          </div>
        </div>
      </div>

      {/* Staff Task Allocation Table */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Users size={20} className="text-sky-500 shrink-0" />
          <span>PostgreSQL Staff Task Distribution</span>
        </h3>

        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Employee Name</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Designation</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Total Tasks</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Completed</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">In Progress</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Pending</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Completion Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {employees.map(emp => {
                const empTasks = tasks.filter(t => 
                  String(t.assignedTo) === String(emp.id) || 
                  t.assignedToEmpId === emp.employeeId
                );
                const empTotal = empTasks.length;
                const empDone = empTasks.filter(t => t.status === 'Completed').length;
                const empProg = empTasks.filter(t => t.status === 'In Progress').length;
                const empPend = empTasks.filter(t => t.status === 'Pending').length;
                const rate = empTotal > 0 ? Math.round((empDone / empTotal) * 100) : 0;

                return (
                  <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img 
                          src={emp.profilePhoto || emp.profile_photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'} 
                          alt={emp.fullName}
                          className="w-8 h-8 rounded-full object-cover shrink-0"
                        />
                        <div>
                          <div className="font-semibold text-slate-900">{emp.fullName}</div>
                          <div className="text-xs text-slate-500">{emp.employeeId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">{emp.designation}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900 text-center whitespace-nowrap">{empTotal}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-emerald-600 text-center whitespace-nowrap">{empDone}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-amber-600 text-center whitespace-nowrap">{empProg}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-rose-600 text-center whitespace-nowrap">{empPend}</td>
                    <td className="px-6 py-4 text-sm text-center whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        rate >= 75 ? 'bg-emerald-100 text-emerald-800' : rate >= 40 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {rate}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TaskReports;
