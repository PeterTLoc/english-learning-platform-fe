"use client";

import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { parseAxiosError } from "@/utils/apiErrors";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { LoginErrors, LoginFormData } from "@/types/auth/auth";
import LoginForm from "@/components/login/LoginForm";
import { validateLoginForm } from "@/utils/auth";
import { initialLoginFormData } from "@/constants/forms";

const page = () => {
  const [form, setForm] = useState<LoginFormData>(initialLoginFormData);
  const [errors, setErrors] = useState<LoginErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { login } = useAuth();
  const { showToast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateLoginForm(form);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      // Login will handle redirect based on user role in AuthContext
      await login(form);
      showToast("Login successful!", "success");
    } catch (error: any) {
      console.error("Login error:", error);
      // Show error toast
      showToast(error.message || "Login failed. Please check your credentials and try again.", "error", 5000);
      // Ensure the isLoading state is set to false on error
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[url(https://wallpapercrafter.com/desktop/269688-knowledge.jpg)] flex flex-col items-center justify-center min-h-screen">
      <LoginForm
        form={form}
        errors={errors}
        isLoading={isLoading}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default page;
