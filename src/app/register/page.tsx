"use client"

import { useAuth } from "@/context/AuthContext"
import { parseAxiosError } from "@/utils/apiErrors"
import { register } from "module"
import { useRouter } from "next/navigation"
import React, { useState } from "react"

type Errors = {
  name?: string
  email?: string
  password?: string
  confirmPassword?: string
}

type FormData = {
  name: string
  email: string
  password: string
  confirmPassword: string
}

const initialFormData: FormData = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
}

const validate = (form: FormData): Errors => {
  const errors: Errors = {}

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const isValidPassword = (password: string) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,50}$/.test(password)

  if (!form.name) {
    errors.name = "Name is required"
  }

  if (!form.email) {
    errors.email = "Email is required"
  } else if (!isValidEmail(form.email)) {
    errors.email = "Email is invalid"
  }

  if (!form.password) {
    errors.password = "Password is required"
  } else if (!isValidPassword(form.password)) {
    errors.password =
      "Password must contain at least 1 lowercase letter, 1 uppercase letter, 1 number, 1 symbol, and be 8-50 characters long"
  }

  if (!form.confirmPassword) {
    errors.confirmPassword = "Please confirm your password"
  } else if (form.password !== form.confirmPassword) {
    errors.confirmPassword = "Passwords do not match"
  }

  return errors
}

const page = () => {
  const [form, setForm] = useState<FormData>(initialFormData)
  const [errors, setErrors] = useState<Errors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [serverError, setServerError] = useState("")

  const router = useRouter()
  const { register } = useAuth()

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
      await register(form)

      router.push("/login")
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

          <div>
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
              <p className="text-red-500 text-xs min-width-[280px]">
                {errors.password || "\u00A0"}
              </p>
            )}
          </div>

          <div>
            <input
              className="input"
              placeholder="Confirm Password"
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs min-width-[280px]">
                {errors.confirmPassword || "\u00A0"}
              </p>
            )}
          </div>

          <button
            className="mt-[30px] self-end min-w-[130px] min-h-[32px] pt-[5px] pb-[3px] w-fit rounded-[5px] text-[13px] text-black bg-[#4CC2FF] border-[#42A7DC] hover:bg-[#48B2E9]"
            type="submit"
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
        </div>
      </form>

      {serverError && (
        <p className="mt-2 text-red-500 text-xs min-width-[280px] mx-auto w-[280px] text-center">
          {serverError}
        </p>
      )}
    </div>
  )
}

export default page
