import Image from "next/image";
import React, { useState, useEffect } from "react";

export default function TutorTrigger({
  onClick,
  isOpen,
}: {
  onClick?: () => void;
  isOpen: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [showPulse, setShowPulse] = useState(true);
  const [hasNewMessage, setHasNewMessage] = useState(false);

  // Hide pulse after initial attention-grabbing period
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPulse(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  // Simulate occasional "new message" notification
  useEffect(() => {
    if (!isOpen) {
      const interval = setInterval(() => {
        if (Math.random() < 0.3) {
          // 30% chance every 10 seconds
          setHasNewMessage(true);
          setTimeout(() => setHasNewMessage(false), 3000);
        }
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Ripple effect background */}
      <div className="absolute inset-0 animate-ping">
        <div className="w-14 h-14 bg-cyan-400/20 rounded-full"></div>
      </div>

      {/* Outer glow ring */}
      <div className="absolute inset-0 animate-pulse">
        <div className="w-14 h-14 bg-gradient-to-r from-cyan-400/30 to-blue-400/30 rounded-full blur-sm"></div>
      </div>

      {/* Main button */}
      <button
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          relative flex items-center justify-center w-14 h-14 
          bg-gradient-to-r from-cyan-500 to-blue-500 
          hover:from-cyan-400 hover:to-blue-400
          border-2 border-cyan-300/50 hover:border-cyan-200
          rounded-full transition-all duration-300 
          shadow-xl shadow-cyan-500/25 hover:shadow-cyan-400/40
          transform hover:scale-110 active:scale-95
          ${hasNewMessage ? "animate-bounce" : ""}
          ${showPulse ? "animate-pulse" : ""}
        `}
        aria-label="Open AI Tutor"
        type="button"
      >
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300"></div>

        {/* Icon container */}
        <div
          className={`relative z-10 transition-transform duration-300 ${
            isHovered ? "scale-110 rotate-12" : ""
          }`}
        >
          <Image
            src="/ai.svg"
            alt="AI Tutor"
            width={28}
            height={28}
            className="filter drop-shadow-lg"
          />
        </div>

        {/* Sparkle effects */}
        <div className="absolute inset-0 overflow-hidden rounded-full">
          <div
            className={`absolute top-2 right-2 w-1 h-1 bg-white rounded-full ${
              isHovered ? "animate-ping" : ""
            }`}
          ></div>
          <div
            className={`absolute bottom-3 left-3 w-0.5 h-0.5 bg-cyan-200 rounded-full ${
              isHovered ? "animate-pulse" : ""
            }`}
          ></div>
        </div>

        {/* New message indicator */}
        {hasNewMessage && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-full border-2 border-white shadow-lg animate-bounce">
            <div className="absolute inset-0 bg-red-400 rounded-full animate-ping opacity-75"></div>
            <div className="relative z-10 w-full h-full bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
            </div>
          </div>
        )}
      </button>

      {/* Floating tooltip */}
      {isHovered && (
        <div className="absolute bottom-1/2 right-full mb-0 mr-4 translate-y-1/2 px-3 py-2 bg-slate-900/90 text-white text-sm rounded-lg shadow-lg backdrop-blur-sm border border-cyan-400/30 animate-in fade-in-50 slide-in-from-bottom-2 duration-200 whitespace-nowrap">
          <div className="relative">
            Ask me anything!
            {/* Arrow pointing right */}
            <div className="absolute top-1/2 -right-2 -translate-y-1/2 w-2 h-2 bg-slate-900/90 rotate-45 border-r border-b border-cyan-400/30"></div>
          </div>
        </div>
      )}

      {/* Keyboard shortcut hint */}
      <div
        className={`absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs text-slate-400 transition-opacity duration-300 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      >
        <kbd className="px-2 py-1 bg-slate-800/80 rounded border border-slate-600/50 text-cyan-300">
          Ctrl+K
        </kbd>
      </div>
    </div>
  );
}
