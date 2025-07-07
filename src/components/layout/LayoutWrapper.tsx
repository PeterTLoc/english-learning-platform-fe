"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import RoleGuard, { UserRole } from "../guards/RoleGuard";
import Header from "./Header";
import TutorTrigger from "./TutorTrigger";
import TutorModal from "./TutorModal";

// Dynamically import components
const NavBar = dynamic(() => import("./Header"), { ssr: false });
const Footer = dynamic(() => import("./Footer"), { ssr: false });
const AdminHeader = dynamic(() => import("../admin/AdminHeader"), {
  ssr: false,
});
const AdminSidebar = dynamic(() => import("../admin/AdminSidebar"), {
  ssr: false,
});

// Import Flowbite JavaScript for admin interactive components
const importFlowbite = async () => {
  if (typeof window !== "undefined") {
    try {
      await import("flowbite");
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

  const [isTutorOpen, setIsTutorOpen] = useState(true);
  const [isTutorModalOpen, setIsTutorModalOpen] = useState(false);

  // Determine which layout to use
  const isAdminLayout = pathname?.startsWith("/admin");

  // Pages that don't need navigation
  const hideNav =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/forgot-password";

  const hideTutor = pathname === "/login" || pathname === "/register"; //exam + exercise path;

  // Initialize Flowbite for admin layout
  useEffect(() => {
    if (isAdminLayout) {
      importFlowbite();
    }
  }, [isAdminLayout]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsTutorModalOpen((open) => {
          if (!open) setIsTutorOpen(false);
          return !open;
        });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Admin layout
  if (isAdminLayout) {
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
      {!hideNav && <Header />}

      {/* Fullscreen gradient below navbar */}
      {/* <div className="fixed top-[84px] left-0 w-full h-[calc(100vh-84px)] z-0 bg-gradient-to-r from-black/10 via-gray-200/40 to-gray-300 pointer-events-none" /> */}
      <main>{children}</main>
      {!hideTutor && (
        <>
          <TutorTrigger
            isOpen={isTutorOpen}
            onClick={() => {
              setIsTutorModalOpen(true);
              setIsTutorOpen(false);
            }}
          />
        </>
      )}
      {!hideTutor && (
        <TutorModal
          isOpen={isTutorModalOpen}
          onClose={() => {
            setIsTutorModalOpen(false);
            setIsTutorOpen(true);
          }}
        />
      )}
      {!hideNav && <Footer />}
    </div>
  );
}
