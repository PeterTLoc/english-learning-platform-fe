"use client"

import { usePathname } from "next/navigation"
import NavBar from "./NavBar"

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const hideNav = pathname === "/login" || pathname === "/register"

  return (
    <>
      {!hideNav && <NavBar />}
      {children}
    </>
  )
}
