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
    <nav className="flex flex-col w-[280px]">
      {links.map((link) => {
        const isActive = link.label === selected
        return (
          <button
            key={link.label}
            onClick={() => onSelect?.(link.label)}
            className={`sidebar-link text-start ${
              isActive
                ? "bg-[#2a2a2a] text-white font-semibold"
                : "hover:bg-[#2a2a2a] text-gray-200"
            } transition`}
          >
            {link.label}
          </button>
        )
      })}
    </nav>
  )
}
