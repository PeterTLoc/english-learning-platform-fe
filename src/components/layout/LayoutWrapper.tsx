"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import RoleGuard, { UserRole } from "../guards/RoleGuard";
import Header from "./Header";
import Footer from "./Footer";
import TutorTrigger from "./TutorTrigger";
import TutorModal from "./TutorModal";

// Only dynamically import admin components to reduce initial bundle
const AdminHeader = dynamic(() => import("../admin/AdminHeader"), {
  ssr: false,
  loading: () => <div className="h-16 bg-[#2b2b2b]" />,
});
const AdminSidebar = dynamic(() => import("../admin/AdminSidebar"), {
  ssr: false,
  loading: () => <div className="w-64 bg-[#2b2b2b]" />,
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
    const hideNav =
      pathname === "/login" ||
      pathname === "/register" ||
      pathname === "/forgot-password";
    const hideTutor =
      pathname === "/login" ||
      pathname === "/register" ||
      pathname === "/forgot-password" ||
      pathname.includes("/exercise") ||
      pathname.includes("/tests");
    return { isAdminLayout, hideNav, hideTutor };
  }, [pathname]);

  const [isTutorOpen, setIsTutorOpen] = useState(true);
  const [isTutorModalOpen, setIsTutorModalOpen] = useState(false);

  // Load Flowbite only for admin pages
  useEffect(() => {
    if (layoutConfig.isAdminLayout) {
      loadFlowbite();
    }
  }, [layoutConfig.isAdminLayout]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsTutorModalOpen((open) => {
          if (!open) {
            setIsTutorOpen(false);
            setIsTutorModalOpen(true);
          } else {
            setIsTutorOpen(true);
            setIsTutorModalOpen(false);
          }
          return open;
        });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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
      {!layoutConfig.hideTutor && (
        <>
          <TutorTrigger
            isOpen={isTutorOpen}
            onClick={() => {
              setIsTutorModalOpen(true);
              setIsTutorOpen(false);
            }}
          />
          <TutorModal
            isOpen={isTutorModalOpen}
            onClose={() => {
              setIsTutorModalOpen(false);
              setIsTutorOpen(true);
            }}
          />
        </>
      )}
      {!layoutConfig.hideNav && <Footer />}
    </div>
  );
}
