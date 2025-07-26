"use client";

import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { parseAxiosError } from "@/utils/apiErrors";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { RegisterErrors, RegisterFormData } from "@/types/auth/auth";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";

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

// Password requirement check functions
const checkPasswordRequirements = (password: string) => {
  return {
    length: password.length >= 8 && password.length <= 50,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    symbol: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };
};

const Page = () => {
  const [form, setForm] = useState<RegisterFormData>(initialFormData);
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);

  const router = useRouter();
  const { register } = useAuth();
  const { showToast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    
    // Show password requirements when user starts typing password
    if (name === 'password' && value.length > 0) {
      setShowPasswordRequirements(true);
    } else if (name === 'password' && value.length === 0) {
      setShowPasswordRequirements(false);
    }
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

      <form
        className="flex flex-col bg-[#2b2b2b] p-5 pb-[26px] border border-[#1D1D1D] rounded-md"
        onSubmit={handleSubmit}
      >
        <h1 className="text-[28px] font-bold self-center mb-6">
          Create a new account
        </h1>

        <div className="mb-4">
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
            <p className="text-red-500 text-sm w-[280px]">
              {errors.name || "\u00A0"}
            </p>
          )}
        </div>

        <div className="mb-4">
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
            <p className="text-red-500 text-sm w-[280px]">
              {errors.email || "\u00A0"}
            </p>
          )}
        </div>

        <div className="mb-[15px] relative">
          <input
            className="input pr-10"
            placeholder="Password"
            type={showPassword ? "text" : "password"}
            name="password"
            value={form.password}
            onChange={handleChange}
            onFocus={() => form.password.length > 0 && setShowPasswordRequirements(true)}
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
            <p className="text-red-500 text-sm w-[280px]">
              {errors.password || "\u00A0"}
            </p>
          )}
        </div>

        {/* Password Requirements */}
        {showPasswordRequirements && (
          <div className="bg-[#1D1D1D] border border-[#333] rounded-md p-4 space-y-2 mb-4">
            <h4 className="text-sm font-semibold text-gray-300 mb-3">
              Password Requirements
            </h4>
            {(() => {
              const requirements = checkPasswordRequirements(form.password);
              return (
                <>
                  <div className={`flex items-center gap-2 text-xs ${
                    requirements.length ? 'text-green-400' : 'text-gray-500'
                  }`}>
                    <span className={requirements.length ? 'text-green-400' : 'text-gray-500'}>
                      {requirements.length ? '✓' : '○'}
                    </span>
                    <span>Between 8-50 characters long</span>
                  </div>
                  <div className={`flex items-center gap-2 text-xs ${
                    requirements.lowercase ? 'text-green-400' : 'text-gray-500'
                  }`}>
                    <span className={requirements.lowercase ? 'text-green-400' : 'text-gray-500'}>
                      {requirements.lowercase ? '✓' : '○'}
                    </span>
                    <span>At least 1 lowercase letter</span>
                  </div>
                  <div className={`flex items-center gap-2 text-xs ${
                    requirements.uppercase ? 'text-green-400' : 'text-gray-500'
                  }`}>
                    <span className={requirements.uppercase ? 'text-green-400' : 'text-gray-500'}>
                      {requirements.uppercase ? '✓' : '○'}
                    </span>
                    <span>At least 1 uppercase letter</span>
                  </div>
                  <div className={`flex items-center gap-2 text-xs ${
                    requirements.number ? 'text-green-400' : 'text-gray-500'
                  }`}>
                    <span className={requirements.number ? 'text-green-400' : 'text-gray-500'}>
                      {requirements.number ? '✓' : '○'}
                    </span>
                    <span>At least 1 number</span>
                  </div>
                  <div className={`flex items-center gap-2 text-xs ${
                    requirements.symbol ? 'text-green-400' : 'text-gray-500'
                  }`}>
                    <span className={requirements.symbol ? 'text-green-400' : 'text-gray-500'}>
                      {requirements.symbol ? '✓' : '○'}
                    </span>
                    <span>At least 1 symbol (!@#$%^&*...)</span>
                  </div>
                </>
              );
            })()}
          </div>
        )}

        <div className="mb-[15px] relative">
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
            <p className="text-red-500 text-sm w-[280px]">
              {errors.confirmPassword || "\u00A0"}
            </p>
          )}
        </div>

        <button
          className="text-black w-full min-h-[33px] pt-[5px] pb-[3px] rounded-[5px] text-[13px] bg-[#4CC2FF] border-[#42A7DC] hover:bg-[#48B2E9] relative"
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

        <div className="text-sm flex justify-center mt-4">
          <Link
            className="text-[#CFCFCF] hover:text-white hover:underline"
            href="/login"
          >
            Already have an account? Sign in
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Page;
