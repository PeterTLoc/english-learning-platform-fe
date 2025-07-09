import React, { useState, useEffect } from "react";

export default function LoadingBars({
  speed = 50,
  stopValue = 80,
  end = false,
}: {
  speed: number;
  stopValue: number;
  end: boolean;
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
  }, [speed, stopValue, end, isVisible]);

  if (!isVisible) return null;

  return (
    <div className="w-full max-w-md mx-auto bg-gray-900">
      {/* Main loading bar */}
      <div className="relative">
        <div className="h-3 bg-gray-800 rounded-full overflow-hidden shadow-lg">
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-100 ease-out relative"
            style={{ width: `${progress}%` }}
          >
            {/* Animated shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 -skew-x-12 animate-pulse"></div>
          </div>
        </div>

        {/* Progress percentage */}
        <div className="flex justify-between items-center mt-2">
          <span className="text-gray-400 text-sm">
            {end
              ? "Completing..."
              : progress >= stopValue
              ? "Waiting for response..."
              : "Loading..."}
          </span>
          <span className="text-gray-300 text-sm font-mono">
            {Math.round(progress)}%
          </span>
        </div>
      </div>
    </div>
  );
}
