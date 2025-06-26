"use client"

import { usePathname } from "next/navigation"
import NavBar from "./NavBar"
import Footer from "./Footer"

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const hideNav =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/forgot-password"

  return (
    <div className="flex flex-col min-h-screen">
      {!hideNav && <NavBar />}

      <main className="flex-1">{children}</main>

      <Footer />
    </div>
  )
}
