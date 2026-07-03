import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (!error.response) {
      return Promise.reject({
        message: "Unable to reach the server.",
      });
    }

    switch (error.response.status) {
      case 400:
        console.error("Bad Request");
        break;

      case 401:
        localStorage.removeItem("token");
        window.location.href = "/login";
        break;

      case 403:
        console.error("Access Forbidden");
        break;

      case 404:
        console.error("Resource Not Found");
        break;

      case 422:
        console.error("Validation Error");
        break;

      case 500:
        console.error("Internal Server Error");
        break;

      default:
        console.error(error.response.data);
    }

    return Promise.reject(error);
  }
);

export default api;
