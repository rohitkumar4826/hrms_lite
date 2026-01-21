import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

console.log('API Base URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('API Success:', response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error('API Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
      code: error.code,
    });
    return Promise.reject(error);
  }
);

// Employee APIs
export const employeeAPI = {
  getAll: () => api.get('/api/employees/'),
  getById: (employeeId) => api.get(`/api/employees/${employeeId}`),
  create: (data) => api.post('/api/employees/', data),
  delete: (employeeId) => api.delete(`/api/employees/${employeeId}`),
};

// Attendance APIs
export const attendanceAPI = {
  getAll: (params) => api.get('/api/attendance/', { params }),
  getByEmployee: (employeeId, params) => 
    api.get(`/api/attendance/employee/${employeeId}`, { params }),
  create: (data) => api.post('/api/attendance/', data),
  delete: (attendanceId) => api.delete(`/api/attendance/${attendanceId}`),
  getEmployeeStats: (employeeId) => 
    api.get(`/api/attendance/stats/employee/${employeeId}`),
  getDashboardStats: () => api.get('/api/attendance/stats/dashboard'),
};

export default api;