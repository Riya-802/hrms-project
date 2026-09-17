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
    <div className="task-reports-container">
      {/* Header */}
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <h1 className="page-title">Task Analytics & Reports</h1>
        <p className="page-subtitle">Real-time productivity insights across database employees</p>
      </div>

      {/* KPI Cards */}
      <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
        <StatCard title="Total Tasks" value={total} icon={CheckSquare} color="primary" />
        <StatCard title="Completion Rate" value={`${completionRate}%`} icon={TrendingUp} color="success" />
        <StatCard title="In Progress" value={inProgress} icon={AlertCircle} color="info" />
        <StatCard title="Pending Review" value={pending} icon={Clock} color="warning" />
      </div>

      {/* Visual Progress Bar & Breakdown */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>Overall Task Progress</h3>
        
        {/* Progress Bar */}
        <div style={{ width: '100%', height: '14px', background: '#e2e8f0', borderRadius: '7px', overflow: 'hidden', display: 'flex', marginBottom: '1rem' }}>
          <div style={{ width: `${total > 0 ? (completed / total) * 100 : 0}%`, background: '#10b981' }} title={`Completed: ${completed}`} />
          <div style={{ width: `${total > 0 ? (inProgress / total) * 100 : 0}%`, background: '#f59e0b' }} title={`In Progress: ${inProgress}`} />
          <div style={{ width: `${total > 0 ? (pending / total) * 100 : 0}%`, background: '#ef4444' }} title={`Pending: ${pending}`} />
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.875rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#10b981' }} />
            <span>Completed: <strong>{completed}</strong> ({total > 0 ? Math.round((completed/total)*100) : 0}%)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#f59e0b' }} />
            <span>In Progress: <strong>{inProgress}</strong> ({total > 0 ? Math.round((inProgress/total)*100) : 0}%)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#ef4444' }} />
            <span>Pending: <strong>{pending}</strong> ({total > 0 ? Math.round((pending/total)*100) : 0}%)</span>
          </div>
        </div>
      </div>

      {/* Staff Task Allocation Table */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Users size={20} color="#0ea5e9" />
          <span>PostgreSQL Staff Task Distribution</span>
        </h3>

        <div className="table-responsive">
          <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>Employee Name</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>Designation</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>Total Tasks</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>Completed</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>In Progress</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>Pending</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>Completion Rate</th>
              </tr>
            </thead>
            <tbody>
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
                  <tr key={emp.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.85rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img 
                        src={emp.profilePhoto || emp.profile_photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'} 
                        alt={emp.fullName}
                        style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontWeight: '600', color: '#0f172a' }}>{emp.fullName}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{emp.employeeId}</div>
                      </div>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: '#475569', fontSize: '0.875rem' }}>{emp.designation}</td>
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'center', fontWeight: '600' }}>{empTotal}</td>
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'center', color: '#10b981', fontWeight: '600' }}>{empDone}</td>
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'center', color: '#f59e0b', fontWeight: '600' }}>{empProg}</td>
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'center', color: '#ef4444', fontWeight: '600' }}>{empPend}</td>
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>
                      <span className={`status-badge ${rate >= 75 ? 'status-active' : rate >= 40 ? 'status-on-leave' : 'status-secondary'}`}>
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
