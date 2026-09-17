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

  // Open accordion sections by default if location matches
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
        { title: 'Payslips', path: '/admin/payroll/payslips' }
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
        { title: 'Payslips', path: '/employee/payroll/payslips' }
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
        <div className="sidebar-mobile-backdrop" onClick={closeMobileSidebar} />
      )}

      <aside className={`sidebar sidebar-theme-dark ${isMobileSidebarOpen ? 'open' : ''} ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        {/* Header */}
        <div className="sidebar-header">
          <div className="sidebar-logo-wrapper">
            <div className="sidebar-logo-icon">
              {isAdmin ? <ShieldCheck size={22} color="#38bdf8" /> : <UserCheck size={22} color="#10b981" />}
            </div>
            {!isSidebarCollapsed && (
              <div>
                <div className="sidebar-logo-text">HRMS</div>
                <div className={`sidebar-logo-tag ${isAdmin ? 'admin-tag' : 'employee-tag'}`}>
                  {isAdmin ? 'ADMIN PORTAL' : 'EMPLOYEE PORTAL'}
                </div>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
            <button 
              className="sidebar-collapse-toggle-btn"
              onClick={toggleSidebarCollapse}
              title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {isSidebarCollapsed ? <PanelLeftOpen size={19} /> : <PanelLeftClose size={19} />}
            </button>
            <button className="sidebar-close-btn" onClick={closeMobileSidebar}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* User Info Quick Card */}
        {!isSidebarCollapsed && user && (
          <div className="sidebar-user-card">
            <img 
              src={user.profilePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'} 
              alt={user.fullName} 
              className="sidebar-user-avatar"
            />
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{user.fullName}</div>
              <div className="sidebar-user-role">{user.designation || (isAdmin ? 'System Admin' : 'Employee')}</div>
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <nav className="sidebar-nav">
          {!isSidebarCollapsed && <div className="sidebar-nav-title">{isAdmin ? 'ADMIN NAVIGATION' : 'EMPLOYEE MENU'}</div>}
          
          {currentMenuItems.map((item, idx) => {
            const Icon = item.icon;

            if (item.children) {
              const isOpen = openSubmenus[item.key];
              const isChildActive = item.children.some(c => location.pathname === c.path);

              return (
                <div key={item.key || idx} className="sidebar-submenu-group">
                  <button
                    onClick={() => toggleSubmenu(item.key)}
                    className={`sidebar-link sidebar-parent-link ${isChildActive ? 'child-active' : ''}`}
                    title={isSidebarCollapsed ? item.title : ''}
                  >
                    <div className="sidebar-link-content">
                      <Icon size={19} />
                      {!isSidebarCollapsed && <span>{item.title}</span>}
                    </div>
                    {!isSidebarCollapsed && (
                      isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />
                    )}
                  </button>

                  {!isSidebarCollapsed && isOpen && (
                    <div className="sidebar-sub-items">
                      {item.children.map((child, cIdx) => (
                        <NavLink
                          key={cIdx}
                          to={child.path}
                          onClick={closeMobileSidebar}
                          className={({ isActive }) => `sidebar-sub-link ${isActive ? 'active' : ''}`}
                        >
                          <span className="sub-link-dot">•</span>
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
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                title={isSidebarCollapsed ? item.title : ''}
              >
                <Icon size={19} />
                {!isSidebarCollapsed && <span>{item.title}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom System Links */}
        <div className="sidebar-bottom">
          {!isSidebarCollapsed && (
            <div className="sidebar-system-badge">
              <Sparkles size={14} color="#38bdf8" />
              <span>v2.4 Enterprise Edition</span>
            </div>
          )}

          {!isSidebarCollapsed && <div className="sidebar-nav-title">ACCOUNT</div>}

          <NavLink 
            to={isAdmin ? '/admin/settings' : '/employee/settings'} 
            onClick={closeMobileSidebar}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            title={isSidebarCollapsed ? 'Settings' : ''}
          >
            <Settings size={19} />
            {!isSidebarCollapsed && <span>Settings</span>}
          </NavLink>

          <a 
            href="#logout" 
            onClick={handleLogoutClick} 
            className="sidebar-link logout-btn"
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
