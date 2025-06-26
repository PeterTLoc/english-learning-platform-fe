"use client"

import { useAuth } from "@/context/AuthContext"
import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { getRequiredRoleForRoute, isAdminRoute } from "@/constants/routes"
import LoadingSpinner from "@/components/ui/LoadingSpinner"

// Define role values matching the backend enum
export enum UserRole {
  USER = 0,
  ADMIN = 1,
  GUEST = -1
}

interface RoleGuardProps {
  children: React.ReactNode
  allowedRoles?: UserRole[] // Optional array of roles, if not provided will use route config
  fallbackPath?: string // Optional path to redirect if role check fails
}

const RoleGuard: React.FC<RoleGuardProps> = ({ 
  children, 
  allowedRoles, 
  fallbackPath = '/' 
}) => {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    const checkRole = () => {
      // Can't determine authorization while still loading
      if (loading) return

      // If no user, not authorized
      if (!user) {
        setAuthorized(false)
        return
      }

      // If explicit roles are provided, use those
      if (allowedRoles) {
        if (allowedRoles.includes(user.role as UserRole)) {
          setAuthorized(true)
          return
        }
      } 
      // Otherwise, use route config
      else {
        const requiredRole = getRequiredRoleForRoute(pathname)
        
        // No role requirements, allow access
        if (requiredRole === null) {
          setAuthorized(true)
          return
        }
        
        // Admin route requires ADMIN role
        if (isAdminRoute(pathname) && user.role === UserRole.ADMIN) {
          setAuthorized(true)
          return
        }
        
        // User route requires USER or ADMIN role
        if (user.role === UserRole.USER || user.role === UserRole.ADMIN) {
          setAuthorized(true)
          return
        }
      }
      
      // If we get here, user doesn't have required role
      setAuthorized(false)
      router.push(fallbackPath)
    }

    // Only check role when not loading
    if (!loading) {
      checkRole()
    }
  }, [user, loading, router, pathname, allowedRoles, fallbackPath])

  // Show loading state
  if (loading) {
    return <LoadingSpinner fullScreen />
  }

  // Render children only if authorized
  return authorized ? <>{children}</> : null
}

export default RoleGuard 