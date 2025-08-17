import React, { useState } from "react";
import { SignUpForm } from "@/components/signup-form";
import { axiosInstance } from "@/lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/useAuthStore";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [isSigningUp, setIsSigningUp] = useState(false);

  const updateAuthUser = useAuthStore((state) => state.updateAuthUser);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      toast.error("Full name is required");
      return false;
    }
    if (!formData.email.trim()) {
      toast.error("Email is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("Invalid email format");
      return false;
    }
    if (!formData.password) {
      toast.error("Password is required");
      return false;
    }
    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission

    const isValid = validateForm();
    if (!isValid) return;

    setIsSigningUp(true);
    try {
      const res = await axiosInstance.post("/auth/signup", formData);
      updateAuthUser(res.data.data);
      toast.success("Account created successfully");
    } catch (error) {
      console.error("Signup error:", error);
      toast.error(
        error.response?.data?.message ||
          "An error occurred during account creation."
      );
    } finally {
      setIsSigningUp(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignUpForm
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          isSigningUp={isSigningUp}
        />
      </div>
    </div>
  );
};

export default SignUpPage;
