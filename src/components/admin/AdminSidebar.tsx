"use client"

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { 
  BadgeCheck, 
  BookOpen, 
  Home, 
  LayoutDashboard, 
  Settings, 
  User2, 
  Users
} from 'lucide-react'

interface SidebarItem {
  name: string
  path: string
  icon: React.ReactNode
}

export default function AdminSidebar() {
  const pathname = usePathname()
  
  const sidebarItems: SidebarItem[] = [
    {
      name: 'Dashboard',
      path: '/admin',
      icon: <LayoutDashboard className="w-5 h-5" />
    },
    {
      name: 'Users',
      path: '/admin/users',
      icon: <Users className="w-5 h-5" />
    },
    {
      name: 'Courses',
      path: '/admin/courses',
      icon: <BookOpen className="w-5 h-5" />
    },
    {
      name: 'Memberships',
      path: '/admin/memberships',
      icon: <BadgeCheck className="w-5 h-5" />
    },
    {
      name: 'Site Settings',
      path: '/admin/settings',
      icon: <Settings className="w-5 h-5" />
    },
  ]

  return (
    <aside id="admin-sidebar" className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700" aria-label="Admin sidebar">
      <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
        <ul className="space-y-2 font-medium">
          {sidebarItems.map((item) => (
            <li key={item.path}>
              <Link 
                href={item.path}
                className={`flex items-center p-3 rounded-lg ${
                  pathname === item.path
                    ? 'bg-blue-700 text-white'
                    : 'text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white'
                }`}
              >
                {item.icon}
                <span className="ms-3">{item.name}</span>
              </Link>
            </li>
          ))}
          
          <li className="mt-10">
            <Link 
              href="/"
              className="flex items-center p-3 text-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
            >
              <Home className="w-5 h-5" />
              <span className="ms-3">Back to Site</span>
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  )
} 