import { LoginErrors, LoginFormData } from "@/types/auth/auth";
import Link from "next/link";
import React, { useState } from "react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Eye, EyeOff } from "lucide-react";

interface Props {
  form: LoginFormData;
  errors: LoginErrors;
  isLoading: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const LoginForm = ({
  form,
  errors,
  isLoading,
  onChange,
  onSubmit,
}: Props) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div>
      <form
        className="flex flex-col bg-black/70 p-5 pb-[26px] border border-[#1D1D1D] rounded-md gap-2"
        onSubmit={onSubmit}
      >
        <h1 className="text-[28px] font-bold self-center">Sign in</h1>

        <div className="mb-4">
          <input
            className="input"
            placeholder="Email"
            type="email"
            name="email"
            value={form.email}
            onChange={onChange}
            required
          />
        </div>
        {errors.email && (
          <p className="text-red-500 text-sm w-[280px]">
            {errors.email || "\u00A0"}
          </p>
        )}

        <div className="mb-[15px] relative">
          <input
            className="input pr-10"
            placeholder="Password"
            type={showPassword ? "text" : "password"}
            name="password"
            value={form.password}
            onChange={onChange}
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
        </div>
        {errors.password && (
          <p className="text-red-500 text-sm w-[280px]">
            {errors.password || "\u00A0"}
          </p>
        )}

        <div className="text-sm flex justify-between">
          <Link
            className="text-[#CFCFCF] hover:text-white hover:underline"
            href="/forgot-password"
          >
            Forget password?
          </Link>
          <Link
            className="text-[#CFCFCF] hover:text-white hover:underline"
            href="/register"
          >
            Register now
          </Link>
        </div>

        <button
          className="text-black w-full min-h-[33px] pt-[5px] pb-[3px] rounded-[5px] text-[13px] bg-[#4CC2FF] border-[#42A7DC] hover:bg-[#48B2E9] relative"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <LoadingSpinner size="small" className="mr-2" />
              Logging in...
            </span>
          ) : (
            "Login"
          )}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
