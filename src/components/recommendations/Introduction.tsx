"use client";
import {
  Brain,
  CheckCircle,
  Info,
  Shield,
  TrendingUp,
  Users,
} from "lucide-react";
import React from "react";

export default function Introduction({
  isLoading,
  handleContinue,
  disabled,
}: {
  isLoading: boolean;
  handleContinue: () => void;
  disabled: boolean;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[rgb(32,32,32)] to-gray-800 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 rounded-full p-3">
              <Brain className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-2">
            <span className=" bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-lg tracking-tight">
              AI-Powered Learning Enhancement
            </span>
          </h1>
          <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto">
            Your learning data helps us provide personalized feedback and
            improve your English learning experience
          </p>
        </div>

        {/* Main Content Card */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-4 sm:p-8 mb-6">
          <div className="flex items-start space-x-4 mb-6">
            <div className="bg-blue-900 rounded-full p-2 flex-shrink-0">
              <Info className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">
                How We Use Your Data
              </h2>
              <p className="text-gray-300 leading-relaxed">
                We use artificial intelligence to analyze your learning data and
                progress to provide you with personalized feedback, identify
                areas for improvement, and enhance your overall English learning
                experience. Your data helps our AI understand your learning
                patterns and provide more effective guidance.
              </p>
            </div>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="flex items-start space-x-3">
              <div className="bg-green-900 rounded-full p-2 flex-shrink-0">
                <TrendingUp className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">
                  Personalized Feedback
                </h3>
                <p className="text-gray-300 text-sm">
                  AI analyzes your performance to provide tailored suggestions
                  and corrections specific to your learning needs.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="bg-purple-900 rounded-full p-2 flex-shrink-0">
                <Brain className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">
                  Adaptive Learning
                </h3>
                <p className="text-gray-300 text-sm">
                  Our AI adjusts difficulty levels and content based on your
                  progress to optimize your learning journey.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="bg-orange-900 rounded-full p-2 flex-shrink-0">
                <Users className="h-5 w-5 text-orange-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">
                  Improved Experience
                </h3>
                <p className="text-gray-300 text-sm">
                  Your data helps us continuously improve our platform to better
                  serve all English learners.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="bg-blue-900 rounded-full p-2 flex-shrink-0">
                <Shield className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Data Security</h3>
                <p className="text-gray-300 text-sm">
                  Your information is processed securely and used solely for
                  improving your learning experience.
                </p>
              </div>
            </div>
          </div>

          {/* What Data We Collect */}
          <div className="bg-gray-50 rounded-lg p-4 sm:p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Data We Analyze
            </h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-gray-700">
                  Learning progress and completion rates
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-gray-700">
                  Quiz scores and assessment results
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-gray-700">
                  Time spent on different activities
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-gray-700">
                  Areas of difficulty and improvement
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-gray-700">
                  Learning preferences and patterns
                </span>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              By continuing to use our recommendation system, you agree to let
              our AI analyze your data to enhance your learning experience.
            </p>
            <button
              className="group relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 
                hover:from-blue-500 hover:via-purple-500 hover:to-pink-500
                text-white font-bold py-3 px-6 sm:py-4 sm:px-8 rounded-2xl 
                text-base sm:text-lg
                transition-all duration-500 ease-out
                shadow-2xl shadow-blue-500/30 hover:shadow-purple-500/50
                transform hover:scale-105 active:scale-95
                border border-white/20 hover:border-white/40
                overflow-hidden
                disabled:opacity-50 disabled:cursor-not-allowed
                before:absolute before:inset-0 before:bg-gradient-to-r 
                before:from-transparent before:via-white/20 before:to-transparent
                before:translate-x-[-100%] hover:before:translate-x-[100%]
                before:transition-transform before:duration-700"
              disabled={disabled}
              onClick={handleContinue}
            >
              <span className="relative z-10 flex items-center justify-center space-x-2">
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span className="text-lg tracking-wide">Continue</span>
                    <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                      <svg
                        className="w-3 h-3 text-white transform group-hover:translate-x-0.5 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </>
                )}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
