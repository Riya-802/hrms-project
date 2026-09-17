import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HRMSProvider, useHRMS } from './context/HRMSContext';
import ProtectedRoute from './components/ProtectedRoute';

// Layouts
import AdminLayout from './layouts/AdminLayout';
import EmployeeLayout from './layouts/EmployeeLayout';

// Auth Page
import Login from './pages/Login';

// Admin Pages
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import AddEmployee from './pages/AddEmployee';
import EmployeeDetails from './pages/EmployeeDetails';
import EditEmployee from './pages/EditEmployee';
import Departments from './pages/Departments';
import AddDepartment from './pages/AddDepartment';
import DepartmentDetails from './pages/DepartmentDetails';
import EditDepartment from './pages/EditDepartment';

// Task Management Pages
import TaskList from './pages/tasks/TaskList';
import CreateTask from './pages/tasks/CreateTask';
import TaskReports from './pages/tasks/TaskReports';

// Payroll Pages
import PayrollWallet from './pages/payroll/PayrollWallet';

// Employee Pages
import EmployeeDashboard from './pages/EmployeeDashboard';
import EmployeeProfile from './pages/employee/EmployeeProfile';
import EmployeeAttendance from './pages/employee/EmployeeAttendance';
import EmployeeLeaves from './pages/employee/EmployeeLeaves';
import EmployeeWork from './pages/employee/EmployeeWork';
import EmployeePayroll from './pages/employee/EmployeePayroll';
import EmployeeDocuments from './pages/employee/EmployeeDocuments';
import EmployeeHolidays from './pages/employee/EmployeeHolidays';
import EmployeeNotifications from './pages/employee/EmployeeNotifications';

const RootRedirect = () => {
  const { user, userRole } = useHRMS();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (userRole === 'employee') {
    return <Navigate to="/employee/dashboard" replace />;
  }
  return <Navigate to="/admin/dashboard" replace />;
};

function App() {
  return (
    <HRMSProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Login Route */}
          <Route path="/login" element={<Login />} />

          {/* Default Root Redirect */}
          <Route path="/" element={<RootRedirect />} />
          
          {/* Admin Protected Routes */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            
            {/* Employee Management Routes */}
            <Route path="employees" element={<Employees />} />
            <Route path="employees/add" element={<AddEmployee />} />
            <Route path="employees/:id" element={<EmployeeDetails />} />
            <Route path="employees/:id/edit" element={<EditEmployee />} />
            
            {/* Department Management Routes */}
            <Route path="departments" element={<Departments />} />
            <Route path="departments/add" element={<AddDepartment />} />
            <Route path="departments/:id" element={<DepartmentDetails />} />
            <Route path="departments/:id/edit" element={<EditDepartment />} />

            {/* Admin Task Management Routes */}
            <Route path="tasks" element={<TaskList filterMode="all" />} />
            <Route path="tasks/create" element={<CreateTask />} />
            <Route path="tasks/assigned" element={<TaskList filterMode="assigned" />} />
            <Route path="tasks/pending" element={<TaskList filterMode="pending" />} />
            <Route path="tasks/in-progress" element={<TaskList filterMode="in-progress" />} />
            <Route path="tasks/completed" element={<TaskList filterMode="completed" />} />
            <Route path="tasks/reports" element={<TaskReports />} />

            {/* Admin Payroll Wallet Route */}
            <Route path="payroll/wallet" element={<PayrollWallet />} />

            {/* Fallback Admin Sub-pages */}
            <Route path="*" element={<Dashboard />} />
          </Route>

          {/* Employee Self-Service Protected Routes */}
          <Route 
            path="/employee" 
            element={
              <ProtectedRoute allowedRoles={['employee']}>
                <EmployeeLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/employee/dashboard" replace />} />
            <Route path="dashboard" element={<EmployeeDashboard />} />
            
            <Route path="profile" element={<EmployeeProfile />} />
            <Route path="profile/*" element={<EmployeeProfile />} />

            <Route path="attendance" element={<EmployeeAttendance />} />
            <Route path="attendance/*" element={<EmployeeAttendance />} />

            <Route path="leaves" element={<EmployeeLeaves />} />
            <Route path="leaves/*" element={<EmployeeLeaves />} />

            {/* Employee Task Management Routes */}
            <Route path="tasks" element={<TaskList filterMode="all" />} />
            <Route path="tasks/create" element={<CreateTask />} />
            <Route path="tasks/assigned" element={<TaskList filterMode="assigned" />} />
            <Route path="tasks/pending" element={<TaskList filterMode="pending" />} />
            <Route path="tasks/in-progress" element={<TaskList filterMode="in-progress" />} />
            <Route path="tasks/completed" element={<TaskList filterMode="completed" />} />
            <Route path="tasks/reports" element={<TaskReports />} />

            <Route path="work" element={<EmployeeWork />} />
            <Route path="work/*" element={<EmployeeWork />} />

            <Route path="payroll/wallet" element={<PayrollWallet />} />
            <Route path="payroll" element={<EmployeePayroll />} />
            <Route path="payroll/*" element={<EmployeePayroll />} />

            <Route path="documents" element={<EmployeeDocuments />} />
            <Route path="documents/*" element={<EmployeeDocuments />} />

            <Route path="holidays" element={<EmployeeHolidays />} />
            <Route path="notifications" element={<EmployeeNotifications />} />

            {/* Fallback Employee Sub-pages */}
            <Route path="*" element={<EmployeeDashboard />} />
          </Route>

          {/* Global Fallback */}
          <Route path="*" element={<RootRedirect />} />
        </Routes>
      </BrowserRouter>
    </HRMSProvider>
  );
}

export default App;
