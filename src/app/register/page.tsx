"use client";

import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { parseAxiosError } from "@/utils/apiErrors";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { RegisterErrors, RegisterFormData } from "@/types/auth/auth";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Eye, EyeOff } from "lucide-react";

const initialFormData: RegisterFormData = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const validate = (form: RegisterFormData): RegisterErrors => {
  const errors: RegisterErrors = {};

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isValidPassword = (password: string) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,50}$/.test(password);

  if (!form.name) {
    errors.name = "Name is required";
  }

  if (!form.email) {
    errors.email = "Email is required";
  } else if (!isValidEmail(form.email)) {
    errors.email = "Email is invalid";
  }

  if (!form.password) {
    errors.password = "Password is required";
  } else if (!isValidPassword(form.password)) {
    errors.password =
      "Password must contain at least 1 lowercase letter, 1 uppercase letter, 1 number, 1 symbol, and be 8-50 characters long";
  }

  if (!form.confirmPassword) {
    errors.confirmPassword = "Please confirm your password";
  } else if (form.password !== form.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
};

const Page = () => {
  const [form, setForm] = useState<RegisterFormData>(initialFormData);
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();
  const { register } = useAuth();
  const { showToast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validate(form);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      await register(form);
      showToast("Registration successful! Please log in.", "success");
      router.push("/login");
    } catch (error: unknown) {
      const { message } = parseAxiosError(error);
      showToast(message, "error", 5000);

      // Optionally set form errors if the backend returns specific field errors
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as any;
        if (axiosError.response?.data?.errors) {
          setErrors(axiosError.response.data.errors);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form
        className="flex flex-col bg-[#2B2B2B] p-5 pb-[26px] border border-[#1D1D1D] rounded-md"
        onSubmit={handleSubmit}
      >
        <h1 className="text-[28px] font-bold self-center">
          Create a new account
        </h1>

        <div className="mt-[28px] w-fit flex flex-col gap-4">
          <div>
            <input
              className="input"
              placeholder="Name"
              type="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
            {errors.name && (
              <p className="text-red-500 text-xs min-width-[280px]">
                {errors.name || "\u00A0"}
              </p>
            )}
          </div>

          <div>
            <input
              className="input"
              placeholder="Email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
            {errors.email && (
              <p className="text-red-500 text-xs min-width-[280px]">
                {errors.email || "\u00A0"}
              </p>
            )}
          </div>

          <div className="relative">
            <input
              className="input pr-10"
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-200"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
            {errors.password && (
              <p className="text-red-500 text-xs min-width-[280px]">
                {errors.password || "\u00A0"}
              </p>
            )}
          </div>

          <div className="relative">
            <input
              className="input pr-10"
              placeholder="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-200"
              onClick={toggleConfirmPasswordVisibility}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs min-width-[280px]">
                {errors.confirmPassword || "\u00A0"}
              </p>
            )}
          </div>

          <button
            className="mt-[30px] self-end min-w-[130px] min-h-[32px] pt-[5px] pb-[3px] w-fit rounded-[5px] text-[13px] text-black bg-[#4CC2FF] border-[#42A7DC] hover:bg-[#48B2E9] relative"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <LoadingSpinner size="small" className="mr-2" />
                Registering...
              </span>
            ) : (
              "Register"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Page;
