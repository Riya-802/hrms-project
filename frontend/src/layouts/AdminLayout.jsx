import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import ConfirmationModal from '../components/ConfirmationModal';
import Toast from '../components/Toast';
import { useHRMS } from '../context/HRMSContext';

const getPageTitles = (pathname) => {
  if (pathname.includes('/admin/employees/add')) {
    return { title: 'Add New Employee', subtitle: 'Fill in employee registration details' };
  }
  if (pathname.includes('/edit') && pathname.includes('/employees')) {
    return { title: 'Edit Employee', subtitle: 'Update employee profile records' };
  }
  if (pathname.includes('/admin/employees/')) {
    return { title: 'Employee Profile', subtitle: 'Detailed view of employee records' };
  }
  if (pathname === '/admin/employees') {
    return { title: 'Employee Directory', subtitle: 'Manage, filter, and review team members' };
  }
  if (pathname.includes('/admin/departments/add')) {
    return { title: 'Add Department', subtitle: 'Define a new organizational department' };
  }
  if (pathname.includes('/edit') && pathname.includes('/departments')) {
    return { title: 'Edit Department', subtitle: 'Modify department details & status' };
  }
  if (pathname.includes('/admin/departments/')) {
    return { title: 'Department Overview', subtitle: 'Department information and member list' };
  }
  if (pathname === '/admin/departments') {
    return { title: 'Department Directory', subtitle: 'Overview of organizational structure' };
  }
  return { title: 'Admin Dashboard', subtitle: 'Real-time HR analytics & operational summary' };
};

const AdminLayout = () => {
  const location = useLocation();
  const { title, subtitle } = getPageTitles(location.pathname);
  const { dashboardTheme } = useHRMS();

  return (
    <div className={`flex min-h-screen w-full overflow-x-hidden ${dashboardTheme === 'dark' ? 'bg-slate-900 text-slate-100' : 'bg-slate-100 text-slate-900'} transition-colors duration-200`}>
      <Sidebar portalType="admin" />
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

export default AdminLayout;
