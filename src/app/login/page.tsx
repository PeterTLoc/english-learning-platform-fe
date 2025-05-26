"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import React, { useState } from "react"

type User = {
  email: string
  password: string
}

const page = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  )
  const [loginError, setLoginError] = useState("")
  const router = useRouter()

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoginError("")
    const newErrors: { email?: string; password?: string } = {}

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

    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
      return
    }

    setTimeout(() => {
      const user: User | null = JSON.parse(
        localStorage.getItem("user") || "null"
      )

      if (user && email === user.email && password === user.password) {
        router.push("/")
      } else {
        setLoginError("Invalid email or password")
      }
    }, 1000)
  }

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
      <form className="flex flex-col text-sm" onSubmit={handleSubmit}>
        <h1 className="text-3xl mb-8">Sign in</h1>

        <div className="mb-1">
          <input
            className="input"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <p className="text-red-500 text-[11px]">{errors.email || "\u00A0"}</p>
        </div>

        <div className="mb-1">
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
        </div>

        <button
          type="submit"
          className="mt-6 w-full min-h-[32px] pt-[5px] pb-[3px] self-end rounded-[5px] text-[13px] bg-[#373737] hover:bg-[#3C3C3C]"
        >
          Log in
        </button>
        <p className="text-red-500 text-[11px] mt-[6px] mb-2">
          {loginError || "\u00A0"}
        </p>

        <div className="flex justify-between mt-1 mb-10 text-gray-300 text-[13px]">
          <Link href="/register" className="hover:underline hover:text-white">
            Create a new account
          </Link>
          <Link
            href="/forgot-password"
            className="hover:underline hover:text-white"
          >
            Forget password?
          </Link>
        </div>
      </form>
    </div>
  )
}

export default page
