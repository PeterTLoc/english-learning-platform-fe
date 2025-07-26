"use client"
import React, { useState } from "react"
import { IMembership } from "@/types/membership/membership"
import { baseShadow, hoverShadow, membershipColorPalette, toRGBA } from "@/utils/colorUtils"

export type MembershipCardProps = {
  membership: IMembership
  index: number
  openModal?: () => void
  hideSubscribeButton?: boolean
}

export default function MembershipCard({
  membership,
  index,
  openModal,
  hideSubscribeButton = false,
}: MembershipCardProps) {
  const { name, description, duration, price } = membership

  const [isHovered, setIsHovered] = useState(false)
  const [buttonHovered, setButtonHovered] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 })

  const color = membershipColorPalette[index % membershipColorPalette.length]
  const isNearButton = isHovered && mousePos.y > 70 

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    })
  }

  return (
    <div
      className="relative h-[336px] rounded-md overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
    >
      {/* 🔥 Mouse-follow glow */}
      <div
        className="absolute inset-0 transition-all duration-300"
        style={{
          background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%,
            ${toRGBA(color, isHovered ? 0.45 : 0.15)},
            transparent 70%)`,
          filter: `blur(${isHovered ? 25 : 15}px)`,
        }}
      />

      {/* Glass Card */}
      <div
        className="relative z-10 h-full rounded-md backdrop-blur-[2px] transition-all duration-300"
        style={{
          background: `linear-gradient(180deg,
            rgba(0,0,0,0.3) 0%,
            ${toRGBA(color, 0.04)} 100%)`,
          border: `1px solid ${toRGBA(color, 0.12)}`,
          boxShadow: isHovered
            ? `0 0 20px ${toRGBA(color, 0.3)}, inset 0 0 10px rgba(255,255,255,0.05)`
            : baseShadow(color),
        }}
      >
        {/* Content */}
        <div className="relative p-4 flex flex-col h-full">
          {/* Title */}
          <h3 className="text-xl font-bold text-white tracking-wide truncate mb-5">
            {name}
          </h3>

          {/* Description */}
          {description && (
            <p className="text-[rgb(180,185,190)] text-sm leading-snug line-clamp-3">
              {description}
            </p>
          )}

          {/* Divider */}
          <div className="border-t my-4" style={{ borderColor: toRGBA(color, 0.15) }} />

          {/* Details */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span style={{ color: toRGBA(color, 0.6) }} className="uppercase">Duration</span>
              <span className="text-[#CFCFCF]">{Math.floor(duration / 30)} months</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: toRGBA(color, 0.6) }} className="uppercase">Price</span>
              <span className="font-semibold text-white">
                {price.toLocaleString("vi-VN")}₫
              </span>
            </div>
          </div>

          {/* Subscribe Button */}
          {!hideSubscribeButton && (
            <div className="mt-auto flex justify-center pt-5">
              <button
                onClick={openModal}
                onMouseEnter={() => setButtonHovered(true)}
                onMouseLeave={() => setButtonHovered(false)}
                className="w-[130px] h-[36px] text-sm rounded-full transition-all duration-300"
                style={{
                  background:
                    isNearButton || buttonHovered ? toRGBA(color, 0.4) : "rgba(255,255,255,0.03)",
                  border: `1px solid ${toRGBA(color, 0.25)}`,
                  color: isNearButton || buttonHovered ? "#fff" : toRGBA(color, 0.8),
                  backdropFilter: "blur(6px)",
                  boxShadow: isNearButton
                    ? `0 0 12px ${toRGBA(color, 0.4)}`
                    : "0 1px 3px rgba(0,0,0,0.2)",
                }}
              >
                Subscribe
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
