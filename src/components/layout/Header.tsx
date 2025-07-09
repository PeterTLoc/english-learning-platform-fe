import { useAuth } from "@/context/AuthContext";
import { CircleUserRound, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import UserDropdown from "./UserDropdown";

const Header = () => {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { href: "/", label: "Home" },
    { href: "/courses", label: "Courses" },
    { href: "/membership", label: "Membership" },
    { href: "/achievements", label: "Achievements" },
    { href: "/blog", label: "Blogs" },
    { href: "/flashcard-sets", label: "Flashcard" },
  ];

  return (
    /*
    <nav className="sticky top-0 z-50 h-[84px] bg-[#202020] shadow-lg shadow-[#ffffff80]">
      <div className="flex justify-between items-center h-full px-6">
        <Link href="/">ELS logo</Link>

        <div className="flex gap-8 text-lg">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`relative py-2 mx-1 transition-all duration-300 ease-in-out hover:text-[#4CC2FF] ${
                pathname === href
                  ? "text-[#4CC2FF] font-semibold"
                  : "text-white"
              } group`}
            >
              <span className="relative z-10">{label}</span>
              <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-[#4CC2FF] transform origin-bottom scale-x-0 transition-transform duration-300 ease-in-out group-hover:scale-x-100 ${
                pathname === href ? "scale-x-100" : ""
              }`}></span>
            </Link>
          ))}
        </div>

        <div>
          {!loading && user ? (
            <UserDropdown />
          ) : (
            <Link href="/login">
              <button
                className="flex items-center justify-center gap-1 text-white px-4 w-fit min-h-[33px] rounded-[5px] text-[13px] bg-[#373737] hover:bg-[#4a4a4a] transition-all duration-300 ease-in-out transform hover:scale-105"
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
    */
    <nav className="sticky top-0 z-50 h-[64px] bg-[#202020] shadow-lg shadow-zinc-600/10">
      <div className="flex justify-between items-center h-full px-4 sm:px-6">
        {/* Logo */}
        <div className="flex items-center gap-2.5 pr-4">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold">ELS</span>
            <span className="h-7 w-[1px] bg-[#8C8C8C] mx-2"></span>
            <span className="text-lg">Learning</span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-8 text-sm scale-x-115">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`relative py-2 mx-1 text-[1rem] transition-all duration-300 ease-in-out hover:text-[#4CC2FF] ${
                pathname === href ? "text-[#4CC2FF] font-semibold" : "subtext"
              } group`}
            >
              <span className="relative z-10">{label}</span>
              <span
                className={`absolute bottom-0 left-0 w-full h-0.5 bg-[#4CC2FF] transform origin-bottom scale-x-0 transition-transform duration-300 ease-in-out group-hover:scale-x-100 ${
                  pathname === href ? "scale-x-100" : ""
                }`}
              ></span>
            </Link>
          ))}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <X className="w-7 h-7" />
          ) : (
            <Menu className="w-7 h-7" />
          )}
        </button>

        {/* User/Login */}
        <div className="hidden md:block">
          {!loading && user ? (
            <UserDropdown />
          ) : (
            <Link href="/login">
              <button
                className="flex items-center justify-center gap-1 text-white px-4 w-fit min-h-[33px] rounded-[5px] text-[13px] bg-[#373737] hover:bg-[#4a4a4a] transition-all duration-300 ease-in-out transform hover:scale-105"
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

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#202020] px-4 pb-4 pt-2 shadow-lg">
          <div className="flex flex-col gap-2">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`py-2 px-2 rounded transition-all duration-200 ${
                  pathname === href
                    ? "text-[#4CC2FF] font-semibold bg-[#232b3b]"
                    : "text-white hover:bg-[#232b3b]"
                }`}
                onClick={() => setMobileOpen(false)}
              >
                {label}
              </Link>
            ))}
            <div className="mt-2">
              {!loading && user ? (
                <UserDropdown />
              ) : (
                <Link href="/login" onClick={() => setMobileOpen(false)}>
                  <button
                    className="flex items-center justify-center gap-1 text-white px-4 w-fit min-h-[33px] rounded-[5px] text-[13px] bg-[#373737] hover:bg-[#4a4a4a] transition-all duration-300 ease-in-out transform hover:scale-105"
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
        </div>
      )}
    </nav>
  );
};

export default Header;
