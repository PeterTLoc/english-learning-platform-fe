"use client"

import { parseAxiosError } from "@/utils/apiErrors"
import axios from "axios"
import { createContext, useContext, useState } from "react"

interface User {
  id: number
  email: string
  role: string
  name: string
}

interface LoginForm {
  email: string
  password: string
}

interface RegisterForm {
  name: string
  email: string
  password: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (formData: { email: string; password: string }) => Promise<void>
  register: (formData: {
    name: string
    email: string
    password: string
  }) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }

  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  if (!apiUrl) {
    throw new Error(
      "NEXT_PUBLIC_API_URL must be defined in environment variables."
    )
  }

  const api = axios.create({
    baseURL: apiUrl,
    withCredentials: true,
  })

  const login = async (formData: LoginForm): Promise<void> => {
    setLoading(true)
    try {
      console.log("Login payload:", formData);

      const response = await api.post<User>("/api/auth/login", formData)

      setUser(response.data)
    } catch (error) {
      const parsed = parseAxiosError(error)

      console.error("Login failed:", parsed.message)
      throw new Error(parsed.message)
    } finally {
      setLoading(false)
    }
  }

  const register = async (formData: RegisterForm): Promise<void> => {
    setLoading(true)
    try {
      const response = await api.post<User>("/api/auth/signup", formData)

      setUser(response.data)
    } catch (error) {
      const parsed = parseAxiosError(error)

      console.error("Register failed:", parsed.message)
      throw new Error(parsed.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register }}>
      {children}
    </AuthContext.Provider>
  )
}
