"use client";

import React, { useState, useEffect } from "react";
import { useToast } from "@/context/ToastContext";
import { resetPassword } from "@/services/authService";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Eye, EyeOff } from "lucide-react";

const Page = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const email = searchParams.get("email");
  const pin = searchParams.get("pin");

  // Redirect if no email or pin is provided
  useEffect(() => {
    if (!email || !pin) {
      showToast("Invalid reset link", "error");
      router.push("/forgot-password");
    }
  }, [email, pin, router, showToast]);

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

  const validatePassword = (password: string) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,50}$/.test(password);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    
    // Show password requirements when user starts typing
    if (value.length > 0) {
      setShowPasswordRequirements(true);
    } else {
      setShowPasswordRequirements(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePassword(password)) {
      showToast("Password does not meet requirements", "error");
      return;
    }

    if (password !== confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(email!, password);
      showToast("Password reset successfully! Please log in with your new password.", "success");
      router.push("/login");
    } catch (error: any) {
      showToast(
        error.response?.data?.message || "Failed to reset password. Please try again.",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!email || !pin) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="bg-[url(https://wallpapercrafter.com/desktop/269688-knowledge.jpg)] flex flex-col items-center justify-center min-h-screen">
      {/* Go Back Button */}
      <div className="absolute top-6 left-6">
        <Link
          href="/reset-password"
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
          <span className="text-sm font-medium">Back to PIN verification</span>
        </Link>
      </div>

      <form
        className="flex flex-col bg-[#2b2b2b] p-6 border border-[#1D1D1D] rounded-md"
        onSubmit={handleSubmit}
      >
        <h1 className="text-[26px] font-bold self-center mb-8">Set New Password</h1>
        
        <p className="text-gray-300 text-sm text-center mb-6">
          Enter your new password for <span className="text-[#4CC2FF] font-medium">{email}</span>
        </p>

        {/* New Password */}
        <div className="mb-4 relative">
          <input
            className="input pr-10"
            placeholder="New Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={handlePasswordChange}
            onFocus={() => password.length > 0 && setShowPasswordRequirements(true)}
            required
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-200"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Password Requirements */}
        {showPasswordRequirements && (
          <div className="bg-[#1D1D1D] border border-[#333] rounded-md p-4 space-y-2 mb-4">
            <h4 className="text-sm font-semibold text-gray-300 mb-3">
              Password Requirements
            </h4>
            {(() => {
              const requirements = checkPasswordRequirements(password);
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

        {/* Confirm Password */}
        <div className="mb-6 relative">
          <input
            className="input pr-10"
            placeholder="Confirm New Password"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-200"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Submit Button */}
        <button
          className="w-full min-h-[33px] pt-[5px] pb-[3px] rounded-[5px] text-[13px] text-black bg-[#4CC2FF] border-[#42A7DC] hover:bg-[#48B2E9] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          type="submit"
          disabled={isLoading || !validatePassword(password) || password !== confirmPassword}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <LoadingSpinner size="small" className="mr-2" />
              Resetting Password...
            </span>
          ) : (
            "Reset Password"
          )}
        </button>

        {/* Back to Login */}
        <div className="mt-6 text-center">
          <Link
            href="/login"
            className="text-[#CFCFCF] hover:text-white text-sm transition-colors"
          >
            Back to login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Page; 