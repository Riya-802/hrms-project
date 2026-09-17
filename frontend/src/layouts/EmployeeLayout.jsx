import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import ConfirmationModal from '../components/ConfirmationModal';
import Toast from '../components/Toast';
import { useHRMS } from '../context/HRMSContext';

const getPageTitles = (pathname) => {
  if (pathname.includes('/employee/profile')) {
    return { title: 'My Profile', subtitle: 'View and update your personal employee details' };
  }
  if (pathname.includes('/employee/attendance')) {
    return { title: 'My Attendance', subtitle: 'Track your daily check-in, check-out and work history' };
  }
  if (pathname.includes('/employee/leaves')) {
    return { title: 'Leave Management', subtitle: 'Apply for leave, check balances and approval status' };
  }
  if (pathname.includes('/employee/work')) {
    return { title: 'My Work & Tasks', subtitle: 'Manage assigned tasks, deadlines, and deliverables' };
  }
  if (pathname.includes('/employee/payroll')) {
    return { title: 'Salary & Payslips', subtitle: 'View monthly breakdown and download official payslips' };
  }
  if (pathname.includes('/employee/documents')) {
    return { title: 'Company & Personal Documents', subtitle: 'Access company policies, contracts, and certificates' };
  }
  if (pathname.includes('/employee/holidays')) {
    return { title: 'Annual Holiday List', subtitle: 'Official company public holidays schedule' };
  }
  if (pathname.includes('/employee/notifications')) {
    return { title: 'Notifications & Alerts', subtitle: 'Recent updates, approvals, and system notifications' };
  }
  return { title: 'Employee Portal', subtitle: 'Personal workspace and daily HR management' };
};

const EmployeeLayout = () => {
  const location = useLocation();
  const { title, subtitle } = getPageTitles(location.pathname);
  const { dashboardTheme } = useHRMS();

  return (
    <div className={`flex min-h-screen w-full overflow-x-hidden ${dashboardTheme === 'dark' ? 'bg-slate-900 text-slate-100' : 'bg-slate-100 text-slate-900'} transition-colors duration-200`}>
      <Sidebar portalType="employee" />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title={title} subtitle={subtitle} />
        <main className="p-4 sm:p-6 lg:p-8 flex-1 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
      <ConfirmationModal />
      <Toast />
    </div>
  );
};

export default EmployeeLayout;
