import React, { useState, useEffect } from "react";

export default function LoadingBars({
  speed = 50,
  stopValue = 80,
  end = false,
  onProgressComplete,
}: {
  speed: number;
  stopValue: number;
  end: boolean;
  onProgressComplete?: () => void;
}) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (end) {
          // If end is true, complete the progress
          if (prev >= 100) {
            clearInterval(interval);
            // Hide the loading bar after a brief delay
            setTimeout(() => setIsVisible(false), 300);
            return 100;
          }
          return Math.min(prev + 2, 100);
        } else {
          // Normal progression until stopValue
          if (prev >= stopValue) {
            return stopValue;
          }
          return Math.min(prev + 1, stopValue);
        }
      });
    }, speed);

    return () => clearInterval(interval);
  }, [speed, stopValue, end, isVisible, onProgressComplete]);

  useEffect(() => {
    if (progress === stopValue && !end && onProgressComplete) {
      onProgressComplete();
    }
  }, [progress, stopValue, end, onProgressComplete]);

  if (!isVisible) return null;

  return (
    <div className="w-full flex flex-row justify-center items-center bg-gray-800 px-2 sm:px-4 md:px-0">
      <div className="w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto bg-gray-800">
        {/* Main loading bar */}
        <div className="relative">
          <div className="h-3 sm:h-4 bg-gray-900 rounded-full overflow-hidden shadow-2xl shadow-blue-500/30 border border-blue-700/30">
            <div
              className="h-full rounded-full transition-all duration-100 ease-out relative animate-bounce-bar"
              style={{
                width: `${progress}%`,
                background:
                  "linear-gradient(270deg, #3b82f6, #a21caf, #ec4899, #3b82f6)",
                backgroundSize: "600% 600%",
                animation: "gradientMove 2.5s ease-in-out infinite",
              }}
            >
              {/* Animated shine effect */}
              <div className="absolute inset-0 pointer-events-none">
                <div
                  className="absolute left-0 top-0 h-full w-1/3 bg-gradient-to-r from-transparent via-white/70 to-transparent opacity-60 animate-shine"
                  style={{
                    animationDelay: "0.2s",
                  }}
                ></div>
              </div>
              {/* Glow effect */}
              <div className="absolute -inset-1 rounded-full blur-2xl opacity-40 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500"></div>
            </div>
          </div>

          {/* Progress percentage */}
          <div className="flex flex-col sm:flex-row justify-between items-center mt-2 gap-1 sm:gap-0">
            <span className="text-blue-300 text-xs sm:text-sm font-semibold tracking-wide animate-pulse">
              {end
                ? "Completing..."
                : progress >= stopValue
                ? "Waiting for response..."
                : "Loading..."}
            </span>
            <span className="text-pink-400 text-base sm:text-lg font-extrabold font-mono drop-shadow-glow animate-bounce">
              {Math.round(progress)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
