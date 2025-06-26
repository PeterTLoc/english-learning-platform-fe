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
    <>
      {!hideNav && (
        <>
          <NavBar />

          {/* Fullscreen gradient below navbar */}
          {/* <div className="fixed top-[84px] left-0 w-full h-[calc(100vh-84px)] z-0 bg-gradient-to-r from-black/10 via-gray-200/40 to-gray-300 pointer-events-none" /> */}
        </>
      )}

      <main>{children}</main>
      <Footer />
    </>
  )
}
