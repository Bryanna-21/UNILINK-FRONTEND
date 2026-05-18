import axios from "axios";

// Get base URL from environment variables
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000/api";

const API = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

// Attach token automatically to all requests
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    // Add Bearer prefix to token
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Handle response errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default API;
