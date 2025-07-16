import { useAuth } from "@/context/AuthContext";
import { CircleUserRound, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import UserDropdown from "./UserDropdown";

const Header = () => {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const links = [
    { href: "/", label: "Home" },
    { href: "/courses", label: "Courses" },
    { href: "/flashcard-sets", label: "Flashcards" },
    { href: "/membership", label: "Membership" },
    { href: "/leaderboard", label: "Leaderboard" },
    { href: "/blog", label: "Blogs" },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 h-[84px] bg-[#202020] shadow-xl shadow-zinc-600/60">
      <div className="flex justify-between items-center h-full px-4 sm:px-6 lg:px-[20px]">
        {/* Logo Section */}
        <div className="flex items-center">
          <Link
            href="/"
            className="flex items-center"
            onClick={closeMobileMenu}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-xl font-bold">ELS</span>
              <span className="h-7 w-[1px] bg-[#8C8C8C]"></span>
              <span className="text-lg">Learning</span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex gap-8 text-sm scale-x-115">
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

        {/* Right Section - Auth & Mobile Menu */}
        <div className="flex items-center gap-4">
          {/* Auth Section */}
          <div className="hidden sm:block">
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

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden text-white p-2 hover:bg-[#373737] rounded-md transition-colors duration-200"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-[84px] left-0 w-full bg-[#202020] border-t border-[#373737] shadow-lg">
          <div className="flex flex-col py-4">
            {/* Mobile Navigation Links */}
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={closeMobileMenu}
                className={`px-6 py-3 text-base transition-all duration-200 hover:bg-[#373737] hover:text-[#4CC2FF] ${
                  pathname === href
                    ? "text-[#4CC2FF] font-semibold bg-[#373737]"
                    : "text-white"
                }`}
              >
                {label}
              </Link>
            ))}

            {/* Mobile Auth Section */}
            <div className="sm:hidden px-6 py-3 border-t border-[#373737] mt-2">
              {!loading && user ? (
                <UserDropdown />
              ) : (
                <Link href="/login" onClick={closeMobileMenu}>
                  <button
                    className="flex items-center justify-center gap-2 text-white px-4 py-2 w-full min-h-[40px] rounded-[5px] text-[14px] bg-[#373737] hover:bg-[#4a4a4a] transition-all duration-300 ease-in-out"
                    type="submit"
                  >
                    <CircleUserRound strokeWidth={1.5} />
                    <span>Sign in</span>
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
