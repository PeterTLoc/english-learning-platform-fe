import Link from "next/link"
import React from "react"

const NavBar = () => {
  return (
    <nav className="sticky top-0 z-50 h-16">
      <div className="flex justify-between items-center h-full px-6">
        <Link href="/">ELS logo</Link>

        <div className="space-x-6">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <Link href="/courses" className="hover:underline">
            Courses
          </Link>
        </div>

        <div>
          <Link href="/login">
            <button className="button">Sign in</button>
          </Link>
          {/* <Link href="/register">Register</Link> */}
        </div>
      </div>
    </nav>
  )
}

export default NavBar
