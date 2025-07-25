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
import Link from "next/link";

const Page = () => {
  const [form, setForm] = useState<LoginFormData>(initialLoginFormData);
  const [errors, setErrors] = useState<LoginErrors>({});

  const router = useRouter();
  const { login, user, loading: authLoading } = useAuth();
  const { showToast } = useToast();

  // Redirect if already logged in
  useEffect(() => {
    if (user && !authLoading) {
      router.push(user.role === UserRole.ADMIN ? "/admin" : "/");
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
      console.log("test");
    } finally {
      // No local loading state to set
    }
  };

  const loginGoogle = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`;
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
      {/* Go Back Home Button */}
      <div className="absolute top-6 left-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors bg-black/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-gray-600"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          <span className="text-sm font-medium">Go back home</span>
        </Link>
      </div>

      <LoginForm
        form={form}
        errors={errors}
        isLoading={authLoading}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onGoogleLogin={loginGoogle}
      />
    </div>
  );
};

export default Page;
