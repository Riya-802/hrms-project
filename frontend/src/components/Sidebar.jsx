import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  Settings, 
  LogOut,
  ShieldCheck,
  UserCheck,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles,
  ChevronDown,
  ChevronRight,
  Clock,
  Calendar,
  Briefcase,
  DollarSign,
  FileText,
  Bell,
  Award,
  BarChart3,
  Megaphone,
  User,
  CheckSquare
} from 'lucide-react';
import { useHRMS } from '../context/HRMSContext';

const Sidebar = ({ portalType }) => {
  const { 
    user,
    userRole,
    logout,
    addToast, 
    openModal, 
    isMobileSidebarOpen, 
    closeMobileSidebar,
    isSidebarCollapsed,
    toggleSidebarCollapse,
    t 
  } = useHRMS();

  const location = useLocation();
  const navigate = useNavigate();

  const activePortal = portalType || userRole || 'admin';
  const isAdmin = activePortal === 'admin';

  const [openSubmenus, setOpenSubmenus] = useState({
    employees: true,
    departments: true,
    tasks: true,
    profile: true,
    attendance: false,
    leaves: false,
    payroll: false,
    work: false,
    performance: false,
    reports: false,
    documents: false
  });

  const toggleSubmenu = (key) => {
    setOpenSubmenus(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleLogoutClick = (e) => {
    e.preventDefault();
    closeMobileSidebar();
    openModal({
      title: isAdmin ? 'Admin Logout' : 'Employee Logout',
      message: `Are you sure you want to log out of the HRMS ${isAdmin ? 'Admin' : 'Employee'} Portal?`,
      confirmText: t('logout') || 'Logout',
      onConfirm: () => {
        logout();
        addToast('You have been logged out.', 'info');
        navigate('/login');
      },
      type: 'danger'
    });
  };

  const adminMenu = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      path: '/admin/dashboard'
    },
    {
      key: 'employees',
      title: 'Employees',
      icon: Users,
      children: [
        { title: 'All Employees', path: '/admin/employees' },
        { title: 'Add Employee', path: '/admin/employees/add' }
      ]
    },
    {
      key: 'departments',
      title: 'Departments',
      icon: Building2,
      children: [
        { title: 'All Departments', path: '/admin/departments' },
        { title: 'Add Department', path: '/admin/departments/add' }
      ]
    },
    {
      key: 'tasks',
      title: 'Task Management',
      icon: CheckSquare,
      children: [
        { title: 'All Tasks', path: '/admin/tasks' },
        { title: 'Create Task', path: '/admin/tasks/create' },
        { title: 'Assigned Tasks', path: '/admin/tasks/assigned' },
        { title: 'Pending Tasks', path: '/admin/tasks/pending' },
        { title: 'In Progress', path: '/admin/tasks/in-progress' },
        { title: 'Completed', path: '/admin/tasks/completed' },
        { title: 'Task Reports', path: '/admin/tasks/reports' }
      ]
    },
    {
      key: 'attendance',
      title: 'Attendance',
      icon: Clock,
      children: [
        { title: 'Attendance Overview', path: '/admin/attendance' },
        { title: 'Daily Attendance', path: '/admin/attendance/daily' },
        { title: 'Attendance Reports', path: '/admin/attendance/reports' }
      ]
    },
    {
      key: 'leaves',
      title: 'Leave Management',
      icon: Calendar,
      children: [
        { title: 'Leave Requests', path: '/admin/leaves' },
        { title: 'Approved Leaves', path: '/admin/leaves/approved' },
        { title: 'Rejected Leaves', path: '/admin/leaves/rejected' }
      ]
    },
    {
      key: 'payroll',
      title: 'Payroll',
      icon: DollarSign,
      children: [
        { title: 'Salary Management', path: '/admin/payroll' },
        { title: 'Payslips', path: '/admin/payroll/payslips' },
        { title: 'Wallet', path: '/admin/payroll/wallet' }
      ]
    },
    {
      key: 'performance',
      title: 'Performance',
      icon: Award,
      children: [
        { title: 'Employee Performance', path: '/admin/performance' },
        { title: 'Reviews', path: '/admin/performance/reviews' }
      ]
    },
    {
      key: 'reports',
      title: 'Reports',
      icon: BarChart3,
      children: [
        { title: 'Employee Reports', path: '/admin/reports/employees' },
        { title: 'Attendance Reports', path: '/admin/reports/attendance' },
        { title: 'Payroll Reports', path: '/admin/reports/payroll' }
      ]
    },
    {
      title: 'Announcements',
      icon: Megaphone,
      path: '/admin/announcements'
    }
  ];

  const employeeMenu = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      path: '/employee/dashboard'
    },
    {
      key: 'profile',
      title: 'My Profile',
      icon: User,
      children: [
        { title: 'Personal Information', path: '/employee/profile' },
        { title: 'Job Information', path: '/employee/profile/job' },
        { title: 'Contact Details', path: '/employee/profile/contact' }
      ]
    },
    {
      key: 'attendance',
      title: 'Attendance',
      icon: Clock,
      children: [
        { title: "Today's Attendance", path: '/employee/attendance' },
        { title: 'Check In / Out', path: '/employee/attendance/clock' },
        { title: 'Attendance History', path: '/employee/attendance/history' }
      ]
    },
    {
      key: 'leaves',
      title: 'Leave Management',
      icon: Calendar,
      children: [
        { title: 'Apply Leave', path: '/employee/leaves/apply' },
        { title: 'My Leaves', path: '/employee/leaves' },
        { title: 'Leave Balance', path: '/employee/leaves/balance' }
      ]
    },
    {
      key: 'tasks',
      title: 'Task Management',
      icon: CheckSquare,
      children: [
        { title: 'All Tasks', path: '/employee/tasks' },
        { title: 'Create Task', path: '/employee/tasks/create' },
        { title: 'Assigned Tasks', path: '/employee/tasks/assigned' },
        { title: 'Pending Tasks', path: '/employee/tasks/pending' },
        { title: 'In Progress', path: '/employee/tasks/in-progress' },
        { title: 'Completed', path: '/employee/tasks/completed' },
        { title: 'Task Reports', path: '/employee/tasks/reports' }
      ]
    },
    {
      key: 'payroll',
      title: 'Payroll',
      icon: DollarSign,
      children: [
        { title: 'Salary Overview', path: '/employee/payroll' },
        { title: 'Payslips', path: '/employee/payroll/payslips' },
        { title: 'Wallet', path: '/employee/payroll/wallet' }
      ]
    },
    {
      key: 'documents',
      title: 'Documents',
      icon: FileText,
      children: [
        { title: 'Company Documents', path: '/employee/documents' },
        { title: 'My Documents', path: '/employee/documents/mine' }
      ]
    },
    {
      title: 'Holidays',
      icon: Calendar,
      path: '/employee/holidays'
    },
    {
      title: 'Notifications',
      icon: Bell,
      path: '/employee/notifications'
    }
  ];

  const currentMenuItems = isAdmin ? adminMenu : employeeMenu;

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-40 lg:hidden transition-opacity" 
          onClick={closeMobileSidebar} 
        />
      )}

      <aside className={`fixed lg:sticky top-0 left-0 h-screen z-50 flex flex-col shrink-0 bg-gradient-to-b from-[#0b1329] via-[#111c38] to-[#1e293b] text-slate-100 border-r border-slate-800/80 shadow-2xl transition-all duration-300 ${
        isSidebarCollapsed ? 'w-20' : 'w-64'
      } ${
        isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-blue-500 flex items-center justify-center text-white font-extrabold text-lg shadow-lg shadow-blue-600/30 shrink-0">
              {isAdmin ? <ShieldCheck size={22} className="text-sky-300" /> : <UserCheck size={22} className="text-emerald-300" />}
            </div>
            {!isSidebarCollapsed && (
              <div>
                <div className="text-lg font-extrabold tracking-tight text-white leading-none">HRMS</div>
                <div className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${isAdmin ? 'text-sky-400' : 'text-emerald-400'}`}>
                  {isAdmin ? 'ADMIN PORTAL' : 'EMPLOYEE PORTAL'}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button 
              className="w-8 h-8 rounded-lg bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700/50 flex items-center justify-center text-slate-400 hover:text-white transition"
              onClick={toggleSidebarCollapse}
              title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {isSidebarCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
            </button>
            <button 
              className="lg:hidden p-1.5 text-slate-400 hover:text-white"
              onClick={closeMobileSidebar}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* User Info Quick Card */}
        {!isSidebarCollapsed && user && (
          <div className="flex items-center gap-3 p-3 mx-3 my-3 bg-slate-800/40 rounded-xl border border-slate-700/40">
            <img 
              src={user.profilePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'} 
              alt={user.fullName} 
              className="w-9 h-9 rounded-full object-cover shrink-0 border border-slate-600"
            />
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-white truncate">{user.fullName}</div>
              <div className="text-[11px] text-slate-400 truncate">{user.designation || (isAdmin ? 'System Admin' : 'Employee')}</div>
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          {!isSidebarCollapsed && (
            <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 px-3 py-2">
              {isAdmin ? 'ADMIN NAVIGATION' : 'EMPLOYEE MENU'}
            </div>
          )}
          
          {currentMenuItems.map((item, idx) => {
            const Icon = item.icon;

            if (item.children) {
              const isOpen = openSubmenus[item.key];
              const isChildActive = item.children.some(c => location.pathname === c.path);

              return (
                <div key={item.key || idx} className="space-y-1">
                  <button
                    onClick={() => toggleSubmenu(item.key)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition ${
                      isChildActive 
                        ? 'text-sky-400 bg-sky-950/30 border border-sky-800/30' 
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                    title={isSidebarCollapsed ? item.title : ''}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={19} className={isChildActive ? 'text-sky-400' : 'text-slate-400'} />
                      {!isSidebarCollapsed && <span>{item.title}</span>}
                    </div>
                    {!isSidebarCollapsed && (
                      isOpen ? <ChevronDown size={15} /> : <ChevronRight size={15} />
                    )}
                  </button>

                  {!isSidebarCollapsed && isOpen && (
                    <div className="ml-4 pl-3 border-l border-slate-800 space-y-1 my-1">
                      {item.children.map((child, cIdx) => (
                        <NavLink
                          key={cIdx}
                          to={child.path}
                          onClick={closeMobileSidebar}
                          className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition ${
                            isActive 
                              ? 'text-sky-400 font-bold bg-sky-950/50' 
                              : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                          }`}
                        >
                          <span className="text-[10px] text-slate-500">•</span>
                          <span>{child.title}</span>
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <NavLink 
                key={idx}
                to={item.path} 
                onClick={closeMobileSidebar}
                className={({ isActive }) => `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition ${
                  isActive 
                    ? 'text-sky-400 bg-sky-950/40 border border-sky-800/40 font-bold' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
                title={isSidebarCollapsed ? item.title : ''}
              >
                <Icon size={19} />
                {!isSidebarCollapsed && <span>{item.title}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom System Links */}
        <div className="p-3 border-t border-slate-800/80 space-y-1">
          {!isSidebarCollapsed && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800/30 text-xs font-semibold text-slate-400 border border-slate-800 mb-2">
              <Sparkles size={14} className="text-sky-400 shrink-0" />
              <span>v2.4 Enterprise Edition</span>
            </div>
          )}

          {!isSidebarCollapsed && (
            <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 px-3 py-1">
              ACCOUNT
            </div>
          )}

          <NavLink 
            to={isAdmin ? '/admin/settings' : '/employee/settings'} 
            onClick={closeMobileSidebar}
            className={({ isActive }) => `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition ${
              isActive 
                ? 'text-sky-400 bg-sky-950/40 border border-sky-800/40 font-bold' 
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
            title={isSidebarCollapsed ? 'Settings' : ''}
          >
            <Settings size={19} />
            {!isSidebarCollapsed && <span>Settings</span>}
          </NavLink>

          <a 
            href="#logout" 
            onClick={handleLogoutClick} 
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm text-slate-300 hover:text-rose-400 hover:bg-rose-950/30 transition"
            title={isSidebarCollapsed ? 'Logout' : ''}
          >
            <LogOut size={19} />
            {!isSidebarCollapsed && <span>Logout</span>}
          </a>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
