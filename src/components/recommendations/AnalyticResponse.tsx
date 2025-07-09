import React from "react";

export default function AnalyticResponse({
  strengths,
  weakness,
  recommendations,
  summary,
  onDetail,
}: {
  strengths: string[];
  weakness: string[];
  recommendations: string[];
  summary: string;
  onDetail: () => void;
}) {
  return (
    <div className="w-full p-6  text-white bg-gradient-to-b from-gray-800 to-blue-700">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center mb-2">
          Learning Analytics Report
        </h1>
        <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full mx-auto w-32"></div>
      </div>

      {/* Three Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Strengths */}
        <div className="bg-gray-800 rounded-lg p-6 border-l-4 border-green-500">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
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
          <div className="space-y-3">
            {strengths.map((strength, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center text-gray-900 text-xs font-bold flex-shrink-0 mt-0.5">
                  {index + 1}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {strength}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Weaknesses */}
        <div className="bg-gray-800 rounded-lg p-6 border-l-4 border-red-500">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-3">
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
          <div className="space-y-3">
            {weakness.map((weak, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-red-400 rounded-full flex items-center justify-center text-gray-900 text-xs font-bold flex-shrink-0 mt-0.5">
                  {index + 1}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">{weak}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-gray-800 rounded-lg p-6 border-l-4 border-yellow-500">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center mr-3">
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
          <div className="space-y-3">
            {recommendations.map((rec, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-gray-900 text-xs font-bold flex-shrink-0 mt-0.5">
                  {index + 1}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">{rec}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Summary Section */}
      <div className="mb-8 bg-gray-800 rounded-lg p-6 border-l-4 border-blue-500 mt-4">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
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
        <p className="text-gray-300 leading-relaxed text-lg">{summary}</p>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <div>
          <button
            onClick={onDetail}
            className="my-2 mx-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg shadow-md hover:from-blue-600 hover:to-purple-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          >
            View Detail
          </button>
        </div>
        <div className="inline-flex items-center space-x-2 text-white text-sm">
          <div className="px-5 py-2 bg-blue-400 rounded-full animate-pulse">
            <span>Generated by AI Learning Analytics</span>
          </div>
        </div>
      </div>
    </div>
  );
}
