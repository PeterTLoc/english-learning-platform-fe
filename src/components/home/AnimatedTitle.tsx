"use client";
import { motion, Variants } from "framer-motion";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const title = "English Learning System";
const subtext = "The perfect place to master English.";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const charVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const subtextVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: title.length * 0.05 + 0.2,
      duration: 0.5,
    },
  },
};

const buttonVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: title.length * 0.05 + 0.4,
      duration: 0.5,
    },
  },
};

const AnimatedTitle: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    setIsVisible(true);
  }, []);
  return (
    <div className="flex flex-col gap-2">
      <motion.div
        className="text-7xl font-bold flex flex-wrap"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {title.split("").map((char, i) => (
          <motion.span key={i} variants={charVariants}>
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </motion.div>

      <motion.div
        className="text-[#CFCFCF] text-lg text-center mt-3"
        variants={subtextVariants}
        initial="hidden"
        animate="visible"
      >
        {subtext}
      </motion.div>

      <Link href={"/courses"}>
        <div
          className={`text-center transform transition-all duration-500 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
          }`}
          style={{
            transitionDelay: `${title.length * 50 + 400}ms`,
          }}
        >
          <div className="relative inline-block mt-6">
            {/* Ripple effect background */}
            <div className="absolute inset-0 animate-ping">
              <div className="w-full h-full bg-cyan-400/20 rounded-full"></div>
            </div>

            {/* Outer glow ring */}
            <div className="absolute inset-0 animate-pulse">
              <div className="w-full h-full bg-gradient-to-r from-cyan-400/30 to-blue-400/30 rounded-full blur-sm"></div>
            </div>

            {/* Main button */}
            <button className="relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 border-2 border-cyan-300/50 hover:border-cyan-200 rounded-full text-white font-bold text-base transition-all duration-300 shadow-xl shadow-cyan-500/25 hover:shadow-cyan-400/40 transform hover:scale-110 active:scale-95 flex items-center gap-2 mx-auto">
              {/* Background gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300"></div>

              {/* Button content */}
              <span className="relative z-10">Start learning now</span>
              <ChevronRight className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover:translate-x-1" />

              {/* Sparkle effects */}
              <div className="absolute inset-0 overflow-hidden rounded-full">
                <div className="absolute top-2 right-6 w-1 h-1 bg-white rounded-full animate-ping opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-3 left-6 w-0.5 h-0.5 bg-cyan-200 rounded-full animate-pulse opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default AnimatedTitle;
