"use client";

import React, { useState, useEffect } from "react";
import { useToast } from "@/context/ToastContext";
import { confirmResetPasswordPin, sendResetPasswordPin } from "@/services/authService";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const Page = () => {
  const [pin, setPin] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const { showToast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const email = searchParams.get("email");

  // Redirect if no email is provided
  useEffect(() => {
    if (!email) {
      showToast("Email is required for password reset", "error");
      router.push("/forgot-password");
    }
  }, [email, router, showToast]);

  // Handle resend cooldown
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handlePinChange = (index: number, value: string) => {
    if (value.length > 1) return; // Prevent multiple characters
    
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`pin-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      // Move to previous input on backspace if current is empty
      const prevInput = document.getElementById(`pin-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const pinString = pin.join("");
    if (pinString.length !== 6) {
      showToast("Please enter the complete 6-digit PIN", "error");
      return;
    }

    setIsLoading(true);
    try {
      await confirmResetPasswordPin(email!, pinString);
      showToast("PIN verified successfully!", "success");
      // Redirect to new password page with email and pin
      router.push(`/reset-password/new-password?email=${email}&pin=${pinString}`);
    } catch (error: any) {
      showToast(
        error.response?.data?.message || "Invalid PIN. Please try again.",
        "error"
      );
      // Clear PIN on error
      setPin(["", "", "", "", "", ""]);
      // Focus first input
      document.getElementById("pin-0")?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendPin = async () => {
    if (resendCooldown > 0) return;
    
    setIsResending(true);
    try {
      await sendResetPasswordPin(email!);
      showToast("PIN resent to your email", "success");
      setResendCooldown(60); // 60 second cooldown
    } catch (error: any) {
      showToast(
        error.response?.data?.message || "Failed to resend PIN. Please try again.",
        "error"
      );
    } finally {
      setIsResending(false);
    }
  };

  if (!email) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="bg-[url(https://wallpapercrafter.com/desktop/269688-knowledge.jpg)] flex flex-col items-center justify-center min-h-screen">
      {/* Go Back Button */}
      <div className="absolute top-6 left-6">
        <Link
          href="/forgot-password"
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
          <span className="text-sm font-medium">Back to forgot password</span>
        </Link>
      </div>

      <form
        className="flex flex-col bg-[#2b2b2b] p-6 border border-[#1D1D1D] rounded-md"
        onSubmit={handleSubmit}
      >
        <h1 className="text-[26px] font-bold self-center mb-8">Enter PIN</h1>
        
        <p className="text-gray-300 text-sm text-center mb-6">
          We&apos;ve sent a 6-digit PIN to <span className="text-[#4CC2FF] font-medium">{email}</span>
        </p>

        {/* PIN Input */}
        <div className="flex justify-center gap-3 mb-6">
          {pin.map((digit, index) => (
            <input
              key={index}
              id={`pin-${index}`}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={digit}
              onChange={(e) => handlePinChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-12 text-center text-xl font-bold bg-[#1D1D1D] border border-gray-600 rounded-md text-white focus:border-[#4CC2FF] focus:outline-none transition-colors"
              autoFocus={index === 0}
            />
          ))}
        </div>

        {/* Submit Button */}
        <button
          className="w-full min-h-[33px] pt-[5px] pb-[3px] rounded-[5px] text-[13px] text-black bg-[#4CC2FF] border-[#42A7DC] hover:bg-[#48B2E9] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          type="submit"
          disabled={isLoading || pin.join("").length !== 6}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <LoadingSpinner size="small" className="mr-2" />
              Verifying...
            </span>
          ) : (
            "Verify PIN"
          )}
        </button>

        {/* Resend Section */}
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm mb-3">
            Didn&apos;t receive the PIN?
          </p>
          <button
            type="button"
            onClick={handleResendPin}
            disabled={isResending || resendCooldown > 0}
            className="text-[#4CC2FF] hover:text-[#48B2E9] text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isResending ? (
              <span className="flex items-center justify-center">
                <LoadingSpinner size="small" className="mr-2" />
                Resending...
              </span>
            ) : resendCooldown > 0 ? (
              `Resend in ${resendCooldown}s`
            ) : (
              "Resend PIN"
            )}
          </button>
        </div>

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