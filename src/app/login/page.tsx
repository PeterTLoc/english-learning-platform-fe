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
  const [message, setMessage] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setMessage("")

    setTimeout(() => {
      const user: User | null = JSON.parse(
        localStorage.getItem("user") || "null"
      )

      if (user && email === user.email && password === user.password) {
        setMessage("Login successful!")

        setTimeout(() => {
          router.push("/")
        }, 1000)
      } else {
        setMessage("Invalid email or password")
      }
    }, 1000)
  }

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
      <form className="flex flex-col text-sm" onSubmit={handleSubmit}>
        <h1 className="text-3xl mb-8">Sign in</h1>

        <input
          className="input mb-3"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="input mb-4"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="flex justify-between mb-10 text-gray-300 text-[13px]">
          <Link href="/register" className="hover:underline hover:text-white">
            Create a new account
          </Link>
          <Link href="/forgot-password" className="hover:underline hover:text-white">
            Forget password?
          </Link>
        </div>

        <button
          type="submit"
          className="button"
        >
          Log in
        </button>

        {message && <p className="text-red-500 text-xs">{message}</p>}
      </form>
    </div>
  )
}

export default page
