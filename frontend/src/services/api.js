import axios from "axios";

const api = axios.create({
  baseURL: "https://lms-backend-zxng.onrender.com/api",
  timeout: 10000,
});

api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem("lms_token");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("lms_token");
      localStorage.removeItem("lms_user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;
