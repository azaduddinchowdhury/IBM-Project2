import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 10000,
});

// Request interceptor to attach token from storage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth API endpoints
export const authApi = {
  login: (credentials) => api.post("/auth/login", credentials),
  register: (userData) => api.post("/auth/register", userData),
  getMe: () => api.get("/auth/me"),
  logout: () => api.post("/auth/logout"),
};

// Visitor API endpoints
export const visitorApi = {
  // Get all visitors (with optional search query)
  getAll: (search = "") => {
    const params = search ? { search } : {};
    return api.get("/visitors", { params });
  },

  // Get single visitor
  getById: (id) => api.get(`/visitors/${id}`),

  // Create a new visitor
  create: (data) => api.post("/visitors", data),

  // Update visitor details
  update: (id, data) => api.put(`/visitors/${id}`, data),

  // Delete visitor
  delete: (id) => api.delete(`/visitors/${id}`),

  // Update check-in / check-out status
  updateStatus: (id, status) => api.patch(`/visitors/${id}/status`, { status }),
};

export default api;
