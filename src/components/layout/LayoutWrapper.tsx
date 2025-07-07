"use client";

import { usePathname } from "next/navigation";
import { useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import RoleGuard, { UserRole } from "../guards/RoleGuard";
import Header from "./Header";
import Footer from "./Footer";

// Only dynamically import admin components to reduce initial bundle
const AdminHeader = dynamic(() => import("../admin/AdminHeader"), {
  ssr: false,
  loading: () => <div className="h-16 bg-[#2b2b2b]" />
});
const AdminSidebar = dynamic(() => import("../admin/AdminSidebar"), {
  ssr: false,
  loading: () => <div className="w-64 bg-[#2b2b2b]" />
});

// Lazy load Flowbite only when needed
let flowbiteLoaded = false;
const loadFlowbite = async () => {
  if (typeof window !== "undefined" && !flowbiteLoaded) {
    try {
      await import("flowbite");
      flowbiteLoaded = true;
    } catch (error) {
      console.error("Error loading Flowbite:", error);
    }
  }
};

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Memoize layout calculations
  const layoutConfig = useMemo(() => {
    const isAdminLayout = pathname?.startsWith("/admin");
    const hideNav = pathname === "/login" || pathname === "/register" || pathname === "/forgot-password";
    
    return { isAdminLayout, hideNav };
  }, [pathname]);

  // Load Flowbite only for admin pages
  useEffect(() => {
    if (layoutConfig.isAdminLayout) {
      loadFlowbite();
    }
  }, [layoutConfig.isAdminLayout]);

  // Admin layout
  if (layoutConfig.isAdminLayout) {
    return (
      <RoleGuard allowedRoles={[UserRole.ADMIN]} fallbackPath="/">
        <div className="min-h-screen bg-[#2b2b2b] dark:bg-[#2b2b2b]">
          <AdminHeader />
          <AdminSidebar />
          <div className="p-4 sm:ml-64 bg-[#2b2b2b]">
            <div className="p-4 mt-14">{children}</div>
          </div>
        </div>
      </RoleGuard>
    );
  }

  // User layout
  return (
    <div className="flex flex-col min-h-screen">
      {!layoutConfig.hideNav && <Header />}
      <main>{children}</main>
      {!layoutConfig.hideNav && (
        <Footer />
      )}
    </div>
  );
}
