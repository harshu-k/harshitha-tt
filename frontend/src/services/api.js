import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ssims_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Unwrap API response or handle auth expiration
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Clear token if expired or unauthorized
      const currentPath = window.location.pathname;
      if (currentPath !== '/login') {
        localStorage.removeItem('ssims_token');
        localStorage.removeItem('ssims_user');
      }
    }
    const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getCurrentUser: () => api.get('/auth/me'),
};

export const studentApi = {
  getProfile: () => api.get('/student/profile'),
  updateProfile: (profileData) => api.put('/student/profile', profileData),
  getStudentById: (userId) => api.get(`/student/profile/${userId}`),
  getAllStudents: () => api.get('/student/all'),
  getResumeData: () => api.get('/student/resume'),
};

export const skillsApi = {
  getMySkills: () => api.get('/skills'),
  getSkillsByStudent: (studentId) => api.get(`/skills/student/${studentId}`),
  addSkill: (skill) => api.post('/skills', skill),
  updateSkill: (id, skill) => api.put(`/skills/${id}`, skill),
  deleteSkill: (id) => api.delete(`/skills/${id}`),
  verifySkill: (id) => api.patch(`/skills/${id}/verify`),
};

export const certificationsApi = {
  getMyCertifications: () => api.get('/certifications'),
  getAllCertifications: () => api.get('/certifications/all'),
  addCertification: (cert) => api.post('/certifications', cert),
  updateCertification: (id, cert) => api.put(`/certifications/${id}`, cert),
  deleteCertification: (id) => api.delete(`/certifications/${id}`),
  updateStatus: (id, status, notes) => api.patch(`/certifications/${id}/status`, { status, notes }),
};

export const projectsApi = {
  getMyProjects: () => api.get('/projects'),
  getProjectsByStudent: (studentId) => api.get(`/projects/student/${studentId}`),
  addProject: (project) => api.post('/projects', project),
  updateProject: (id, project) => api.put(`/projects/${id}`, project),
  deleteProject: (id) => api.delete(`/projects/${id}`),
};

export const internshipsApi = {
  getInternships: (search = '') => api.get(`/internships${search ? `?search=${encodeURIComponent(search)}` : ''}`),
  getManagementList: () => api.get('/internships/manage'),
  getById: (id) => api.get(`/internships/${id}`),
  getRecommendations: () => api.get('/internships/recommendations'),
  createInternship: (data) => api.post('/internships', data),
  updateInternship: (id, data) => api.put(`/internships/${id}`, data),
  deleteInternship: (id) => api.delete(`/internships/${id}`),
};

export const applicationsApi = {
  apply: (data) => api.post('/applications', data),
  getMyApplications: () => api.get('/applications/my'),
  getAllApplications: () => api.get('/applications/all'),
  getByInternship: (internshipId) => api.get(`/applications/internship/${internshipId}`),
  updateStatus: (id, status, coordinatorFeedback, interviewSchedule) =>
    api.patch(`/applications/${id}/status`, { status, coordinatorFeedback, interviewSchedule }),
};

export const analyticsApi = {
  getDashboard: () => api.get('/analytics/dashboard'),
};

export const notificationsApi = {
  getMyNotifications: () => api.get('/notifications'),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  markRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllRead: () => api.post('/notifications/read-all'),
};

export const filesApi = {
  uploadFile: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export default api;

