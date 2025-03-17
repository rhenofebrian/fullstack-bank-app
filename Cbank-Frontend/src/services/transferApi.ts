import axios from "axios";

const API_URL = "http://localhost:5000/api/transfers";

// Create axios instance
const transferApi = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if available
transferApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for debugging
transferApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Transfer API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Transfer services
export const transferService = {
  transferFunds: async (data: {
    recipientEmail: string;
    amount: number;
    description?: string;
  }) => {
    const response = await transferApi.post("/", data);
    return response.data;
  },

  getTransferHistory: async () => {
    const response = await transferApi.get("/history");
    return response.data;
  },
};

export default transferApi;
