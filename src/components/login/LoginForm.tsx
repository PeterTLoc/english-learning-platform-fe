import { LoginErrors, LoginFormData } from "@/types/auth/auth";
import Link from "next/link";
import React from "react";

interface Props {
  form: LoginFormData;
  errors: LoginErrors;
  isLoading: boolean;
  serverError: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const LoginForm = ({
  form,
  errors,
  isLoading,
  serverError,
  onChange,
  onSubmit,
}: Props) => {
  return (
    <div>
      <form
        className="flex flex-col bg-black/50 p-5 pb-[26px] border border-[#1D1D1D] rounded-md"
        onSubmit={onSubmit}
      >
        <h1 className="text-[28px] font-bold self-center mb-5">Sign in</h1>

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
          {errors.email && (
            <p className="text-red-500 text-xs w-[280px]">
              {errors.email || "\u00A0"}
            </p>
          )}
        </div>

        <div className="mb-[15px]">
          <input
            className="input"
            placeholder="Password"
            type="password"
            name="password"
            value={form.password}
            onChange={onChange}
            required
          />
          {errors.password && (
            <p className="text-red-500 text-xs w-[280px]">
              {errors.password || "\u00A0"}
            </p>
          )}
        </div>

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
          className="mt-[30px] text-black w-full min-h-[33px] pt-[5px] pb-[3px] rounded-[5px] text-[13px] bg-[#4CC2FF] border-[#42A7DC] hover:bg-[#48B2E9]"
          type="submit"
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>

      {serverError && (
        <p className="text-red-500 text-xs width-[280px] mt-2 mx-auto w-[280px] text-center">
          {serverError}
        </p>
      )}
    </div>
  );
};

export default LoginForm;
