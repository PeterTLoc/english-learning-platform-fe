"use client";

import React, { useState } from "react";
import { useToast } from "@/context/ToastContext";
import { sendResetPasswordPin } from "@/services/authService";

const Page = () => {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ email?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

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
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form
        className="flex flex-col bg-[#2B2B2B] p-6 border border-[#1D1D1D] rounded-md"
        onSubmit={handleSubmit}
      >
        <h1 className="text-[26px] font-bold self-center">Forgot password</h1>

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

        <button
          className="mt-7 self-end min-w-[130px] min-h-[32px] pt-[5px] pb-[3px] w-fit rounded-[5px] text-[13px] text-black bg-[#4CC2FF] border-[#42A7DC] hover:bg-[#48B2E9]"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Send PIN"}
        </button>
      </form>
    </div>
  );
};

export default Page;
