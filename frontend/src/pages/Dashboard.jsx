import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Building2, 
  UserPlus, 
  List, 
  Building,
  DollarSign,
  CalendarCheck,
  CheckSquare,
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  PieChart as PieChartIcon,
  Activity,
  Calendar,
  ChevronRight,
  Megaphone,
  Gift,
  Laptop,
  Plus,
  X,
  ExternalLink,
  MapPin,
  RotateCw
} from 'lucide-react';
import EmployeeTable from '../components/EmployeeTable';
import StatusBadge from '../components/StatusBadge';
import { useHRMS } from '../context/HRMSContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { 
    stats, 
    employees, 
    leaves, 
    tasks, 
    announcements, 
    milestones, 
    approveLeave, 
    rejectLeave, 
    toggleTaskStatus, 
    addAnnouncement,
    t,
    currentFormattedDate 
  } = useHRMS();

  // Modal State for Attendance Category View
  const [selectedCategoryModal, setSelectedCategoryModal] = useState(null); // 'inOffice', 'remote', 'leave', 'late'

  // Post Announcement State
  const [showAnnounceModal, setShowAnnounceModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('Event');

  const maxDeptPayroll = Math.max(...stats.departmentCounts.map((d) => d.payroll), 1);

  const handlePostAnnouncement = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addAnnouncement({
      title: newTitle,
      content: newContent || 'No details provided.',
      category: newCategory,
      priority: 'Normal'
    });
    setNewTitle('');
    setNewContent('');
    setShowAnnounceModal(false);
  };

  const getActiveModalCategoryData = () => {
    if (selectedCategoryModal === 'inOffice') {
      return {
        title: `Staff Currently In Office (${stats.inOfficeStaff.length})`,
        list: stats.inOfficeStaff,
        color: '#047857',
        bg: '#ecfdf5'
      };
    }
    if (selectedCategoryModal === 'remote') {
      return {
        title: `Staff Working Remotely (${stats.remoteStaff.length})`,
        list: stats.remoteStaff,
        color: '#1e40af',
        bg: '#eff6ff'
      };
    }
    if (selectedCategoryModal === 'leave') {
      return {
        title: `Staff On Approved Leave (${stats.onLeaveStaff.length})`,
        list: stats.onLeaveStaff,
        color: '#b45309',
        bg: '#fffbeb'
      };
    }
    if (selectedCategoryModal === 'late') {
      return {
        title: `Late Clock-in Records (0)`,
        list: stats.lateStaff,
        color: '#475569',
        bg: '#f1f5f9'
      };
    }
    return null;
  };

  const activeCategoryModalData = getActiveModalCategoryData();

  return (
    <div className="space-y-8">
      {/* 1. Executive Welcome Hero Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-200 backdrop-blur-xs">
              HRMS Admin Center
            </span>
            <span className="flex items-center gap-1.5 text-xs font-medium text-blue-300">
              <Activity size={14} className="text-blue-400" /> {t('systemOperational')}
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl text-white">{t('welcomeBack')}</h2>
          <p className="text-sm text-slate-300 max-w-xl">{t('realtimeOversight')}</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-xs font-semibold text-blue-100 backdrop-blur-xs border border-white/10">
            <Calendar size={18} className="text-blue-300" />
            <span>{currentFormattedDate}</span>
          </div>
        </div>
      </div>

      {/* 2. Interactive Workforce Attendance & Location Status Cards */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50/50">
          <div className="flex items-center gap-2 font-semibold text-slate-900 text-sm">
            <Activity size={18} className="text-blue-600" />
            <span>{t('todayWorkforceStatus')}</span>
          </div>
          <span className="text-xs font-medium text-slate-500">
            {t('clickCardRoster')}
          </span>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            
            {/* IN OFFICE CARD */}
            <div 
              onClick={() => setSelectedCategoryModal('inOffice')}
              className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 transition-all hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-emerald-700 shadow-xs border border-emerald-100">
                    <Building2 size={20} />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-emerald-700">{t('inOffice')}</div>
                    <div className="text-xl font-extrabold text-emerald-900">{stats.inOfficeStaff.length} Staff</div>
                  </div>
                </div>
                <ChevronRight size={18} className="text-emerald-700" />
              </div>

              {/* Avatar Stack preview */}
              <div className="flex items-center justify-between pt-3 border-t border-emerald-200/60">
                <div className="flex items-center">
                  {stats.inOfficeStaff.slice(0, 4).map((emp, i) => (
                    <img 
                      key={emp.id}
                      src={emp.profilePhoto} 
                      alt={emp.fullName}
                      className={`h-7 w-7 rounded-full border-2 border-white object-cover ${i > 0 ? '-ml-2' : ''}`}
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=256';
                      }}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-emerald-700">{t('whoIsHere')} &rarr;</span>
              </div>
            </div>

            {/* WORKING REMOTE CARD */}
            <div 
              onClick={() => setSelectedCategoryModal('remote')}
              className="rounded-xl border border-blue-200 bg-blue-50/70 p-4 transition-all hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-blue-700 shadow-xs border border-blue-100">
                    <Laptop size={20} />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-blue-700">{t('workingRemote')}</div>
                    <div className="text-xl font-extrabold text-blue-900">{stats.remoteStaff.length} Staff</div>
                  </div>
                </div>
                <ChevronRight size={18} className="text-blue-700" />
              </div>

              {/* Avatar Stack preview */}
              <div className="flex items-center justify-between pt-3 border-t border-blue-200/60">
                <div className="flex items-center">
                  {stats.remoteStaff.map((emp, i) => (
                    <img 
                      key={emp.id}
                      src={emp.profilePhoto} 
                      alt={emp.fullName}
                      className={`h-7 w-7 rounded-full border-2 border-white object-cover ${i > 0 ? '-ml-2' : ''}`}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-blue-700">{t('whoIsRemote')} &rarr;</span>
              </div>
            </div>

            {/* ON APPROVED LEAVE CARD */}
            <div 
              onClick={() => setSelectedCategoryModal('leave')}
              className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 transition-all hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-amber-700 shadow-xs border border-amber-100">
                    <CalendarCheck size={20} />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-amber-700">{t('onApprovedLeave')}</div>
                    <div className="text-xl font-extrabold text-amber-900">{stats.onLeaveStaff.length} Staff</div>
                  </div>
                </div>
                <ChevronRight size={18} className="text-amber-700" />
              </div>

              {/* Avatar Stack preview */}
              <div className="flex items-center justify-between pt-3 border-t border-amber-200/60">
                <div className="flex items-center">
                  {stats.onLeaveStaff.slice(0, 4).map((emp, i) => (
                    <img 
                      key={emp.id}
                      src={emp.profilePhoto} 
                      alt={emp.fullName}
                      className={`h-7 w-7 rounded-full border-2 border-white object-cover ${i > 0 ? '-ml-2' : ''}`}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-amber-700">{t('whoIsOnLeave')} &rarr;</span>
              </div>
            </div>

            {/* LATE CLOCK-INS CARD */}
            <div 
              onClick={() => setSelectedCategoryModal('late')}
              className="rounded-xl border border-slate-200 bg-slate-50 p-4 transition-all hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-slate-600 shadow-xs border border-slate-200">
                    <Clock size={20} />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500">{t('lateClockIns')}</div>
                    <div className="text-xl font-extrabold text-slate-900">0 Staff</div>
                  </div>
                </div>
                <ChevronRight size={18} className="text-slate-400" />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                <span className="text-xs font-bold text-emerald-600">✓ {t('allStaffOnTime')}</span>
                <span className="text-xs font-bold text-slate-500">Details &rarr;</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 3. Stat Cards Grid - 3-Column Equal Layout */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* Card 1 */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs font-medium text-slate-500">{t('totalEmployees')}</div>
              <div className="mt-1 text-2xl font-bold text-slate-900">{stats.totalEmployees}</div>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Users size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 font-semibold text-emerald-700">
              <TrendingUp size={12} /> +8.4%
            </span>
            <span className="text-slate-500">vs previous quarter</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs font-medium text-slate-500">{t('activeStaff')}</div>
              <div className="mt-1 text-2xl font-bold text-slate-900">{stats.activeEmployees}</div>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <UserCheck size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 font-semibold text-emerald-700">
              {stats.totalEmployees > 0 ? Math.round((stats.activeEmployees / stats.totalEmployees) * 100) : 0}% Active Rate
            </span>
            <span className="text-slate-500">{stats.inactiveEmployees} inactive</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs font-medium text-slate-500">{t('totalPayroll')}</div>
              <div className="mt-1 text-2xl font-bold text-slate-900">{stats.formattedTotalSalary}</div>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <DollarSign size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 font-semibold text-slate-700">
              Avg: {stats.formattedAvgSalary} / yr
            </span>
            <span className="text-slate-500">annual total</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs font-medium text-slate-500">{t('upcomingLeaves')}</div>
              <div className="mt-1 text-2xl font-bold text-slate-900">{stats.pendingLeavesCount} Requests</div>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <CalendarCheck size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 font-semibold text-amber-700">
              <Clock size={12} /> Action Needed
            </span>
            <span className="text-slate-500">pending approval</span>
          </div>
        </div>

        {/* Card 5 */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs font-medium text-slate-500">Pending HR Tasks</div>
              <div className="mt-1 text-2xl font-bold text-slate-900">{stats.pendingTasksCount} Tasks</div>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <CheckSquare size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 font-semibold text-slate-700">
              {tasks.filter((t) => t.priority === 'High').length} High Priority
            </span>
            <span className="text-slate-500">in pipeline</span>
          </div>
        </div>

        {/* Card 6 */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs font-medium text-slate-500">Total Departments</div>
              <div className="mt-1 text-2xl font-bold text-slate-900">{stats.totalDepartments} Units</div>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Building2 size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 font-semibold text-emerald-700">
              100% Operational
            </span>
            <span className="text-slate-500">active units</span>
          </div>
        </div>
      </div>

      {/* 4. Company Notice Board & Upcoming Milestones Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        
        {/* Company Announcements Card */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50/50">
            <div className="flex items-center gap-2 font-semibold text-slate-900 text-sm">
              <Megaphone size={18} className="text-blue-600" />
              <span>Company Notice Board & Broadcasts</span>
            </div>
            <button 
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer" 
              onClick={() => setShowAnnounceModal(true)}
            >
              <Plus size={14} /> Post Notice
            </button>
          </div>
          <div className="p-6 flex-1">
            <div className="space-y-4">
              {announcements.length > 0 ? (
                announcements.map((ann) => (
                  <div 
                    key={ann.id}
                    className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-900">
                        {ann.title}
                      </span>
                      <span 
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                          ann.category === 'Event' 
                            ? 'bg-blue-100 text-blue-800' 
                            : ann.category === 'Compliance' 
                            ? 'bg-amber-100 text-amber-800' 
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {ann.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {ann.content}
                    </p>
                    <div className="text-[11px] font-medium text-slate-400 pt-1">
                      Posted on: {ann.date}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-xs text-slate-500">
                  No company notices posted. Click "Post Notice" to broadcast an update.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Today Card */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50/50">
            <h3 className="text-base font-bold text-slate-900">{t('today')}</h3>
            <button className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 transition cursor-pointer" onClick={() => addToast('Today events refreshed.', 'info')} title="Refresh Today Events">
              <RotateCw size={16} />
            </button>
          </div>
          <div className="p-6 flex-1">
            <div className="space-y-4">
              {employees.filter(e => e.status === 'On Leave').length > 0 ? (
                employees.filter(e => e.status === 'On Leave').map((emp) => (
                  <div key={emp.id} className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/50 p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                        <Calendar size={18} />
                      </div>
                      <span className="text-sm font-medium text-slate-700">
                        {emp.fullName} is on approved leave today
                      </span>
                    </div>
                    <img 
                      src={emp.profilePhoto} 
                      alt={emp.fullName}
                      className="h-9 w-9 rounded-full object-cover border border-slate-200"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256';
                      }}
                    />
                  </div>
                ))
              ) : employees.length > 0 ? (
                employees.slice(0, 3).map((emp) => (
                  <div key={emp.id} className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/50 p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                        <UserCheck size={18} />
                      </div>
                      <span className="text-sm font-medium text-slate-700">
                        {emp.fullName} &bull; {emp.designation} ({emp.department})
                      </span>
                    </div>
                    <img 
                      src={emp.profilePhoto} 
                      alt={emp.fullName}
                      className="h-9 w-9 rounded-full object-cover border border-slate-200"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256';
                      }}
                    />
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-xs text-slate-500">
                  No active employee events scheduled for today.
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* 5. Quick Actions */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-200 px-6 py-4 bg-slate-50/50 font-semibold text-slate-900 text-sm">
          {t('quickActions')}
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div 
              className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-xs transition hover:-translate-y-0.5 hover:shadow-md hover:border-blue-200 cursor-pointer" 
              onClick={() => navigate('/admin/employees/add')}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md">
                <UserPlus size={22} />
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold text-slate-900">{t('addEmployee')}</div>
                <div className="text-xs text-slate-500">Register new staff member</div>
              </div>
              <ChevronRight size={18} className="text-slate-400" />
            </div>

            <div 
              className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-xs transition hover:-translate-y-0.5 hover:shadow-md hover:border-emerald-200 cursor-pointer" 
              onClick={() => navigate('/admin/employees')}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md">
                <List size={22} />
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold text-slate-900">{t('viewDirectory')}</div>
                <div className="text-xs text-slate-500">Browse employee roster</div>
              </div>
              <ChevronRight size={18} className="text-slate-400" />
            </div>

            <div 
              className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-xs transition hover:-translate-y-0.5 hover:shadow-md hover:border-purple-200 cursor-pointer" 
              onClick={() => navigate('/admin/departments')}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-600 text-white shadow-md">
                <Building size={22} />
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold text-slate-900">{t('manageDepartments')}</div>
                <div className="text-xs text-slate-500">Organize department teams</div>
              </div>
              <ChevronRight size={18} className="text-slate-400" />
            </div>
          </div>
        </div>
      </div>

      {/* 6. Visual Charts & Analytics Section */}
      <div className="space-y-1">
        <h2 className="text-lg font-bold text-slate-900">Analytics & Visual Reports</h2>
        <p className="text-xs text-slate-500">Workforce distribution, budget allocations, and key operational metrics</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        
        {/* Department Headcount Visual Donut Chart */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-200 px-6 py-4 bg-slate-50/50 flex items-center gap-2 font-semibold text-slate-900 text-sm">
            <PieChartIcon size={18} className="text-blue-600" />
            <span>Department Headcount Share</span>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between flex-wrap gap-6">
              <div className="relative h-36 w-36 shrink-0">
                <svg width="144" height="144" viewBox="0 0 42 42" className="donut">
                  <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#e2e8f0" strokeWidth="6" />
                  <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#2563eb" strokeWidth="6" strokeDasharray="40 60" strokeDashoffset="25" />
                  <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#10b981" strokeWidth="6" strokeDasharray="20 80" strokeDashoffset="85" />
                  <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#f59e0b" strokeWidth="6" strokeDasharray="18 82" strokeDashoffset="65" />
                  <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#8b5cf6" strokeWidth="6" strokeDasharray="12 88" strokeDashoffset="47" />
                  <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#ec4899" strokeWidth="6" strokeDasharray="10 90" strokeDashoffset="35" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-extrabold text-slate-900">{stats.totalEmployees}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Staff</span>
                </div>
              </div>

              <div className="flex-1 min-w-[180px] space-y-2.5">
                {stats.departmentCounts.map((dept, index) => {
                  const colors = ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#64748b'];
                  const color = colors[index % colors.length];
                  return (
                    <div key={dept.id} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
                        <span className="font-semibold text-slate-800">{dept.name}</span>
                      </div>
                      <span className="font-bold text-slate-500">{dept.employeeCount} staff</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Department Payroll Breakdown Chart */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-200 px-6 py-4 bg-slate-50/50 flex items-center gap-2 font-semibold text-slate-900 text-sm">
            <BarChart3 size={18} className="text-blue-600" />
            <span>Department Payroll Expenditure</span>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {stats.departmentCounts.map((dept) => {
                const percentage = Math.round((dept.payroll / maxDeptPayroll) * 100);
                return (
                  <div key={dept.id} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-800">{dept.name}</span>
                      <span className="text-blue-600 font-bold">{dept.formattedPayroll}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div 
                        className="h-full rounded-full bg-gradient-to-r from-blue-900 to-blue-600"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

      {/* 7. Pending Leaves & Pending Tasks Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        
        {/* Pending Leaves Card */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-200 px-6 py-4 bg-slate-50/50 flex items-center gap-2 font-semibold text-slate-900 text-sm">
            <Clock size={18} className="text-amber-500" />
            <span>Pending Leave Requests ({leaves.filter((l) => l.status === 'Pending').length})</span>
          </div>
          <div className="p-6">
            {leaves.filter((l) => l.status === 'Pending').length > 0 ? (
              <div className="space-y-3">
                {leaves
                  .filter((l) => l.status === 'Pending')
                  .map((leave) => (
                    <div 
                      key={leave.id}
                      className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <div className="space-y-0.5">
                        <div className="font-bold text-sm text-slate-900">
                          {leave.employeeName}
                        </div>
                        <div className="text-xs text-slate-600">
                          {leave.leaveType} &bull; <strong>{leave.days} day(s)</strong> ({leave.startDate} to {leave.endDate})
                        </div>
                        <div className="text-xs text-slate-500 italic">
                          "{leave.reason}"
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button 
                          className="rounded-lg p-2 text-emerald-600 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition cursor-pointer" 
                          title="Approve Leave"
                          onClick={() => approveLeave(leave.id)}
                        >
                          <CheckCircle2 size={18} />
                        </button>
                        <button 
                          className="rounded-lg p-2 text-red-600 bg-red-50 border border-red-200 hover:bg-red-100 transition cursor-pointer" 
                          title="Reject Leave"
                          onClick={() => rejectLeave(leave.id)}
                        >
                          <XCircle size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8 text-xs text-slate-500">
                No pending leave requests at this time.
              </div>
            )}
          </div>
        </div>

        {/* Pending HR Tasks Card */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-200 px-6 py-4 bg-slate-50/50 flex items-center gap-2 font-semibold text-slate-900 text-sm">
            <CheckSquare size={18} className="text-blue-600" />
            <span>Administrative Task Pipeline</span>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {tasks.map((task) => (
                <div 
                  key={task.id}
                  onClick={() => toggleTaskStatus(task.id)}
                  className={`flex items-center justify-between rounded-xl border p-3.5 transition cursor-pointer ${
                    task.status === 'Completed' 
                      ? 'border-slate-200 bg-slate-50 opacity-60' 
                      : 'border-slate-200 bg-white hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      checked={task.status === 'Completed'} 
                      onChange={() => {}} 
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <div>
                      <div className={`text-xs font-bold text-slate-900 ${task.status === 'Completed' ? 'line-through text-slate-400' : ''}`}>
                        {task.title}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Due: {task.dueDate} &bull; Assigned: {task.assignedTo}
                      </div>
                    </div>
                  </div>

                  <span 
                    className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                      task.priority === 'High' 
                        ? 'bg-red-100 text-red-700' 
                        : task.priority === 'Medium' 
                        ? 'bg-amber-100 text-amber-700' 
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* 8. Recent Employees Directory */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Recent Employees Roster</h2>
          <p className="text-xs text-slate-500">Latest staff members onboarded into the HRMS database</p>
        </div>
        <button 
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer" 
          onClick={() => navigate('/admin/employees')}
        >
          View Full Directory
        </button>
      </div>

      <EmployeeTable employees={employees.slice(0, 5)} />

      {/* Attendance Category Roster Modal */}
      {selectedCategoryModal && activeCategoryModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs" onClick={() => setSelectedCategoryModal(null)}>
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className={`flex items-center justify-between border-b border-slate-200 px-6 py-4 ${activeCategoryModalData.bg}`}>
              <h3 className="text-sm font-bold text-slate-900">{activeCategoryModalData.title}</h3>
              <button className="rounded-lg p-1 text-slate-400 hover:text-slate-600 hover:bg-white/50 transition cursor-pointer" onClick={() => setSelectedCategoryModal(null)}>
                <X size={18} />
              </button>
            </div>
            <div className="p-6 max-h-[420px] overflow-y-auto space-y-3">
              {activeCategoryModalData.list.length > 0 ? (
                activeCategoryModalData.list.map((emp) => (
                  <div 
                    key={emp.id}
                    className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-3 shadow-xs"
                  >
                    <div className="flex items-center gap-3">
                      <img 
                        src={emp.profilePhoto} 
                        alt={emp.fullName}
                        className="h-10 w-10 rounded-full object-cover border border-slate-200"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=256';
                        }}
                      />
                      <div>
                        <div className="text-sm font-bold text-slate-900">
                          {emp.fullName}
                        </div>
                        <div className="text-xs text-slate-500">
                          {emp.designation} &bull; <strong>{emp.department}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800">
                        {emp.time ? `Clocked in: ${emp.time}` : emp.leaveType ? emp.leaveType : emp.status}
                      </span>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        ID: {emp.id}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-xs text-slate-500">
                  No employees in this category today.
                </div>
              )}
            </div>
            <div className="flex justify-end border-t border-slate-200 bg-slate-50 px-6 py-3">
              <button className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition cursor-pointer" onClick={() => setSelectedCategoryModal(null)}>
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Post Announcement Modal */}
      {showAnnounceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs" onClick={() => setShowAnnounceModal(false)}>
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900">Post Company Notice / Broadcast</h3>
              <button className="rounded-lg p-1 text-slate-400 hover:text-slate-600 transition cursor-pointer" onClick={() => setShowAnnounceModal(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handlePostAnnouncement}>
              <div className="p-6 space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-700">Announcement Title <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20" 
                    placeholder="e.g. Q4 Company All-Hands Meeting" 
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-700">Category</label>
                  <select 
                    className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 bg-white"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                  >
                    <option value="Event">Event</option>
                    <option value="Compliance">Compliance & Policy</option>
                    <option value="Holiday">Holiday & Closure</option>
                    <option value="General">General Notice</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-700">Announcement Details</label>
                  <textarea 
                    rows="3"
                    className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20" 
                    placeholder="Write announcement details..." 
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-3">
                <button type="button" className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition cursor-pointer" onClick={() => setShowAnnounceModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition cursor-pointer">
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
