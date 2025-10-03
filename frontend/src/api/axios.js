import axios from "axios";

const API_BASE = "http://localhost:8000/api/";

const api = axios.create({
  baseURL: API_BASE,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) config.headers.Authorization = Bearer ${token};
  return config;
});

// Response interceptor to handle token refresh once on 401
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;
    if (err.response && err.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refresh = localStorage.getItem("refresh_token");
      if (!refresh) {
        // no refresh -> force logout
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login";
        return Promise.reject(err);
      }
      try {
        const res = await axios.post(${API_BASE}auth/token/refresh/, { refresh });
        localStorage.setItem("access_token", res.data.access);
        api.defaults.headers.Authorization = Bearer ${res.data.access};
        originalRequest.headers.Authorization = Bearer ${res.data.access};
        return api(originalRequest);
      } catch (e) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login";
        return Promise.reject(e);
      }
    }
    return Promise.reject(err);
  }
);

