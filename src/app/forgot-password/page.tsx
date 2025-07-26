"use client";

import React, { useState, useEffect } from "react";
import { useToast } from "@/context/ToastContext";
import { sendResetPasswordPin, confirmResetPasswordPin, resetPassword } from "@/services/authService";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Eye, EyeOff } from "lucide-react";

const Page = () => {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ email?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [pinSent, setPinSent] = useState(false);
  const [pin, setPin] = useState(["", "", "", "", "", ""]);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  const [pinVerified, setPinVerified] = useState(false);
  const { showToast } = useToast();
  const router = useRouter();

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

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

  const handleResendPin = async () => {
    if (resendCooldown > 0) return;
    
    setIsResending(true);
    try {
      await sendResetPasswordPin(email);
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

  const handleVerifyPin = async () => {
    const pinString = pin.join("");
    if (pinString.length !== 6) {
      showToast("Please enter the complete 6-digit PIN", "error");
      return;
    }

    setIsLoading(true);
    try {
      await confirmResetPasswordPin(email, pinString);
      showToast("PIN verified successfully!", "success");
      setPinVerified(true);
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

  const handleResetPassword = async () => {
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
      await resetPassword(email, password);
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const errors: { email?: string } = {};

    if (!email) {
      errors.email = "Email is required";
    } else if (!validateEmail(email)) {
      errors.email = "Invalid email address";
    }

    setErrors(errors);

    if (Object.keys(errors).length > 0) return;

    setIsLoading(true);

    try {
      await sendResetPasswordPin(email);
      showToast("Password reset PIN sent to your email.", "success", 5000);
      setPinSent(true);
    } catch (error: any) {
      showToast(
        error.response?.data?.message ||
          "Failed to send reset PIN. Please try again.",
        "error",
        5000
      );
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
        className="flex flex-col bg-[#2B2B2B] p-6 border border-[#1D1D1D] rounded-md"
        onSubmit={handleSubmit}
      >
        <h1 className="text-[26px] font-bold self-center mb-8">Forgot password</h1>

        {!pinSent ? (
          <>
            <div className="mt-[28px]">
              <input
                className="input"
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <p className="text-red-500 text-xs">{errors.email || "\u00A0"}</p>
            </div>

            <div className="mt-7 flex justify-between items-center">
              <Link
                href="/login"
                className="text-[#CFCFCF] hover:text-white hover:underline text-sm transition-colors"
              >
                Back to login
              </Link>
              
              <button
                className="min-w-[130px] min-h-[32px] pt-[5px] pb-[3px] w-fit rounded-[5px] text-[13px] text-black bg-[#4CC2FF] border-[#42A7DC] hover:bg-[#48B2E9]"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send PIN"}
              </button>
            </div>
          </>
        ) : pinVerified ? (
          <>
            <div className="text-center mb-6">
              <p className="text-green-400 text-sm mb-4">
                ✓ PIN verified successfully
              </p>
              <p className="text-gray-300 text-sm mb-6">
                Enter your new password
              </p>
            </div>

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

            <div className="mt-7 flex justify-between items-center">
              <Link
                href="/login"
                className="text-[#CFCFCF] hover:text-white hover:underline text-sm transition-colors"
              >
                Back to login
              </Link>
              
              <button
                type="button"
                onClick={handleResetPassword}
                disabled={isLoading || !validatePassword(password) || password !== confirmPassword}
                className="min-w-[120px] min-h-[32px] pt-[5px] pb-[3px] w-fit rounded-[5px] text-[13px] text-black bg-[#4CC2FF] border-[#42A7DC] hover:bg-[#48B2E9] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <LoadingSpinner size="small" />
                ) : (
                  "Reset Password"
                )}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="text-center mb-6">
              <p className="text-green-400 text-sm mb-4">
                ✓ PIN sent successfully to <span className="text-[#4CC2FF] font-medium">{email}</span>
              </p>
              <p className="text-gray-300 text-sm mb-6">
                Enter the 6-digit PIN from your email
              </p>
            </div>

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

            <div className="mt-7 flex justify-between items-center">
              <Link
                href="/login"
                className="text-[#CFCFCF] hover:text-white hover:underline text-sm transition-colors"
              >
                Back to login
              </Link>
              
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleResendPin}
                  disabled={isResending || resendCooldown > 0}
                  className="min-w-[120px] min-h-[32px] pt-[5px] pb-[3px] w-fit rounded-[5px] text-[13px] text-black bg-gray-500 border-gray-400 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isResending ? (
                    <span className="flex items-center justify-center">
                      <LoadingSpinner size="small" className="mr-2" />
                      Resending...
                    </span>
                  ) : resendCooldown > 0 ? (
                    `Resend (${resendCooldown}s)`
                  ) : (
                    "Resend PIN"
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={handleVerifyPin}
                  disabled={isLoading || pin.join("").length !== 6}
                  className="min-w-[120px] min-h-[32px] pt-[5px] pb-[3px] w-fit rounded-[5px] text-[13px] text-black bg-[#4CC2FF] border-[#42A7DC] hover:bg-[#48B2E9] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? (
                    <LoadingSpinner size="small" />
                  ) : (
                    "Verify PIN"
                  )}
                </button>
              </div>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default Page;
