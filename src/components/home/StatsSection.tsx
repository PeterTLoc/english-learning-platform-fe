"use client";
import { BookOpen, CheckCircle, HeartPlus, Users } from "lucide-react";
import React, { useEffect, useState } from "react";

export default function StatsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedNumbers, setAnimatedNumbers] = useState([0, 0, 0, 0]);

  const stats = [
    {
      number: 10000,
      suffix: "+",
      label: "Active Learners",
      icon: <Users className="w-8 h-8" />,
      color: "from-blue-400 to-cyan-400",
    },
    {
      number: 500,
      suffix: "+",
      label: "Lessons Available",
      icon: <BookOpen className="w-8 h-8" />,
      color: "from-purple-400 to-pink-400",
    },
    {
      number: 95,
      suffix: "%",
      label: "Success Rate",
      icon: <CheckCircle className="w-8 h-8" />,
      color: "from-green-400 to-emerald-400",
    },
    {
      number: 24,
      suffix: "/7",
      label: "Support Available",
      icon: <HeartPlus className="w-8 h-8" />,
      color: "from-orange-400 to-red-400",
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isVisible) {
      stats.forEach((stat, index) => {
        const duration = 2000;
        const steps = 60;
        const increment = stat.number / steps;
        let currentStep = 0;

        const interval = setInterval(() => {
          currentStep++;
          const currentValue = Math.min(increment * currentStep, stat.number);

          setAnimatedNumbers((prev) => {
            const newNumbers = [...prev];
            newNumbers[index] = Math.floor(currentValue);
            return newNumbers;
          });

          if (currentStep >= steps) {
            clearInterval(interval);
          }
        }, duration / steps);
      });
    }
  }, [isVisible]);

  return (
    <div className="mb-20">
      {/* Stats Container */}
      <div className="relative">
        {/* Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#4CC2FF]/10 via-transparent to-[#4CC2FF]/10 rounded-3xl blur-3xl"></div>

        {/* Main Stats Grid */}
        <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-8 p-8 rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-xl">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`text-center group cursor-pointer transform transition-all duration-700 hover:scale-110 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
              style={{
                transitionDelay: `${index * 150}ms`,
              }}
            >
              {/* Animated Icon */}
              <div className="relative mb-4 mx-auto w-fit">
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${stat.color} rounded-2xl blur-lg opacity-50 group-hover:opacity-80 transition-opacity duration-300`}
                ></div>
                <div
                  className={`relative bg-gradient-to-r ${stat.color} p-4 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300`}
                >
                  {React.cloneElement(stat.icon, {
                    className: "text-white drop-shadow-sm",
                  })}
                </div>
              </div>

              {/* Animated Number */}
              <div className="mb-2">
                <span className="text-4xl lg:text-5xl font-bold text-white tracking-tight">
                  {index === 0
                    ? (animatedNumbers[index] / 1000).toFixed(0) + "K"
                    : animatedNumbers[index]}
                </span>
                <span className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#4CC2FF] to-[#3BB5FF] bg-clip-text text-transparent">
                  {index === 0 ? "+" : stat.suffix}
                </span>
              </div>

              {/* Label */}
              <div className="text-gray-300 font-medium text-sm lg:text-base group-hover:text-white transition-colors duration-300">
                {stat.label}
              </div>

              {/* Animated Progress Bar */}
              <div className="mt-3 h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${stat.color} transform transition-all duration-1000 rounded-full`}
                  style={{
                    width: isVisible ? "100%" : "0%",
                    transitionDelay: `${index * 200 + 500}ms`,
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-4 left-8 w-2 h-2 bg-[#4CC2FF] rounded-full animate-pulse opacity-60"></div>
          <div
            className="absolute bottom-6 right-12 w-1 h-1 bg-white rounded-full animate-pulse opacity-80"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute top-8 right-20 w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse opacity-70"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>
      </div>

      {/* Bottom Accent Line */}
      <div className="mt-8 h-px bg-gradient-to-r from-transparent via-[#4CC2FF]/50 to-transparent"></div>
    </div>
  );
}
