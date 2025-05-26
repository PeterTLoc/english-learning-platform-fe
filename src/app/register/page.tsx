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
  const [message, setMessage] = useState("")
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      setMessage("Passwords do not match")
      return
    }

    const user: User = { email, password }
    localStorage.setItem("user", JSON.stringify(user))
    setMessage("Registered successfully! You can now log in.")
    setTimeout(() => {
      router.push("/login")
    }, 1000)
  }

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
      <form onSubmit={handleSubmit} className="flex flex-col">
        <h1 className="text-3xl mb-8">Create a new account</h1>

        <input
          className="input mb-3"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="input mb-3"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          className="input mb-10"
          placeholder="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button className="button" type="submit">
          Register
        </button>

        {message && <p className="text-green-600">{message}</p>}
      </form>
    </div>
  )
}

export default page
