import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  loginApi,
  fetchMeApi,
  fetchEmployees,
  createEmployeeApi,
  updateEmployeeApi,
  deleteEmployeeApi,
  fetchDepartments,
  createDepartmentApi,
  updateDepartmentApi,
  deleteDepartmentApi
} from '../api/hrmsApi';
import { translations, getFormattedCurrentDate } from '../utils/translations';

const HRMSContext = createContext();

export const parseSalaryNum = (salaryStr) => {
  if (typeof salaryStr === 'number') return salaryStr;
  if (!salaryStr) return 0;
  const num = parseInt(String(salaryStr).replace(/[^0-9]/g, ''), 10);
  return isNaN(num) ? 0 : num;
};

export const formatCurrency = (val) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
};

export const getSalaryBreakdown = (salaryInput) => {
  const grossAnnual = parseSalaryNum(salaryInput);
  const monthlyGross = Math.round(grossAnnual / 12);
  const baseSalary = Math.round(monthlyGross * 0.70);
  const allowances = Math.round(monthlyGross * 0.20);
  const taxDeductions = Math.round(monthlyGross * 0.10);
  const netPayable = monthlyGross - taxDeductions;

  return {
    grossAnnual,
    formattedGrossAnnual: formatCurrency(grossAnnual),
    monthlyGross,
    formattedMonthlyGross: formatCurrency(monthlyGross),
    baseSalary,
    formattedBaseSalary: formatCurrency(baseSalary),
    allowances,
    formattedAllowances: formatCurrency(allowances),
    taxDeductions,
    formattedTaxDeductions: formatCurrency(taxDeductions),
    netPayable,
    formattedNetPayable: formatCurrency(netPayable)
  };
};

/**
 * Normalizes PostgreSQL Employee record to be compatible with frontend UI fields
 */
const normalizeEmployee = (emp) => {
  return {
    ...emp,
    id: emp.id,
    employeeId: emp.employee_id || emp.employeeId || `EMP${String(emp.id).padStart(3, '0')}`,
    fullName: emp.full_name || emp.fullName || 'Employee',
    email: emp.email,
    phone: emp.phone || '+1 555-0199',
    designation: emp.designation,
    department: emp.department_name || emp.department || 'General',
    department_id: emp.department_id,
    joiningDate: emp.joining_date ? String(emp.joining_date).split('T')[0] : '2023-01-01',
    employmentType: emp.employment_type || emp.employmentType || 'Full-time',
    salary: emp.salary ? String(emp.salary) : '75000',
    status: emp.status || 'Active',
    address: emp.address || 'Company HQ Office',
    profilePhoto: emp.profile_photo || emp.profilePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'
  };
};

/**
 * Normalizes PostgreSQL Department record to be compatible with frontend UI fields
 */
const normalizeDepartment = (dept) => {
  return {
    ...dept,
    id: dept.id,
    name: dept.department_name || dept.name,
    department_name: dept.department_name || dept.name,
    description: dept.description || 'Department operations and management.',
    status: dept.status || 'Active',
    employeeCount: dept.employee_count !== undefined ? dept.employee_count : 0
  };
};

