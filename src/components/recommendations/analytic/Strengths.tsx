import React from "react";

export default function Strengths({ strengths }: { strengths: string[] }) {
  return (
    <div className="bg-gray-800 rounded-lg p-4 sm:p-6 border-l-4 border-green-500">
      <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center">
        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-green-500 rounded-full flex items-center justify-center mr-2 sm:mr-3">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        Strengths
      </h2>
      <div className="space-y-2 sm:space-y-3">
        {strengths.map((strength, index) => (
          <div key={index} className="flex items-start space-x-2 sm:space-x-3">
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-400 rounded-full flex items-center justify-center text-gray-900 text-xs font-bold flex-shrink-0 mt-0.5">
              {index + 1}
            </div>
            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
              {strength}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
