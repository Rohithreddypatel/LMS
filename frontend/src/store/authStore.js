import { create } from "zustand";
import api from "../services/api";

const loadUser = () => {
  try { return JSON.parse(localStorage.getItem("lms_user")); } catch { return null; }
};

export const useAuthStore = create((set) => ({
  user:            loadUser(),
  isAuthenticated: !!loadUser(),
  loading:         false,
  error:           null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("lms_token", data.token);
      localStorage.setItem("lms_user",  JSON.stringify(data.user));
      set({ user: data.user, isAuthenticated: true, loading: false });
      return data.user;
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed";
      set({ error: msg, loading: false });
      throw new Error(msg);
    }
  },

  signup: async (name, email, password) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post("/auth/signup", { name, email, password });
      localStorage.setItem("lms_token", data.token);
      localStorage.setItem("lms_user",  JSON.stringify(data.user));
      set({ user: data.user, isAuthenticated: true, loading: false });
      return data.user;
    } catch (err) {
      const msg = err.response?.data?.message || "Signup failed";
      set({ error: msg, loading: false });
      throw new Error(msg);
    }
  },

  logout: () => {
    localStorage.removeItem("lms_token");
    localStorage.removeItem("lms_user");
    set({ user: null, isAuthenticated: false });
  },

  clearError: () => set({ error: null }),
}));
