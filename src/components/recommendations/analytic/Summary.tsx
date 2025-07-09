import React from "react";

export default function Summary({ summary }: { summary: string }) {
  return (
    <div className="mb-6 sm:mb-8 bg-gray-800 rounded-lg p-4 sm:p-6 border-l-4 border-blue-500 mt-4">
      <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center">
        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-500 rounded-full flex items-center justify-center mr-2 sm:mr-3">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        Summary
      </h2>
      <p className="text-gray-300 leading-relaxed text-base sm:text-lg">
        {summary}
      </p>
    </div>
  );
}
