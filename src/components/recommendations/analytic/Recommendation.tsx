import React from "react";

export default function Recommendation({
  recommendations,
}: {
  recommendations: string[];
}) {
  return (
    <div className="bg-gray-800 rounded-lg p-4 sm:p-6 border-l-4 border-yellow-500">
      <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center">
        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-yellow-500 rounded-full flex items-center justify-center mr-2 sm:mr-3">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        Recommendations
      </h2>
      <div className="space-y-2 sm:space-y-3">
        {recommendations.map((rec, index) => (
          <div key={index} className="flex items-start space-x-2 sm:space-x-3">
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-yellow-500 rounded-full flex items-center justify-center text-gray-900 text-xs font-bold flex-shrink-0 mt-0.5">
              {index + 1}
            </div>
            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
              {rec}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
