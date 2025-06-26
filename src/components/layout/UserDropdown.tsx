"use client"

import { useAuth } from "@/context/AuthContext"
import Link from "next/link"
import { useRouter } from "next/navigation"
import React, { useEffect, useRef, useState } from "react"

const UserDropdown = () => {
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const route = useRouter()

  if (!user) return null

  const handleLogout = async () => {
    await logout()
    route.push("/login")
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#4CC2FF] border-[#1D1D1D] rounded-full h-8 w-8"
      >
        {user.username}
      </button>

      {isOpen && (
        <div className="text-sm w-[280px] p-5 gap-1 flex flex-col absolute right-0 mt-1 bg-[#2B2B2B] border border-[#1D1D1D] rounded-[5px] shadow-lg z-10">
          <Link href="/profile" className="p-2 hover:bg-[#323232] rounded">
            Profile
          </Link>
          <Link href="/" className="p-2 hover:bg-[#323232] rounded">
            link1
          </Link>
          <Link href="/" className="p-2 hover:bg-[#323232] rounded">
            link2
          </Link>
          <button className="hover:opacity-50" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </div>
  )
}

export default UserDropdown
