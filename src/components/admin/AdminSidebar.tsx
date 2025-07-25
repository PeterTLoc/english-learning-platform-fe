"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  BadgeCheck,
  BookOpen,
  Home,
  LayoutDashboard,
  Newspaper,
  Settings,
  User2,
  Users,
  FileText,
  Trophy,
  X,
} from "lucide-react";

interface SidebarItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

export default function AdminSidebar() {
  const pathname = usePathname();

  const sidebarItems: SidebarItem[] = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: <Users className="w-5 h-5" />,
    },
    {
      name: "Courses",
      path: "/admin/courses",
      icon: <BookOpen className="w-5 h-5" />,
    },
    {
      name: "Memberships",
      path: "/admin/memberships",
      icon: <BadgeCheck className="w-5 h-5" />,
    },
    {
      name: "Blogs",
      path: "/admin/blogs",
      icon: <Newspaper className="w-5 h-5" />,
    },
    {
      name: "Flashcard Sets",
      path: "/admin/flashcard-sets",
      icon: <FileText className="w-5 h-5" />,
    },
    {
      name: "Achievements",
      path: "/admin/achievements",
      icon: <Trophy className="w-5 h-5" />,
    },
    {
      name: "Site Settings",
      path: "/admin/settings",
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        id="admin-sidebar-backdrop"
        className="fixed inset-0 z-30 bg-black/50 hidden sm:hidden"
        data-drawer-backdrop="admin-sidebar"
      />
      
      {/* Sidebar */}
      <aside
        id="admin-sidebar"
        className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-[#202020] border-r border-[#1D1D1D] sm:translate-x-0"
        aria-label="Admin sidebar"
        data-drawer="show"
        data-drawer-target="admin-sidebar"
        data-drawer-backdrop="true"
        data-drawer-placement="left"
      >
        <div className="h-full px-3 pb-4 overflow-y-auto bg-[#202020]">
          {/* Close button for mobile */}
          <div className="flex justify-end sm:hidden mb-4">
            <button
              type="button"
              data-drawer-hide="admin-sidebar"
              aria-controls="admin-sidebar"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
            >
              <X className="w-4 h-4" />
              <span className="sr-only">Close sidebar</span>
            </button>
          </div>
          
          <ul className="space-y-2 font-medium">
            {sidebarItems.map((item) => (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`flex items-center p-3 rounded-lg ${
                    pathname === item.path
                      ? "bg-[#4CC2FF] text-white"
                      : "text-white hover:bg-[#2D2D2D]"
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
                className="flex items-center p-3 text-white rounded-lg hover:bg-[#2D2D2D]"
              >
                <Home className="w-5 h-5" />
                <span className="ms-3">Back to Site</span>
              </Link>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
}
