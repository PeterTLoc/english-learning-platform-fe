"use client"

import { useAuth } from '@/context/AuthContext'
import { Menu } from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'
import UserDropdown from '../layout/UserDropdown'

export default function AdminHeader() {
  const { user } = useAuth()
  
  useEffect(() => {
    // Initialize Flowbite drawer/sidebar
    const initFlowbite = async () => {
      const flowbite = await import('flowbite')
      flowbite.initDrawers()
    }
    
    initFlowbite()
  }, [])
  
  return (
    <nav className="fixed top-0 z-50 w-full bg-[#202020] border-b border-[#1D1D1D]">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start">
            <button 
              data-drawer-target="admin-sidebar" 
              data-drawer-toggle="admin-sidebar" 
              data-drawer-backdrop="true"
              aria-controls="admin-sidebar" 
              type="button" 
              className="inline-flex items-center p-2 text-sm text-[#CFCFCF] rounded-lg sm:hidden hover:bg-[#2D2D2D] focus:outline-none focus:ring-2 focus:ring-[#4CC2FF] transition-colors duration-300 ease-in-out"
            >
              <span className="sr-only">Open sidebar</span>
              <Menu className="w-6 h-6" />
            </button>
            <Link href="/admin" className="flex ml-2 md:mr-24">
              <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap text-white">Dashboard</span>
            </Link>
          </div>
          <div className="flex items-center">
            <div className="flex items-center ml-3">
              <UserDropdown />
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
} 