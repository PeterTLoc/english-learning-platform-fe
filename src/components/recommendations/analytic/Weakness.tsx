import React from "react";

export default function Weakness({ weakness }: { weakness: string[] }) {
  return (
    <div className="bg-gray-800 rounded-lg p-4 sm:p-6 border-l-4 border-red-500">
      <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center">
        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-red-500 rounded-full flex items-center justify-center mr-2 sm:mr-3">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        Areas for Improvement
      </h2>
      <div className="space-y-2 sm:space-y-3">
        {weakness.map((weak, index) => (
          <div key={index} className="flex items-start space-x-2 sm:space-x-3">
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-red-400 rounded-full flex items-center justify-center text-gray-900 text-xs font-bold flex-shrink-0 mt-0.5">
              {index + 1}
            </div>
            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
              {weak}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
