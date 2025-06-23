import { useAuth } from "@/context/AuthContext"
import { CircleUserRound } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import React from "react"
import UserDropdown from "./UserDropdown"

const NavBar = () => {
  const pathname = usePathname()
  const { user, loading } = useAuth()

  const links = [
    { href: "/", label: "Home" },
    { href: "/courses", label: "Courses" },
    { href: "/membership", label: "Membership" },
    { href: "/achievements", label: "Achievements" },
  ]

  return (
    <nav className="sticky top-0 z-50 h-[84px] bg-[#202020] border-b border-b-[#1D1D1D]">
      <div className="flex justify-between items-center h-full px-6">
        <Link href="/">ELS logo</Link>

        <div className="flex text-sm">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`hover:underline px-5 ${
                pathname === href
                  ? "text-[#4CC2FF] font-semibold underline"
                  : ""
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        <div>
          {!loading && user ? (
            <UserDropdown />
          ) : (
            <Link href="/login">
              <button
                className="flex items-center justify-center gap-1 text-white px-4 w-fit min-h-[33px] rounded-[5px] text-[13px] bg-[#373737] hover:opacity-75"
                type="submit"
              >
                <CircleUserRound strokeWidth={1.5} />
                <span className="pt-[5px] pb-[3px] whitespace-nowrap">
                  Sign in
                </span>
              </button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}

export default NavBar
