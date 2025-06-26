"use client";

import { useAuth } from "@/context/AuthContext";
import { parseAxiosError } from "@/utils/apiErrors";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { LoginErrors, LoginFormData } from "@/types/auth/auth";
import LoginForm from "@/components/login/LoginForm";
import { getRedirectUrl, validateLoginForm } from "@/utils/auth";
import { initialLoginFormData } from "@/constants/forms";

const page = () => {
  const [form, setForm] = useState<LoginFormData>(initialLoginFormData);
  const [errors, setErrors] = useState<LoginErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const router = useRouter();
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");

    const validationErrors = validateLoginForm(form);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      await login(form);

      // Get redirect URL from query params or default to dashboard
      const redirectUrl = getRedirectUrl();
      router.push(redirectUrl || '/');
    } catch (error: unknown) {
      const { message } = parseAxiosError(error);
      setServerError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[url(https://wallpapercrafter.com/desktop/269688-knowledge.jpg)] flex flex-col items-center justify-center min-h-screen">
      <LoginForm
        form={form}
        errors={errors}
        isLoading={isLoading}
        serverError={serverError}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default page;
