"use client"

import { useRouter } from "next/navigation"
import React, { useState } from "react"

type User = {
  email: string
  password: string
}

const page = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [errors, setErrors] = useState<{
    email?: string
    password?: string
    confirmPassword?: string
  }>({})
  const router = useRouter()

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const newErrors: {
      email?: string
      password?: string
      confirmPassword?: string
    } = {}

    if (!email) {
      newErrors.email = "Email is required"
    } else if (!validateEmail(email)) {
      newErrors.email = "Email is invalid"
    }

    if (!password) {
      newErrors.password = "Password is required"
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) return

    const user: User = { email, password }
    localStorage.setItem("user", JSON.stringify(user))
    router.push("/login")
  }

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
      <form onSubmit={handleSubmit}>
        <h1 className="text-3xl mb-8">Create a new account</h1>
        <div className="w-fit flex flex-col">
          <input
            className="input"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <p className="text-red-500 text-[11px] mt-[6px] mb-2">
            {errors.email || "\u00A0"}
          </p>

          <input
            className="input"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <p className="text-red-500 text-[11px] mt-[6px] mb-2">
            {errors.password || "\u00A0"}
          </p>

          <input
            className="input"
            placeholder="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <p className="text-red-500 text-[11px] mt-[6px] mb-2">
            {errors.confirmPassword || "\u00A0"}
          </p>

          <button className="button self-end" type="submit">
            Register
          </button>
        </div>
      </form>
    </div>
  )
}

export default page
