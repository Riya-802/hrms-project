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
    <div className="employee-page-container">
      <div className="emp-metrics-grid">
        <div className="emp-metric-card">
          <div className="metric-icon-box bg-blue">
            <Calendar size={22} color="#2563eb" />
          </div>
          <div className="metric-info">
            <span className="metric-label">Casual Leave Balance</span>
            <h3 className="metric-value">8 / 12 Days</h3>
            <span className="metric-subtext">4 Days Used</span>
          </div>
        </div>

        <div className="emp-metric-card">
          <div className="metric-icon-box bg-green">
            <Calendar size={22} color="#10b981" />
          </div>
          <div className="metric-info">
            <span className="metric-label">Sick Leave Balance</span>
            <h3 className="metric-value">5 / 7 Days</h3>
            <span className="metric-subtext">2 Days Used</span>
          </div>
        </div>

        <div className="emp-metric-card">
          <div className="metric-icon-box bg-purple">
            <Calendar size={22} color="#8b5cf6" />
          </div>
          <div className="metric-info">
            <span className="metric-label">Annual Vacation Leave</span>
            <h3 className="metric-value">14 / 15 Days</h3>
            <span className="metric-subtext">1 Day Used</span>
          </div>
        </div>
      </div>

      <div className="emp-card" style={{ marginTop: '1.5rem' }}>
        <div className="emp-card-header">
          <h3>My Leave Applications & History</h3>
          <button className="btn btn-primary" onClick={() => setShowApplyModal(true)}>
            <Plus size={16} />
            <span style={{ marginLeft: '0.4rem' }}>Apply for Leave</span>
          </button>
        </div>
        <div className="emp-card-body">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Leave Type</th>
                  <th>Dates Requested</th>
                  <th>Duration</th>
                  <th>Reason</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {myLeaveHistory.map((item) => (
                  <tr key={item.id}>
                    <td style={{ fontWeight: 600 }}>{item.type}</td>
                    <td>{item.dates}</td>
                    <td>{item.days} Day(s)</td>
                    <td>{item.reason}</td>
                    <td>
                      <span className={`badge ${
                        item.status === 'Approved' ? 'badge-success' : item.status === 'Pending' ? 'badge-warning' : 'badge-danger'
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
      </div>

      {showApplyModal && (
        <div className="modal-overlay" onClick={() => setShowApplyModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '450px' }}>
            <div className="modal-header">
              <h3>Apply for Leave</h3>
              <button className="toast-close" onClick={() => setShowApplyModal(false)}>✕</button>
            </div>
            <form onSubmit={handleApplyLeave} style={{ padding: '1.25rem' }}>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Leave Category</label>
                <select className="form-control" value={leaveType} onChange={(e) => setLeaveType(e.target.value)}>
                  <option value="Casual Leave">Casual Leave</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Annual Leave">Annual Leave</option>
                  <option value="Unpaid Leave">Unpaid Leave</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Start Date</label>
                  <input type="date" className="form-control" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">End Date</label>
                  <input type="date" className="form-control" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label">Reason for Request</label>
                <textarea className="form-control" rows={3} placeholder="Explain reason for leave..." value={reason} onChange={(e) => setReason(e.target.value)} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowApplyModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Submit Application</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeLeaves;
