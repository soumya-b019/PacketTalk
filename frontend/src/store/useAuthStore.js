import { create } from "zustand";
import { axiosInstance } from "@/lib/axios.js";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authUser: null,
  onlineUsers: [],

  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,

  updateAuthUser: (userDetails) =>
    set({
      authUser: userDetails,
    }),

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({
        authUser: res.data.data,
      });
    } catch (error) {
      console.log("Error in checkAuth: ", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred during logging out."
      );
    }
  },
}));
