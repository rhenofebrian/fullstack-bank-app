import axios from "axios";

const API_URL = "http://localhost:5000/api/admin";

// Create axios instance
const adminApi = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if available
adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add retry logic and better error handling
adminApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Don't retry if we already tried or if it's a 401 (unauthorized)
    if (
      originalRequest._retry ||
      (error.response && error.response.status === 401)
    ) {
      return Promise.reject(error);
    }

    // If we get a 429 (too many requests), wait and retry once
    if (error.response && error.response.status === 429) {
      originalRequest._retry = true;

      // Wait for 2 seconds before retrying
      await new Promise((resolve) => setTimeout(resolve, 2000));

      return adminApi(originalRequest);
    }

    return Promise.reject(error);
  }
);

// Admin services
export const adminService = {
  login: async (credentials: { email: string; password: string }) => {
    const response = await adminApi.post("/login", credentials);
    if (response.data.token) {
      localStorage.setItem("adminToken", response.data.token);
      localStorage.setItem("adminInfo", JSON.stringify(response.data.admin));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminInfo");
  },

  getAllUsers: async () => {
    const response = await adminApi.get("/users");
    return response.data;
  },

  getUserById: async (userId: string) => {
    const response = await adminApi.get(`/users/${userId}`);
    return response.data;
  },

  addBalance: async (data: {
    userId: string;
    amount: number;
    description?: string;
  }) => {
    const response = await adminApi.post("/users/add-balance", data);
    return response.data;
  },

  getTransactions: async (userId?: string) => {
    const url = userId ? `/transactions?userId=${userId}` : "/transactions";
    const response = await adminApi.get(url);
    return response.data;
  },

  updateUser: async (
    userId: string,
    data: { fullName?: string; email?: string }
  ) => {
    const response = await adminApi.put(`/users/${userId}`, data);
    return response.data;
  },

  deleteUser: async (userId: string) => {
    const response = await adminApi.delete(`/users/${userId}`);
    return response.data;
  },
};

export default adminApi;
