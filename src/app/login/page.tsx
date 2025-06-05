"use client"

import { useAuth } from "@/context/AuthContext"
import { parseAxiosError } from "@/utils/apiErrors"
import Link from "next/link"
import { useRouter } from "next/navigation"
import React, { useState } from "react"

interface Errors {
  email?: string
  password?: string
}

type FormData = {
  email: string
  password: string
}

const initialFormData: FormData = {
  email: "",
  password: "",
}

const validate = (form: FormData): Errors => {
  const errors: Errors = {}

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const isValidPassword = (password: string) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,50}$/.test(password)

  if (!form.email) {
    errors.email = "Email is required"
  } else if (!isValidEmail(form.email)) {
    errors.email = "Invalid email format"
  }

  if (!form.password) {
    errors.password = "Password is required"
  } else if (!isValidPassword(form.password)) {
    errors.password =
      "Password must contain at least 1 lowercase letter, 1 uppercase letter, 1 number, 1 symbol, and be 8-50 characters long"
  }

  return errors
}

const page = () => {
  const [form, setForm] = useState<FormData>(initialFormData)
  const [errors, setErrors] = useState<Errors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [serverError, setServerError] = useState("")

  const router = useRouter()
  const { login } = useAuth()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setServerError("")

    const validationErrors = validate(form)

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setErrors({})
    setIsLoading(true)

    try {
      await login(form)

      router.push("/")
    } catch (error: unknown) {
      const { message } = parseAxiosError(error)
      setServerError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form
        className="flex flex-col bg-[#2B2B2B] p-5 pb-[26px] border border-[#1D1D1D] rounded-md"
        onSubmit={handleSubmit}
      >
        <h1 className="text-[28px] font-bold self-center mb-5">Sign in</h1>

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
            onChange={handleChange}
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
  )
}

export default page