export const HRMSProvider = ({ children }) => {
  const DEFAULT_ADMIN = useMemo(() => ({
    id: 100,
    employeeId: 'ADM001',
    fullName: 'Alexander Pierce',
    email: 'admin@hrms.com',
    role: 'admin',
    designation: 'HR Director',
    department: 'Human Resources',
    profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
    phone: '+1 555-0101',
    joiningDate: '2021-03-15',
    salary: '120000',
    status: 'Active'
  }), []);

  const DEFAULT_EMPLOYEE = useMemo(() => ({
    id: 101,
    employeeId: 'EMP002',
    fullName: 'Sarah Jenkins',
    email: 'employee@hrms.com',
    role: 'employee',
    designation: 'Senior Software Engineer',
    department: 'Engineering',
    profilePhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256',
    phone: '+1 555-0199',
    joiningDate: '2022-06-10',
    salary: '95000',
    status: 'Active'
  }), []);

  const [token, setToken] = useState(() => {
    return localStorage.getItem('hrms_token') || null;
  });

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('hrms_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { }
    }
    return null;
  });

  const [userRole, setUserRole] = useState(() => {
    return user?.role || null;
  });

  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [milestones] = useState([]);
  const [dashboardTheme, setDashboardTheme] = useState('light');
  const [sidebarTheme] = useState('dark');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentLanguage, setCurrentLanguage] = useState('EN');

  const login = async (credentials) => {
    try {
      const res = await loginApi(credentials);
      if (res.success && res.token && res.user) {
        setToken(res.token);
        setUser(res.user);
        setUserRole(res.user.role);
        localStorage.setItem('hrms_token', res.token);
        localStorage.setItem('hrms_user', JSON.stringify(res.user));
        return res.user;
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setUserRole(null);
    localStorage.removeItem('hrms_token');
    localStorage.removeItem('hrms_user');
  };

  const changeLanguage = (langCode) => {
    if (translations[langCode]) {
      setCurrentLanguage(langCode);
      const langNames = {
        EN: 'English',
        ES: 'Español',
        FR: 'Français',
        DE: 'Deutsch',
        HI: 'हिंदी (Hindi)'
      };
      addToast(`Language changed to ${langNames[langCode] || langCode}`, 'info');
    }
  };

  const t = (key) => {
    return translations[currentLanguage]?.[key] || translations['EN']?.[key] || key;
  };

  const currentFormattedDate = useMemo(() => {
    return getFormattedCurrentDate(currentLanguage);
  }, [currentLanguage]);

  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Delete',
    onConfirm: null,
    type: 'danger'
  });

  // Fetch initial data from PostgreSQL Backend API on mount
  const refreshData = async () => {
    setIsLoading(true);
    try {
      const [deptRes, empRes] = await Promise.all([
        fetchDepartments(),
        fetchEmployees({ limit: 100 })
      ]);

      if (deptRes.success && deptRes.data) {
        setDepartments(deptRes.data.map(normalizeDepartment));
      }

      if (empRes.success && empRes.data) {
        setEmployees(empRes.data.map(normalizeEmployee));
      }

      setIsBackendConnected(true);
    } catch (error) {
      console.warn('Backend API not connected, using client state:', error.message);
      setIsBackendConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const toggleDashboardTheme = () => {
    const next = dashboardTheme === 'light' ? 'dark' : 'light';
    setDashboardTheme(next);
    addToast(`Dashboard theme switched to ${next === 'dark' ? 'Dark' : 'Light'} Mode.`, 'info');
  };

  const toggleSidebarTheme = toggleDashboardTheme;
  const toggleMobileSidebar = () => setIsMobileSidebarOpen((prev) => !prev);
  const closeMobileSidebar = () => setIsMobileSidebarOpen(false);
  const toggleSidebarCollapse = () => setIsSidebarCollapsed((prev) => !prev);

  const addToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => {
      if (prev.length > 0 && prev[prev.length - 1].message === message) {
        return prev;
      }
      return [...prev, { id, message, type }];
    });
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const openModal = ({ title, message, confirmText = 'Delete', onConfirm, type = 'danger' }) => {
    setModalState({
      isOpen: true,
      title,
      message,
      confirmText,
      onConfirm: () => {
        onConfirm();
        closeModal();
      },
      type
    });
  };

  const closeModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  // Announcement Action
  const addAnnouncement = (newAnn) => {
    const newId = `ANN-${Math.floor(100 + Math.random() * 900)}`;
    const annObj = { id: newId, date: new Date().toISOString().split('T')[0], ...newAnn };
    setAnnouncements((prev) => [annObj, ...prev]);
    addToast('Company announcement published successfully.', 'success');
  };

  // Leave Actions
  const approveLeave = (id) => {
    setLeaves((prev) => prev.map((l) => (l.id === id ? { ...l, status: 'Approved' } : l)));
    addToast(`Leave request approved successfully.`, 'success');
  };

  const rejectLeave = (id) => {
    setLeaves((prev) => prev.map((l) => (l.id === id ? { ...l, status: 'Rejected' } : l)));
    addToast(`Leave request rejected.`, 'info');
  };

  // Task Actions
  const toggleTaskStatus = (id) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextStatus = t.status === 'Completed' ? 'Pending' : 'Completed';
          return { ...t, status: nextStatus };
        }
        return t;
      })
    );
    addToast(`Task status updated.`, 'info');
  };

  // Dynamic Statistics
  const stats = useMemo(() => {
    const totalEmployees = employees.length;
    const activeEmployees = employees.filter((e) => e.status === 'Active').length;
    const inactiveEmployees = employees.filter((e) => e.status !== 'Active').length;
    const totalDepartments = departments.length;

    const totalSalaryNumber = employees.reduce((acc, curr) => acc + parseSalaryNum(curr.salary), 0);
    const formattedTotalSalary = formatCurrency(totalSalaryNumber);
    const avgSalaryNumber = totalEmployees > 0 ? Math.round(totalSalaryNumber / totalEmployees) : 0;
    const formattedAvgSalary = formatCurrency(avgSalaryNumber);

    const pendingLeavesList = leaves.filter((l) => l.status === 'Pending');
    const pendingLeavesCount = pendingLeavesList.length;
    const pendingTasksList = tasks.filter((t) => t.status === 'Pending');
    const pendingTasksCount = pendingTasksList.length;

    const inOfficeStaff = employees
      .filter((e) => e.status === 'Active' || e.status === 'In Office')
      .map((emp, idx) => ({
        ...emp,
        time: ['08:45 AM', '08:52 AM', '09:00 AM', '08:30 AM', '09:05 AM'][idx % 5] || '09:00 AM',
        location: 'Main HQ Office'
      }));

    const remoteStaff = employees
      .filter((e) => e.status === 'Remote' || e.employmentType === 'Contract')
      .map((emp, idx) => ({
        ...emp,
        time: ['09:00 AM', '09:15 AM'][idx % 2] || '09:00 AM',
        location: 'Remote Work / Home'
      }));

    const onLeaveStaff = employees
      .filter((e) => e.status === 'On Leave')
      .map((emp) => ({
        ...emp,
        leaveType: 'Approved Leave',
        dateRange: 'Active Period'
      }));

    const lateStaff = employees
      .filter((e) => e.status === 'Late')
      .map((emp) => ({
        ...emp,
        time: '09:30 AM',
        location: 'Main HQ Office'
      }));

    const departmentCounts = departments.map((dept) => {
      const deptEmployees = employees.filter(
        (e) => e.department === dept.name || e.department_id === dept.id
      );
      const count = dept.employeeCount !== undefined ? dept.employeeCount : deptEmployees.length;
      const deptPayroll = deptEmployees.reduce((acc, e) => acc + parseSalaryNum(e.salary), 0);

      return {
        ...dept,
        employeeCount: count,
        payroll: deptPayroll,
        formattedPayroll: formatCurrency(deptPayroll)
      };
    });

    return {
      totalEmployees,
      activeEmployees,
      inactiveEmployees,
      totalDepartments,
      totalSalaryNumber,
      formattedTotalSalary,
      avgSalaryNumber,
      formattedAvgSalary,
      pendingLeavesCount,
      pendingLeavesList,
      pendingTasksCount,
      pendingTasksList,
      inOfficeStaff,
      remoteStaff,
      onLeaveStaff,
      lateStaff,
      departmentCounts
    };
  }, [employees, departments, leaves, tasks]);

  // Employee CRUD Actions connected to Backend REST API
  const normalizeEmploymentType = (type) => {
    if (!type) return 'Full-time';
    if (type === 'Full-Time') return 'Full-time';
    if (type === 'Part-Time') return 'Part-time';
    return type;
  };

  const addEmployee = async (employeeData) => {
    try {
      let deptId = employeeData.department_id;
      if (!deptId && employeeData.department) {
        const foundDept = departments.find(
          (d) => d.name === employeeData.department || d.department_name === employeeData.department
        );
        if (foundDept) deptId = foundDept.id;
      }

      const payload = {
        employee_id: employeeData.employeeId || employeeData.employee_id || employeeData.id,
        full_name: employeeData.fullName || employeeData.full_name,
        email: employeeData.email,
        phone: employeeData.phone || undefined,
        date_of_birth: employeeData.dob || employeeData.date_of_birth || undefined,
        gender: employeeData.gender || undefined,
        designation: employeeData.designation,
        department_id: parseInt(deptId || 1, 10),
        joining_date: employeeData.joiningDate || employeeData.joining_date || new Date().toISOString().split('T')[0],
        employment_type: normalizeEmploymentType(employeeData.employmentType || employeeData.employment_type),
        salary: parseSalaryNum(employeeData.salary),
        status: employeeData.status || 'Active',
        address: employeeData.address || undefined,
        profile_photo: employeeData.profilePhoto || employeeData.profile_photo || undefined
      };

      const res = await createEmployeeApi(payload);
      if (res.success && res.data) {
        const normalized = normalizeEmployee(res.data);
        setEmployees((prev) => [normalized, ...prev]);
        addToast(`Employee "${normalized.fullName}" created in PostgreSQL database!`, 'success');
        refreshData();
        return normalized;
      }
    } catch (error) {
      console.warn('API Add Employee error:', error.message);
      addToast(error.message || 'Error creating employee record.', 'danger');
      return null;
    }
  };

  const updateEmployee = async (id, updatedData) => {
    try {
      let deptId = updatedData.department_id;
      if (!deptId && updatedData.department) {
        const foundDept = departments.find(
          (d) => d.name === updatedData.department || d.department_name === updatedData.department
        );
        if (foundDept) deptId = foundDept.id;
      }

      const payload = {
        full_name: updatedData.fullName || updatedData.full_name,
        email: updatedData.email,
        phone: updatedData.phone !== undefined ? updatedData.phone : undefined,
        date_of_birth: updatedData.dob || updatedData.date_of_birth || undefined,
        gender: updatedData.gender || undefined,
        designation: updatedData.designation,
        department_id: deptId ? parseInt(deptId, 10) : undefined,
        joining_date: updatedData.joiningDate || updatedData.joining_date,
        employment_type: (updatedData.employmentType || updatedData.employment_type) ? normalizeEmploymentType(updatedData.employmentType || updatedData.employment_type) : undefined,
        salary: updatedData.salary !== undefined ? parseSalaryNum(updatedData.salary) : undefined,
        status: updatedData.status,
        address: updatedData.address,
        profile_photo: updatedData.profilePhoto || updatedData.profile_photo
      };

      const res = await updateEmployeeApi(id, payload);
      if (res.success && res.data) {
        const normalized = normalizeEmployee(res.data);
        setEmployees((prev) => prev.map((emp) => (emp.id === id ? normalized : emp)));
        addToast(`Employee "${normalized.fullName}" updated in PostgreSQL!`, 'success');
        refreshData();
        return;
      }
    } catch (error) {
      console.warn('API Update Employee error:', error.message);
      addToast(error.message || 'Error updating employee record.', 'danger');
    }
  };

  const deleteEmployee = async (id) => {
    const target = employees.find((e) => e.id === id);
    try {
      const res = await deleteEmployeeApi(id);
      if (res.success) {
        setEmployees((prev) => prev.filter((emp) => emp.id !== id));
        addToast(`Employee "${target ? target.fullName : id}" deleted from PostgreSQL.`, 'info');
        refreshData();
        return;
      }
    } catch (error) {
      console.warn('API Delete Employee error:', error.message);
      addToast(error.message || 'Error deleting employee record.', 'danger');
    }
  };

  const getEmployeeById = (id) => {
    return employees.find((emp) => String(emp.id) === String(id) || emp.employeeId === id);
  };

  // Department CRUD Actions connected to Backend REST API
  const addDepartment = async (deptData) => {
    try {
      const payload = {
        department_name: deptData.name || deptData.department_name,
        description: deptData.description,
        status: deptData.status || 'Active'
      };

      const res = await createDepartmentApi(payload);
      if (res.success && res.data) {
        const normalized = normalizeDepartment(res.data);
        setDepartments((prev) => [...prev, normalized]);
        addToast(`Department "${normalized.name}" created in PostgreSQL!`, 'success');
        refreshData();
        return normalized;
      }
    } catch (error) {
      console.warn('API Add Department error:', error.message);
      addToast(error.message || 'Error creating department.', 'danger');
    }
  };

  const updateDepartment = async (id, updatedData) => {
    try {
      const payload = {
        department_name: updatedData.name || updatedData.department_name,
        description: updatedData.description,
        status: updatedData.status
      };

      const res = await updateDepartmentApi(id, payload);
      if (res.success && res.data) {
        const normalized = normalizeDepartment(res.data);
        setDepartments((prev) => prev.map((dept) => (dept.id === id ? normalized : dept)));
        addToast(`Department "${normalized.name}" updated in PostgreSQL!`, 'success');
        refreshData();
        return;
      }
    } catch (error) {
      console.warn('API Update Department error:', error.message);
      addToast(error.message || 'Error updating department.', 'danger');
    }
  };

  const deleteDepartment = async (id) => {
    const target = departments.find((d) => d.id === id);
    try {
      const res = await deleteDepartmentApi(id);
      if (res.success) {
        setDepartments((prev) => prev.filter((d) => d.id !== id));
        addToast(`Department "${target ? target.name : id}" deleted.`, 'info');
        refreshData();
        return;
      }
    } catch (error) {
      console.warn('API Delete Department restriction:', error.message);
      addToast(error.message || 'Cannot delete department with assigned employees.', 'danger');
    }
  };

  const getDepartmentById = (id) => {
    return departments.find((d) => String(d.id) === String(id));
  };

  return (
    <HRMSContext.Provider
      value={{
        employees,
        departments,
        leaves,
        tasks,
        announcements,
        milestones,
        stats,
        dashboardTheme,
        toggleDashboardTheme,
        sidebarTheme,
        toggleSidebarTheme,
        isMobileSidebarOpen,
        toggleMobileSidebar,
        closeMobileSidebar,
        isSidebarCollapsed,
        toggleSidebarCollapse,
        toasts,
        addToast,
        removeToast,
        modalState,
        openModal,
        closeModal,
        addAnnouncement,
        approveLeave,
        rejectLeave,
        toggleTaskStatus,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        getEmployeeById,
        addDepartment,
        updateDepartment,
        deleteDepartment,
        getDepartmentById,
        isBackendConnected,
        isLoading,
        refreshData,
        currentLanguage,
        changeLanguage,
        t,
        currentFormattedDate,
        token,
        user,
        userRole,
        login,
        logout
      }}
    >
      {children}
    </HRMSContext.Provider>
  );
};

export const useHRMS = () => {
  const context = useContext(HRMSContext);
  if (!context) {
    throw new Error('useHRMS must be used within an HRMSProvider');
  }
  return context;
};
