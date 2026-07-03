import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });

  failedQueue = [];
};

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

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (!error.response) {
      return Promise.reject({
        message:
          "Network error. Please check your internet connection.",
      });
    }

    if (
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization =
            `Bearer ${token}`;

          return api(originalRequest);
        });
      }

      isRefreshing = true;

      try {
        const refreshToken =
          localStorage.getItem("refreshToken");

        if (!refreshToken) {
          throw new Error("No refresh token");
        }

        const response = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          {
            refreshToken,
          }
        );

        const newToken = response.data.token;

        localStorage.setItem("token", newToken);

        api.defaults.headers.Authorization =
          `Bearer ${newToken}`;

        processQueue(null, newToken);

        originalRequest.headers.Authorization =
          `Bearer ${newToken}`;

        return api(originalRequest);
      } catch (err) {
        processQueue(err);

        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");

        window.location.replace("/login");

        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    switch (error.response.status) {
      case 400:
        console.warn("Bad Request");
        break;

      case 403:
        console.warn("Forbidden");
        break;

      case 404:
        console.warn("Not Found");
        break;

      case 422:
        console.warn("Validation Error");
        break;

      case 429:
        console.warn("Too Many Requests");
        break;

      case 500:
        console.warn("Internal Server Error");
        break;

      default:
        break;
    }

    return Promise.reject(error);
  }
);

export default api;
