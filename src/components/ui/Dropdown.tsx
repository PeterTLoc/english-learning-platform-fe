"use client";

import Link from "next/link";
import React, { useEffect, useRef, useState, ReactNode } from "react";

interface DropdownItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface DropdownProps {
  trigger: ReactNode;
  items: DropdownItem[];
  headerContent?: ReactNode;
  align?: "left" | "right";
  className?: string;
}

const Dropdown = ({
  trigger,
  items,
  headerContent,
  align = "right",
  className = "",
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div
          className={`absolute ${
            align === "right" ? "right-0" : "left-0"
          } mt-1 w-72 text-base bg-[#2B2B2B] rounded shadow z-50 border border-[#1D1D1D] animate-fadeIn`}
        >
          {headerContent && (
            <div className="p-4 border-b border-[#1D1D1D]">{headerContent}</div>
          )}
          <div className="py-1">
            {items.map((item, index) =>
              item.href ? (
                <Link
                  key={index}
                  href={item.href}
                  className="block px-4 py-2 text-sm text-white hover:bg-[#2D2D2D] transition-all duration-300 ease-in-out"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ) : (
                <button
                  key={index}
                  onClick={() => {
                    if (item.onClick) item.onClick();
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-[#2D2D2D] transition-all duration-300 ease-in-out"
                >
                  {item.label}
                </button>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
