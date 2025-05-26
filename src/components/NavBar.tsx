import Link from "next/link"
import React from "react"

const NavBar = () => {
  return (
    <nav className="bg-white h-16 text-black">
      <div className="flex justify-between items-center h-full px-6">
        <Link href="/">ELS logo</Link>

        <div className="space-x-6">
          <Link href="/" className="hover:underline">Home</Link>
          <Link href="/courses" className="hover:underline">Courses</Link>
        </div>

        <div>
          <Link href="/login">Log in</Link>
          <Link href="/register">Register</Link>
        </div>
      </div>
    </nav>
  )
}

export default NavBar
