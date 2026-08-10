import { create } from "zustand";
import toast from "react-hot-toast";
import api from "../lib/axios";

export const useAuthStore = create((set, get) => ({
  user: null,
  isCheckingAuth: true,
  isLoggingIn: false,
  isSigningUp: false,
  isSendingResetLink: false,

  checkAuth: async () => {
    try {
      const res = await api.get("/auth/me");
      set({ user: res.data.user });
    } catch {
      set({ user: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (formData) => {
    set({ isSigningUp: true });
    try {
      const res = await api.post("/auth/register", formData);
      set({ user: res.data.user });
      toast.success("Account created! Welcome to Verve.");
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
      return false;
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (formData) => {
    set({ isLoggingIn: true });
    try {
      const res = await api.post("/auth/login", formData);
      set({ user: res.data.user });
      toast.success("Welcome back!");
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
      return false;
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
      set({ user: null });
      toast.success("Logged out");
    } catch (err) {
      toast.error("Logout failed");
    }
  },

  forgotPassword: async (email) => {
    set({ isSendingResetLink: true });
    try {
      const res = await api.post("/auth/forgot-password", { email });
      toast.success(res.data.message);
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
      return false;
    } finally {
      set({ isSendingResetLink: false });
    }
  },

  resetPassword: async (token, password) => {
    try {
      const res = await api.post(`/auth/reset-password/${token}`, { password });
      toast.success(res.data.message);
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || "Reset failed");
      return false;
    }
  },

  changePassword: async (currentPassword, newPassword) => {
    try {
      const res = await api.post("/auth/change-password", { currentPassword, newPassword });
      toast.success(res.data.message);
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update password");
      return false;
    }
  },
}));
