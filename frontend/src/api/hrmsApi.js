// HRMS Frontend API Client Service targeting Node.js + Express + PostgreSQL Backend

const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Universal fetch wrapper with error handling
 */
const request = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
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
// 1. DASHBOARD API ENDPOINTS
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
// 2. DEPARTMENT API ENDPOINTS
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
// 3. EMPLOYEE API ENDPOINTS
// ==========================================

export const fetchEmployees = async (params = {}) => {
  const query = new URLSearchParams();
  if (params.page) query.append('page', params.page);
  if (params.limit) query.append('limit', params.limit || 50);
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
