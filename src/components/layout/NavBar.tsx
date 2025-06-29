import { useAuth } from "@/context/AuthContext";
import { CircleUserRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import UserDropdown from "./UserDropdown";

const NavBar = () => {
  const pathname = usePathname();
  const { user, loading } = useAuth();

  const links = [
    { href: "/", label: "Home" },
    { href: "/courses", label: "Courses" },
    { href: "/membership", label: "Membership" },
    { href: "/achievements", label: "Achievements" },
  ];

  return (
    <nav className="sticky top-0 z-50 h-[84px] bg-[#202020] shadow-lg shadow-[#ffffff80] mb-10">
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
  );
};

export default NavBar;
