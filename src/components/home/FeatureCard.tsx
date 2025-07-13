"use client";
import React, { ReactElement, useEffect, useState } from "react";

export default function FeatureCard({
  icon,
  title,
  description,
  delay,
}: {
  icon: ReactElement<{ className?: string }>;
  title: string;
  description: string;
  delay: number;
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`group bg-gradient-to-b from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-8 hover:from-white/10 hover:to-white/15 transition-all duration-500 hover:scale-105 border border-white/10 hover:border-[#4CC2FF]/30 hover:shadow-2xl hover:shadow-[#4CC2FF]/10 transform ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      }`}
      style={{ transition: "all 0.6s ease-out" }}
    >
      <div className="mb-6">
        <div className="bg-gradient-to-r from-[#4CC2FF]/20 to-[#3BB5FF]/20 p-4 rounded-2xl border border-[#4CC2FF]/30 w-fit group-hover:scale-110 transition-transform duration-300">
          {React.cloneElement(icon, { className: "w-7 h-7 text-[#4CC2FF]" })}
        </div>
      </div>
      <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-[#4CC2FF] transition-colors">
        {title}
      </h3>
      <p className="text-gray-300 leading-relaxed text-lg">{description}</p>
    </div>
  );
}
