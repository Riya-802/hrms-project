import React, { useState } from 'react';
import { 
  Clock, 
  Calendar, 
  CheckCircle2, 
  DollarSign, 
  FileText, 
  AlertCircle, 
  ChevronRight, 
  Sparkles, 
  Building2, 
  Mail, 
  Phone, 
  MapPin,
  Megaphone,
  Briefcase,
  Play,
  Square
} from 'lucide-react';
import { useHRMS, formatCurrency } from '../context/HRMSContext';

const EmployeeDashboard = () => {
  const { user, tasks, toggleTaskStatus, announcements, addToast } = useHRMS();
  const [isCheckedIn, setIsCheckedIn] = useState(true);
  const [checkInTime, setCheckInTime] = useState('08:52 AM');

  const empName = user?.fullName || 'Employee Member';
  const empId = user?.employeeId || 'EMP002';
  const empDept = user?.department || 'Engineering';
  const empDesignation = user?.designation || 'Senior Software Engineer';
  const empSalary = user?.salary ? formatCurrency(user.salary) : '$95,000 / yr';
  const photo = user?.profilePhoto || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256';

  const handleToggleCheckIn = () => {
    if (isCheckedIn) {
      setIsCheckedIn(false);
      addToast(`Checked out at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}. Have a good evening!`, 'info');
    } else {
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setIsCheckedIn(true);
      setCheckInTime(now);
      addToast(`Checked in successfully at ${now}. Welcome!`, 'success');
    }
  };

  const sampleTasks = tasks.length > 0 ? tasks : [
    { id: 1, title: 'Complete Q3 Code Review & PR Verification', status: 'Pending', dueDate: 'Today', priority: 'High' },
    { id: 2, title: 'Update HRMS API Documentation', status: 'Pending', dueDate: 'Tomorrow', priority: 'Medium' },
    { id: 3, title: 'Submit Monthly Expense Reimbursement Form', status: 'Completed', dueDate: 'Yesterday', priority: 'Normal' }
  ];

  const holidays = [
    { name: 'Gandhi Jayanti', date: 'Oct 02, 2026', day: 'Friday' },
    { name: 'Dussehra', date: 'Oct 20, 2026', day: 'Tuesday' },
    { name: 'Diwali Celebration', date: 'Nov 08, 2026', day: 'Sunday' },
    { name: 'Christmas Day', date: 'Dec 25, 2026', day: 'Friday' }
  ];

  return (
    <div className="employee-dashboard-container">
      {/* Top Banner Card */}
      <div className="emp-hero-card">
        <div className="emp-hero-content">
          <img src={photo} alt={empName} className="emp-hero-avatar" />
          <div className="emp-hero-details">
            <div className="emp-hero-badge">EMPLOYEE WORKSPACE</div>
            <h2>Welcome back, {empName}!</h2>
            <div className="emp-hero-meta">
              <span><Briefcase size={15} /> {empDesignation}</span>
              <span><Building2 size={15} /> {empDept}</span>
              <span><Sparkles size={15} /> ID: {empId}</span>
            </div>
          </div>
        </div>

        {/* Clock In/Out Action */}
        <div className="emp-clock-action">
          <div className="clock-status-pill">
            <span className={`status-indicator-dot ${isCheckedIn ? 'active' : 'inactive'}`} />
            <span>{isCheckedIn ? `Checked In (${checkInTime})` : 'Checked Out'}</span>
          </div>
          <button 
            className={`btn ${isCheckedIn ? 'btn-danger' : 'btn-primary'} emp-clock-btn`}
            onClick={handleToggleCheckIn}
          >
            {isCheckedIn ? <Square size={16} /> : <Play size={16} />}
            <span>{isCheckedIn ? 'Check Out Now' : 'Check In Now'}</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="emp-metrics-grid">
        <div className="emp-metric-card">
          <div className="metric-icon-box bg-blue">
            <Clock size={22} color="#2563eb" />
          </div>
          <div className="metric-info">
            <span className="metric-label">Today's Attendance</span>
            <h3 className="metric-value">{isCheckedIn ? 'Present' : 'Absent'}</h3>
            <span className="metric-subtext">Check in: {checkInTime}</span>
          </div>
        </div>

        <div className="emp-metric-card">
          <div className="metric-icon-box bg-green">
            <Calendar size={22} color="#10b981" />
          </div>
          <div className="metric-info">
            <span className="metric-label">Available Leave Balance</span>
            <h3 className="metric-value">27 Days</h3>
            <span className="metric-subtext">Casual: 8 | Sick: 5 | Annual: 14</span>
          </div>
        </div>

        <div className="emp-metric-card">
          <div className="metric-icon-box bg-purple">
            <CheckCircle2 size={22} color="#8b5cf6" />
          </div>
          <div className="metric-info">
            <span className="metric-label">Assigned Tasks</span>
            <h3 className="metric-value">{sampleTasks.filter(t => t.status === 'Pending').length} Pending</h3>
            <span className="metric-subtext">Total {sampleTasks.length} tasks active</span>
          </div>
        </div>

        <div className="emp-metric-card">
          <div className="metric-icon-box bg-amber">
            <DollarSign size={22} color="#d97706" />
          </div>
          <div className="metric-info">
            <span className="metric-label">Salary & Compensation</span>
            <h3 className="metric-value">{empSalary}</h3>
            <span className="metric-subtext">Next payout: Sept 30, 2026</span>
          </div>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="emp-main-grid">
        {/* Left Column: Tasks & Profile */}
        <div className="emp-column">
          {/* My Assigned Tasks */}
          <div className="emp-card">
            <div className="emp-card-header">
              <div className="card-title-group">
                <Briefcase size={18} color="#2563eb" />
                <h3>My Work & Deliverables</h3>
              </div>
              <span className="badge badge-info">{sampleTasks.length} Tasks</span>
            </div>
            <div className="emp-card-body">
              <div className="task-list">
                {sampleTasks.map((tItem) => (
                  <div key={tItem.id} className={`task-item ${tItem.status === 'Completed' ? 'completed' : ''}`}>
                    <input 
                      type="checkbox" 
                      checked={tItem.status === 'Completed'} 
                      onChange={() => toggleTaskStatus(tItem.id)}
                      className="task-checkbox"
                    />
                    <div className="task-details">
                      <div className="task-title">{tItem.title}</div>
                      <div className="task-meta">
                        <span className={`priority-tag priority-${(tItem.priority || 'Medium').toLowerCase()}`}>
                          {tItem.priority || 'Medium'} Priority
                        </span>
                        <span>Due: {tItem.dueDate || 'Today'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Personal Info */}
          <div className="emp-card">
            <div className="emp-card-header">
              <div className="card-title-group">
                <FileText size={18} color="#10b981" />
                <h3>Personal Record Details</h3>
              </div>
            </div>
            <div className="emp-card-body">
              <div className="emp-info-grid">
                <div className="info-item">
                  <Mail size={15} color="#64748b" />
                  <div>
                    <div className="info-label">Email Address</div>
                    <div className="info-val">{user?.email || 'employee@hrms.com'}</div>
                  </div>
                </div>
                <div className="info-item">
                  <Phone size={15} color="#64748b" />
                  <div>
                    <div className="info-label">Phone Number</div>
                    <div className="info-val">{user?.phone || '+1 555-0199'}</div>
                  </div>
                </div>
                <div className="info-item">
                  <Calendar size={15} color="#64748b" />
                  <div>
                    <div className="info-label">Joining Date</div>
                    <div className="info-val">{user?.joiningDate || '2022-06-10'}</div>
                  </div>
                </div>
                <div className="info-item">
                  <MapPin size={15} color="#64748b" />
                  <div>
                    <div className="info-label">Work Location</div>
                    <div className="info-val">Main HQ Office • Floor 4</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Announcements & Holidays */}
        <div className="emp-column">
          {/* Company Announcements */}
          <div className="emp-card">
            <div className="emp-card-header">
              <div className="card-title-group">
                <Megaphone size={18} color="#d97706" />
                <h3>Company Announcements</h3>
              </div>
            </div>
            <div className="emp-card-body">
              <div className="announcement-list">
                {announcements.length > 0 ? announcements.map((ann, i) => (
                  <div key={i} className="announcement-item">
                    <div className="announcement-date">{ann.date}</div>
                    <h4 className="announcement-title">{ann.title}</h4>
                    <p className="announcement-desc">{ann.description || ann.content}</p>
                  </div>
                )) : (
                  <>
                    <div className="announcement-item">
                      <div className="announcement-date">Today • 10:00 AM</div>
                      <h4 className="announcement-title">Annual Townhall & Q3 Performance Review</h4>
                      <p className="announcement-desc">All team members are invited to join the main conference room for our executive updates.</p>
                    </div>
                    <div className="announcement-item">
                      <div className="announcement-date">Yesterday</div>
                      <h4 className="announcement-title">New Health Insurance & Benefits Portal Active</h4>
                      <p className="announcement-desc">You can now submit healthcare claims directly through the HRMS documents portal.</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Upcoming Holidays */}
          <div className="emp-card">
            <div className="emp-card-header">
              <div className="card-title-group">
                <Calendar size={18} color="#8b5cf6" />
                <h3>Upcoming Public Holidays</h3>
              </div>
            </div>
            <div className="emp-card-body">
              <div className="holiday-list">
                {holidays.map((h, idx) => (
                  <div key={idx} className="holiday-item">
                    <div className="holiday-date-box">
                      <Calendar size={16} color="#475569" />
                      <span>{h.date}</span>
                    </div>
                    <div className="holiday-info">
                      <span className="holiday-name">{h.name}</span>
                      <span className="holiday-day">{h.day}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
