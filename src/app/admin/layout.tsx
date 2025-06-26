"use client"

import AdminHeader from "@/components/admin/AdminHeader"
import AdminSidebar from "@/components/admin/AdminSidebar"
import { AuthGuard, RoleGuard, UserRole } from "@/components/guards"
import { useEffect } from "react"

// Import Flowbite JavaScript to make interactive components work
const importFlowbite = async () => {
  if (typeof document !== 'undefined') {
    await import('flowbite')
  }
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Initialize Flowbite on component mount
  useEffect(() => {
    importFlowbite()
  }, [])

  return (
    <AuthGuard>
      <RoleGuard allowedRoles={[UserRole.ADMIN]} fallbackPath="/">
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <AdminHeader />
          <AdminSidebar />
          
          <div className="p-4 sm:ml-64">
            <div className="p-4 mt-14">
              {children}
            </div>
          </div>
        </div>
      </RoleGuard>
    </AuthGuard>
  )
} 