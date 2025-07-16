"use client";

import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { parseAxiosError } from "@/utils/apiErrors";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { LoginErrors, LoginFormData } from "@/types/auth/auth";
import LoginForm from "@/components/login/LoginForm";
import { validateLoginForm } from "@/utils/auth";
import { initialLoginFormData } from "@/constants/forms";
import { UserRole } from "@/components/guards/RoleGuard";

const Page = () => {
  const [form, setForm] = useState<LoginFormData>(initialLoginFormData);
  const [errors, setErrors] = useState<LoginErrors>({});

  const router = useRouter();
  const { login, user, loading: authLoading } = useAuth();
  const { showToast } = useToast();

  // Redirect if already logged in
  useEffect(() => {
    if (user && !authLoading) {
      router.push(user.role === UserRole.ADMIN ? '/admin' : '/');
    } 
  }, [user, authLoading, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof LoginErrors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Prevent multiple submissions
    if (authLoading) return;

    const validationErrors = validateLoginForm(form);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    try {
      await login(form);
      showToast("Login successful!", "success");
    } catch (error: any) {
      const parsedError = parseAxiosError(error);
      showToast(parsedError.message, "error");
      console.log("test")
    } finally {
      // No local loading state to set
    }
  };

  // Show loading state while checking auth status
  if (authLoading) {
    return (
      <div className="bg-[url(https://wallpapercrafter.com/desktop/269688-knowledge.jpg)] flex flex-col items-center justify-center min-h-screen">
        <div className="bg-black/70 p-5 rounded-md">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4CC2FF]"></div>
          </div>
        </div>
      </div>
    );
  }

  // Don't show login form if already logged in
  if (user) return null;

  return (
    <div className="bg-[url(https://wallpapercrafter.com/desktop/269688-knowledge.jpg)] flex flex-col items-center justify-center min-h-screen">
      <LoginForm
        form={form}
        errors={errors}
        isLoading={authLoading}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default Page;
