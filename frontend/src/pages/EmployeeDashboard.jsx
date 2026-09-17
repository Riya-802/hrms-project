import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Calendar, 
  CheckCircle2, 
  DollarSign, 
  FileText, 
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
import { fetchEmployeeSelfDashboardApi } from '../api/hrmsApi';

const EmployeeDashboard = () => {
  const { user, tasks, toggleTaskStatus, announcements, addToast } = useHRMS();
  const [dbData, setDbData] = useState(null);
  const [isCheckedIn, setIsCheckedIn] = useState(true);
  const [checkInTime, setCheckInTime] = useState('08:52 AM');

  useEffect(() => {
    const loadDbDashboard = async () => {
      try {
        const res = await fetchEmployeeSelfDashboardApi();
        if (res.success && res.data) {
          setDbData(res.data);
        }
      } catch (err) {
        console.warn('Using context user state for dashboard:', err.message);
      }
    };
    loadDbDashboard();
  }, []);

  const activeEmp = dbData || user || {};

  const empName = activeEmp.fullName || activeEmp.full_name || 'Employee Member';
  const empId = activeEmp.employeeId || activeEmp.employee_id || 'EMP001';
  const empDept = activeEmp.department || activeEmp.department_name || 'Engineering';
  const empDesignation = activeEmp.designation || 'Staff Engineer';
  const rawSalary = activeEmp.salary ? activeEmp.salary : '95000';
  const empSalary = formatCurrency(rawSalary);
  const photo = activeEmp.profilePhoto || activeEmp.profile_photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256';

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
    <div className="space-y-6">
      {/* Top Banner Card */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <img 
            src={photo} 
            alt={empName} 
            className="h-20 w-20 rounded-full border-4 border-white/20 object-cover shadow-lg" 
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256';
            }}
          />
          <div className="space-y-1.5">
            <span className="inline-block rounded-full bg-white/10 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-200">
              EMPLOYEE WORKSPACE
            </span>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl text-white">Welcome back, {empName}!</h2>
            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-300 pt-1">
              <span className="flex items-center gap-1.5"><Briefcase size={15} className="text-blue-400" /> {empDesignation}</span>
              <span className="flex items-center gap-1.5"><Building2 size={15} className="text-blue-400" /> {empDept}</span>
              <span className="flex items-center gap-1.5"><Sparkles size={15} className="text-blue-400" /> ID: {empId}</span>
            </div>
          </div>
        </div>

        {/* Clock In/Out Action */}
        <div className="flex flex-col items-start sm:items-end gap-3 pt-4 md:pt-0 border-t border-slate-800 md:border-t-0">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-800/80 px-3.5 py-1.5 text-xs font-semibold text-slate-200 border border-slate-700">
            <span className={`h-2 w-2 rounded-full ${isCheckedIn ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
            <span>{isCheckedIn ? `Checked In (${checkInTime})` : 'Checked Out'}</span>
          </div>
          <button 
            className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold shadow-lg transition cursor-pointer ${
              isCheckedIn 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-blue-600 hover:bg-blue-500 text-white'
            }`}
            onClick={handleToggleCheckIn}
          >
            {isCheckedIn ? <Square size={16} /> : <Play size={16} />}
            <span>{isCheckedIn ? 'Check Out Now' : 'Check In Now'}</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
            <Clock size={22} />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-500">Today's Attendance</span>
            <h3 className="text-lg font-bold text-slate-900">{isCheckedIn ? 'Present' : 'Absent'}</h3>
            <span className="text-[11px] text-slate-400">Check in: {checkInTime}</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
            <Calendar size={22} />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-500">Available Leave Balance</span>
            <h3 className="text-lg font-bold text-slate-900">27 Days</h3>
            <span className="text-[11px] text-slate-400">Casual: 8 | Sick: 5 | Annual: 14</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
            <CheckCircle2 size={22} />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-500">Assigned Tasks</span>
            <h3 className="text-lg font-bold text-slate-900">{sampleTasks.filter(t => t.status === 'Pending').length} Pending</h3>
            <span className="text-[11px] text-slate-400">Total {sampleTasks.length} tasks active</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
            <DollarSign size={22} />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-500">Salary & Compensation</span>
            <h3 className="text-lg font-bold text-slate-900">{empSalary}</h3>
            <span className="text-[11px] text-slate-400">Next payout: Sept 30, 2026</span>
          </div>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left Column: Tasks & Profile */}
        <div className="space-y-6">
          {/* My Assigned Tasks */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50/50">
              <div className="flex items-center gap-2 font-semibold text-slate-900 text-sm">
                <Briefcase size={18} className="text-blue-600" />
                <h3>My Work & Deliverables</h3>
              </div>
              <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-800">
                {sampleTasks.length} Tasks
              </span>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {sampleTasks.map((tItem) => (
                  <div 
                    key={tItem.id} 
                    className={`flex items-start gap-3 rounded-xl border p-3.5 transition ${
                      tItem.status === 'Completed' 
                        ? 'border-slate-200 bg-slate-50 opacity-60' 
                        : 'border-slate-200 bg-white hover:border-blue-300'
                    }`}
                  >
                    <input 
                      type="checkbox" 
                      checked={tItem.status === 'Completed'} 
                      onChange={() => toggleTaskStatus(tItem.id)}
                      className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <div className="flex-1 space-y-1">
                      <div className={`text-xs font-bold text-slate-900 ${tItem.status === 'Completed' ? 'line-through text-slate-400' : ''}`}>
                        {tItem.title}
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-slate-500">
                        <span className={`font-semibold ${
                          tItem.priority === 'High' ? 'text-red-600' : tItem.priority === 'Medium' ? 'text-amber-600' : 'text-slate-600'
                        }`}>
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
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 px-6 py-4 bg-slate-50/50 flex items-center gap-2 font-semibold text-slate-900 text-sm">
              <FileText size={18} className="text-emerald-600" />
              <h3>Personal Record Details</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3">
                  <Mail size={16} className="text-slate-400" />
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Email Address</div>
                    <div className="text-xs font-semibold text-slate-900">{activeEmp.email || 'employee@company.com'}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3">
                  <Phone size={16} className="text-slate-400" />
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Phone Number</div>
                    <div className="text-xs font-semibold text-slate-900">{activeEmp.phone || '+91 98765 43210'}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3">
                  <Calendar size={16} className="text-slate-400" />
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Joining Date</div>
                    <div className="text-xs font-semibold text-slate-900">{activeEmp.joiningDate ? String(activeEmp.joiningDate).split('T')[0] : '2022-03-15'}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3">
                  <MapPin size={16} className="text-slate-400" />
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Work Location</div>
                    <div className="text-xs font-semibold text-slate-900">{activeEmp.address || 'Main HQ Office • Floor 4'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Announcements & Holidays */}
        <div className="space-y-6">
          {/* Company Announcements */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 px-6 py-4 bg-slate-50/50 flex items-center gap-2 font-semibold text-slate-900 text-sm">
              <Megaphone size={18} className="text-amber-500" />
              <h3>Company Announcements</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {announcements.length > 0 ? announcements.map((ann, i) => (
                  <div key={i} className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-1">
                    <div className="text-[11px] font-semibold text-amber-700">{ann.date}</div>
                    <h4 className="text-sm font-bold text-slate-900">{ann.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{ann.description || ann.content}</p>
                  </div>
                )) : (
                  <>
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-1">
                      <div className="text-[11px] font-semibold text-amber-700">Today • 10:00 AM</div>
                      <h4 className="text-sm font-bold text-slate-900">Annual Townhall & Q3 Performance Review</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">All team members are invited to join the main conference room for executive updates.</p>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-1">
                      <div className="text-[11px] font-semibold text-amber-700">Yesterday</div>
                      <h4 className="text-sm font-bold text-slate-900">New Health Insurance & Benefits Portal Active</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">You can now submit healthcare claims directly through the HRMS documents portal.</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Upcoming Holidays */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 px-6 py-4 bg-slate-50/50 flex items-center gap-2 font-semibold text-slate-900 text-sm">
              <Calendar size={18} className="text-purple-600" />
              <h3>Upcoming Public Holidays</h3>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {holidays.map((h, idx) => (
                  <div key={idx} className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 p-3">
                    <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-700">
                      <Calendar size={16} className="text-slate-400" />
                      <span>{h.date}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-slate-900">{h.name}</div>
                      <div className="text-[10px] text-slate-500">{h.day}</div>
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
