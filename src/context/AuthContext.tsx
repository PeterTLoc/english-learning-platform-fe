"use client"

import api from "@/lib/api"
import { LoginFormPayload, RegisterFormPayload, User } from "@/types/auth/auth"
import { parseAxiosError } from "@/utils/apiErrors"
import * as authService from "@/services/authService"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AuthGuard } from "@/components/guards"

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (formData: LoginFormPayload) => Promise<void>
  register: (formData: RegisterFormPayload) => Promise<void>
  logout: () => Promise<void>
}

// Default context value
const defaultContextValue: AuthContextType = {
  user: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {}
}

const AuthContext = createContext<AuthContextType>(defaultContextValue)

export const useAuth = () => {
  const context = useContext(AuthContext)
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

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
      
      // Redirect to home page after logout
      router.push('/')
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
        console.log("Not authenticated:", error)
        setUser(null)
      } finally {
        // Always set loading to false, even if there's an error
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  // Always render children, even while loading
  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      <AuthGuard>
        {children}
      </AuthGuard>
    </AuthContext.Provider>
  )
}
