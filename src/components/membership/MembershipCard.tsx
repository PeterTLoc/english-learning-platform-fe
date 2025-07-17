"use client";
import React, { useState } from "react";
import { IMembership } from "@/types/membership/membership";
import {
  baseShadow,
  hoverShadow,
  membershipColorPalette,
  toRGBA,
} from "@/utils/colorUtils";

export type MembershipCardProps = {
  membership: IMembership;
  index: number;
  openModal?: () => void;
  hideSubscribeButton?: boolean;
  connectedLayout?: boolean;
};

export default function MembershipCard({
  membership,
  index,
  openModal,
  hideSubscribeButton = false,
  connectedLayout = false,
}: MembershipCardProps) {
  const { name, description, duration, price } = membership;
  const [isHovered, setIsHovered] = useState(false);
  const [buttonHovered, setButtonHovered] = useState(false);
  const color = membershipColorPalette[index % membershipColorPalette.length];

  return (
    <div
      className={
        connectedLayout
          ? "bg-[#2b2b2b] h-full flex-1 rounded-none p-4 md:p-8 w-full min-h-[340px] border border-[#1D1D1D]"
          : "relative w-full md:max-w-sm bg-[#2b2b2b] rounded-lg shadow-sm p-4 md:p-5 transition-all duration-300 transform hover:scale-105 min-h-[340px] border border-[#1D1D1D]"
      }
      style={
        connectedLayout
          ? undefined
          : {
              boxShadow: isHovered ? hoverShadow(color) : baseShadow(color),
              border: `1px solid ${toRGBA(color, 0.1)}`,
            }
      }
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header with Colored Badge */}
      <div className="flex justify-center items-center mb-5">
        <div
          className="text-lg font-semibold text-white px-4 py-2 rounded-full"
          style={{ backgroundColor: toRGBA(color, 0.15) }}
        >
          {name}
        </div>
      </div>

      {/* Description */}
      {description && (
        <p className="hidden md:block text-[#CFCFCF] text-sm mb-5 h-[90px] overflow-y-hidden leading-snug">
          {description.length > 160
            ? `${description.slice(0, 160)}...`
            : description}
        </p>
      )}

      {/* Details */}
      <div className="space-y-2 mb-5">
        <div className="flex justify-between text-[#CFCFCF]">
          <span className="font-medium">Duration:</span>
          <span>{Math.floor(duration / 30)} months</span>
        </div>
        <div className="flex justify-between text-[#CFCFCF]">
          <span className="font-medium">Price:</span>
          <span className="font-medium text-white">
            {price.toLocaleString("vi-VN")}₫
          </span>
        </div>
      </div>

      {/* Footer */}
      {!hideSubscribeButton && (
        <div className="flex justify-center">
          <button
            onMouseEnter={() => setButtonHovered(true)}
            onMouseLeave={() => setButtonHovered(false)}
            style={{
              background: buttonHovered ? toRGBA(color, 0.3) : "transparent",
              color: buttonHovered ? "white" : toRGBA(color, 0.8),
              border: `1px solid ${toRGBA(color, 0.3)}`,
              padding: "8px 16px",
              borderRadius: "6px",
            }}
            className="transition duration-300 ease-in-out font-medium hover:text-white"
            onClick={openModal}
          >
            Subscribe
          </button>
        </div>
      )}
    </div>
  );
}
