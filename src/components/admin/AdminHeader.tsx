"use client"

import { useAuth } from '@/context/AuthContext'
import { Menu } from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'
import Dropdown from '../ui/Dropdown'
import UserAvatar from '../ui/UserAvatar'

export default function AdminHeader() {
  const { user } = useAuth()
  
  useEffect(() => {
    // Initialize Flowbite drawer/sidebar
    const initFlowbite = async () => {
      const { initFlowbite } = await import('flowbite')
      initFlowbite()
    }
    
    initFlowbite()
  }, [])
  
  const dropdownItems = [
    {
      label: 'Profile',
      href: '/admin/profile'
    },
    {
      label: 'Settings',
      href: '/admin/settings'
    }
  ]
  
  const headerContent = (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <UserAvatar 
          username={user?.username} 
          avatarUrl={user?.avatar} 
          size="md" 
        />
        <div>
          <p className="text-sm font-medium text-white">
            {user?.username || 'Admin User'}
          </p>
          <p className="text-xs text-[#CFCFCF] truncate">
            {user?.email || 'admin@example.com'}
          </p>
        </div>
      </div>
    </div>
  )
  
  return (
    <nav className="fixed top-0 z-50 w-full bg-[#202020] border-b border-[#1D1D1D]">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start">
            <button 
              data-drawer-target="admin-sidebar" 
              data-drawer-toggle="admin-sidebar" 
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
              <Dropdown 
                trigger={
                  <UserAvatar 
                    username={user?.username} 
                    avatarUrl={user?.avatar} 
                    size="sm" 
                    className="bg-[#4CC2FF] cursor-pointer"
                  />
                }
                items={dropdownItems}
                headerContent={headerContent}
                align="right"
              />
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
} 