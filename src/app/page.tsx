"use client";
import React, { useState, useEffect } from "react";
import { ChevronRight, BookOpen, Smartphone, Trophy, Play } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import StatsSection from "@/components/home/StatsSection";
import AnimatedTitle from "@/components/home/AnimatedTitle";
import FeatureCard from "@/components/home/FeatureCard";

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-black min-h-screen">
      {/* Hero Section */}
      <div
        className="relative flex flex-col justify-center items-center"
        style={{
          height: "calc(100vh - 84px)",
          overflow: "hidden",
        }}
      >
        {/* Background Image with Parallax Effect */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://w0.peakpx.com/wallpaper/491/1016/HD-wallpaper-book-bw-silhouette-minimalism.jpg')",
            transform: `translateY(${scrollY * 0.5}px)`,
          }}
        />

        {/* Enhanced Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/60 to-black/90" />

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-3 h-3 bg-gradient-to-r from-[#4CC2FF] to-[#3BB5FF] rounded-full animate-pulse opacity-60"></div>
          <div
            className="absolute top-40 right-20 w-4 h-4 bg-gradient-to-r from-[#4CC2FF] to-[#3BB5FF] rounded-full animate-pulse opacity-40"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute bottom-40 left-20 w-2 h-2 bg-white rounded-full animate-pulse opacity-80"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute top-60 right-40 w-3 h-3 bg-gradient-to-r from-[#4CC2FF] to-[#3BB5FF] rounded-full animate-pulse opacity-50"
            style={{ animationDelay: "0.5s" }}
          ></div>
          <div
            className="absolute bottom-60 right-60 w-2 h-2 bg-[#4CC2FF] rounded-full animate-pulse opacity-70"
            style={{ animationDelay: "1.5s" }}
          ></div>
        </div>

        {/* Foreground Content */}
        <div className="relative z-10">
          <AnimatedTitle />
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gradient-to-b from-black to-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#4CC2FF]/20 to-[#3BB5FF]/20 border border-[#4CC2FF]/30 rounded-full px-6 py-2 mb-6 backdrop-blur-sm">
              <BookOpen className="w-4 h-4 text-[#4CC2FF]" />
              <span className="text-[#4CC2FF] font-medium">Discover ELS</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              What is ELS?
            </h2>
            <p className="text-gray-300 text-xl max-w-3xl mx-auto leading-relaxed">
              Welcome to our English Learning System! Unlock your language
              potential with interactive lessons, engaging activities, and
              personalized progress tracking. Discover the features that make
              mastering English both effortless and enjoyable.
            </p>
          </div>

          <StatsSection />

          <div className="grid md:grid-cols-3 gap-8 mb-20">
            <FeatureCard
              icon={<Smartphone />}
              title="Learn Anytime, Anywhere"
              description="Access lessons on your phone, tablet, or desktop at your convenience. Study during your commute, lunch break, or whenever you have a few minutes to spare."
              delay={200}
            />
            <FeatureCard
              icon={<Play />}
              title="Interactive Lessons & Quizzes"
              description="Engage with fun exercises and quizzes that make learning enjoyable. Our interactive approach keeps you motivated and helps retain information better."
              delay={400}
            />
            <FeatureCard
              icon={<Trophy />}
              title="Track Your Progress"
              description="Visualize your journey and stay motivated with detailed progress tracking. See your improvements and celebrate your achievements along the way."
              delay={600}
            />
          </div>

          {/* Enhanced Call to Action Section */}
          {!user && (
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-3xl blur-xl"></div>
              <div className="relative bg-gradient-to-r from-cyan-500 to-blue-500 rounded-3xl p-12 text-center shadow-2xl border border-cyan-300/50">
                <div className="max-w-2xl mx-auto">
                  <h3 className="text-4xl font-bold text-white mb-6">
                    Ready to Start Your English Journey?
                  </h3>
                  <p className="text-white/90 mb-8 text-xl leading-relaxed">
                    Join thousands of learners who have already improved their
                    English skills with ELS. Start your transformation today!
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href={"/register"}>
                      <button className="bg-white text-cyan-500 px-10 py-4 rounded-full font-bold hover:bg-gray-100 transition-all duration-300 flex items-center gap-3 mx-auto sm:mx-0 shadow-xl shadow-cyan-500/25 hover:shadow-cyan-400/40 hover:scale-105 group">
                        Get Started Today
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </Link>
                    <button className="border-2 border-white/30 text-white px-10 py-4 rounded-full font-bold hover:bg-white/10 transition-all duration-300 mx-auto sm:mx-0">
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
