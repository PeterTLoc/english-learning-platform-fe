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
}: {
  isLoading: boolean;
  handleContinue: () => void;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 rounded-full p-3">
              <Brain className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            AI-Powered Learning Enhancement
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Your learning data helps us provide personalized feedback and
            improve your English learning experience
          </p>
        </div>

        {/* Main Content Card */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-8 mb-6">
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
          <div className="grid md:grid-cols-2 gap-6 mb-8">
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
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
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
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              disabled={isLoading}
              onClick={handleContinue}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
