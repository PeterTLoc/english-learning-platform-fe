"use client"

import api from "@/lib/api"
import { LoginFormPayload, RegisterFormPayload, User } from "@/types/auth/auth"
import { parseAxiosError } from "@/utils/apiErrors"
import * as authService from "@/services/authService"
import { createContext, useContext, useEffect, useState } from "react"

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (formData: LoginFormPayload) => Promise<void>
  register: (formData: RegisterFormPayload) => Promise<void>
  logout: () => Promise<void>
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

  const login = async (formData: LoginFormPayload): Promise<void> => {
    setLoading(true)
    try {
      const user = await authService.login(formData)

      setUser(user)
    } catch (error) {
      const parsed = parseAxiosError(error)

      console.error("Login failed:", parsed.message)
      throw new Error(parsed.message)
    } finally {
      setLoading(false)
    }
  }

  const register = async (formData: RegisterFormPayload): Promise<void> => {
    setLoading(true)
    try {
      const user = await authService.register(formData)

      setUser(user)
    } catch (error) {
      const parsed = parseAxiosError(error)

      console.error("Register failed:", parsed.message)
      throw new Error(parsed.message)
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
      setUser(null)
    } catch (error) {
      console.error("Logout failed: ", error)
    }
  }

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await authService.getCurrentUser()
        setUser(user)
      } catch (error) {
        console.log(error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
