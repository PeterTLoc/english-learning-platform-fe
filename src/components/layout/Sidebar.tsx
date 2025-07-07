"use client"

import React, { useState } from "react"

export interface SidebarLink {
  label: string
}

interface SidebarProps {
  links: SidebarLink[]
  onSelect?: (label: string) => void
  selected?: string
}

export default function Sidebar({ links, onSelect, selected }: SidebarProps) {
  return (
    <nav className="flex flex-col w-full md:w-[280px] bg-[#2b2b2b] rounded-lg p-2 gap-1 md:gap-2 shadow-lg">
      {links.map((link, idx) => {
        const isActive = link.label === selected;
        return (
          <React.Fragment key={link.label}>
            <button
              onClick={() => onSelect?.(link.label)}
              className={`flex items-center text-md px-4 py-3 rounded-lg transition font-medium ${
                isActive
                  ? "bg-[#202020] text-white font-bold hover:bg-[#1a1a1a]"
                  : "hover:bg-[#202020] text-white"
              }`}
            >
              {link.label}
            </button>
          </React.Fragment>
        );
      })}
    </nav>
  )
}
