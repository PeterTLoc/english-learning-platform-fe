"use client"

import React from "react"
import { useAuth } from "@/context/AuthContext"
import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { isPublicRoute } from "@/constants/routes"
import LoadingSpinner from "@/components/ui/LoadingSpinner"

interface AuthGuardProps {
  children: React.ReactNode
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    // Check authorization
    const checkAuth = () => {
      // If it's a public route, always allow access
      if (isPublicRoute(pathname)) {
        setAuthorized(true)
        return
      }
      
      // For protected routes, check if user exists
      if (!user && !loading) {
        setAuthorized(false)
        // Store the intended destination for post-login redirect
        sessionStorage.setItem('redirectAfterLogin', pathname)
        router.push('/login')
        return
      }
      
      // User is authenticated
      setAuthorized(true)
    }

    // Only check auth when not loading
    if (!loading) {
      checkAuth()
    }
  }, [user, loading, router, pathname])

  // Always render during loading to prevent flash of unauthorized content
  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-30">
        <LoadingSpinner />
        <p className="mt-3 text-white font-medium">Loading...</p>
      </div>
    )
  }

  // If it's a public route or user is authorized, render children
  return authorized || isPublicRoute(pathname) ? <>{children}</> : null
}

export default AuthGuard 