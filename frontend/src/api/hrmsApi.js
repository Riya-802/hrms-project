// HRMS Frontend API Client Service targeting Node.js + Express + PostgreSQL Backend

const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Universal fetch wrapper with automatic JWT Bearer header & error handling
 */
const request = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const token = localStorage.getItem('hrms_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      let errorMsg = data.message || `API error: ${response.status} ${response.statusText}`;
      if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
        const details = data.errors.map((err) => `${err.field}: ${err.message}`).join('; ');
        errorMsg = `${data.message} (${details})`;
      }
      throw new Error(errorMsg);
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// ==========================================
// 1. AUTHENTICATION API ENDPOINTS
// ==========================================

export const loginApi = async (credentials) => {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
};

export const fetchMeApi = async () => {
  return request('/auth/me');
};

export const fetchEmployeeSelfDashboardApi = async () => {
  return request('/employee/me/dashboard');
};

// ==========================================
// 2. DASHBOARD API ENDPOINTS
// ==========================================

export const fetchDashboardStats = async () => {
  return request('/dashboard/stats');
};

export const fetchDepartmentSummary = async () => {
  return request('/dashboard/department-summary');
};

export const fetchRecentEmployees = async () => {
  return request('/dashboard/recent-employees');
};

// ==========================================
// 3. DEPARTMENT API ENDPOINTS
// ==========================================

export const fetchDepartments = async () => {
  return request('/departments');
};

export const fetchDepartmentById = async (id) => {
  return request(`/departments/${id}`);
};

export const createDepartmentApi = async (deptData) => {
  return request('/departments', {
    method: 'POST',
    body: JSON.stringify(deptData),
  });
};

export const updateDepartmentApi = async (id, deptData) => {
  return request(`/departments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(deptData),
  });
};

export const deleteDepartmentApi = async (id) => {
  return request(`/departments/${id}`, {
    method: 'DELETE',
  });
};

// ==========================================
// 4. EMPLOYEE API ENDPOINTS
// ==========================================

export const fetchEmployees = async (params = {}) => {
  const query = new URLSearchParams();
  if (params.page) query.append('page', params.page);
  if (params.limit) query.append('limit', params.limit || 100);
  if (params.search) query.append('search', params.search);
  if (params.department) query.append('department', params.department);
  if (params.status) query.append('status', params.status);

  const queryString = query.toString() ? `?${query.toString()}` : '';
  return request(`/employees${queryString}`);
};

export const fetchEmployeeById = async (id) => {
  return request(`/employees/${id}`);
};

export const createEmployeeApi = async (empData) => {
  return request('/employees', {
    method: 'POST',
    body: JSON.stringify(empData),
  });
};

export const updateEmployeeApi = async (id, empData) => {
  return request(`/employees/${id}`, {
    method: 'PUT',
    body: JSON.stringify(empData),
  });
};

export const deleteEmployeeApi = async (id) => {
  return request(`/employees/${id}`, {
    method: 'DELETE',
  });
};

// ==========================================
// 5. TASK API ENDPOINTS
// ==========================================

export const fetchTasksApi = async (params = {}) => {
  const query = new URLSearchParams();
  if (params.status) query.append('status', params.status);
  if (params.priority) query.append('priority', params.priority);
  if (params.assigned_to) query.append('assigned_to', params.assigned_to);
  if (params.search) query.append('search', params.search);

  const queryString = query.toString() ? `?${query.toString()}` : '';
  return request(`/tasks${queryString}`);
};

export const fetchTaskByIdApi = async (id) => {
  return request(`/tasks/${id}`);
};

export const createTaskApi = async (taskData) => {
  return request('/tasks', {
    method: 'POST',
    body: JSON.stringify(taskData),
  });
};

export const updateTaskApi = async (id, taskData) => {
  return request(`/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(taskData),
  });
};

export const deleteTaskApi = async (id) => {
  return request(`/tasks/${id}`, {
    method: 'DELETE',
  });
};

export const fetchTaskReportsApi = async () => {
  return request('/tasks/reports');
};

