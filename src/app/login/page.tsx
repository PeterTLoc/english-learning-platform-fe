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
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form className="flex flex-col" onSubmit={handleSubmit}>
        <h1 className="text-3xl">Sign in</h1>

        <div className="mt-6">
          <input
            className="input"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <p className="text-red-500 text-xs my-[2px]">
            {errors.email || "\u00A0"}
          </p>
        </div>

        <div>
          <input
            className="input"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <p className="text-red-500 text-xs my-[2px]">
            {errors.password || "\u00A0"}
          </p>
        </div>

        <button
          className="min-h-[32px] pt-[5px] pb-[3px] w-full rounded-[5px] text-[13px] bg-[#373737] hover:bg-[#3C3C3C] mt-1"
          type="submit"
        >
          Log in
        </button>

        {loginError && <p>{loginError}</p>}

        <div className="text-[13px] flex justify-between mt-1">
          <Link
            className="text-gray-300 hover:text-white hover:underline"
            href="/register"
          >
            Register now
          </Link>
          <Link
            className="text-gray-300 hover:text-white hover:underline"
            href="/forgot-password"
          >
            Forget password?
          </Link>
        </div>
      </form>
    </div>
  )
}

export default page
