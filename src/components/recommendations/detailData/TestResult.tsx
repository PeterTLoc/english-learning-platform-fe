import React from "react";
import { UserProgress, UserTest } from "../DetailDataModal";
import { BarChart3, Star, Trophy, XCircle } from "lucide-react";

export default function TestResult({
  userProgress,
  getScoreBadge,
}: {
  userProgress: UserProgress;
  getScoreBadge: (score: number) => string;
}) {
  return (
    <div className="bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-700">
      <div className="mb-4 sm:mb-6">
        <h3 className="text-base sm:text-lg font-semibold text-white mb-2">
          Test Performance
        </h3>
        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-400">
          <BarChart3 className="w-4 h-4" />
          <span>{userProgress.userTests?.length || 0} test attempts</span>
        </div>
      </div>
      <div className="space-y-3 sm:space-y-4">
        {userProgress.userTests?.map((test: UserTest) => (
          <div
            key={test._id}
            className="bg-gray-700 rounded-lg p-3 sm:p-4 border border-gray-600"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 sm:mb-3 gap-2 sm:gap-0">
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    test.score >= 80
                      ? "bg-green-600"
                      : test.score >= 60
                      ? "bg-yellow-600"
                      : "bg-red-600"
                  }`}
                >
                  {test.score >= 80 ? (
                    <Trophy className="w-4 h-4 text-white" />
                  ) : test.score >= 60 ? (
                    <Star className="w-4 h-4 text-white" />
                  ) : (
                    <XCircle className="w-4 h-4 text-white" />
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-white text-sm sm:text-base">
                    Attempt #{test.attemptNo}
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-400">
                    {test.test?.name}
                  </p>
                </div>
              </div>
              <div
                className={`px-2 sm:px-3 py-1 rounded-full text-base sm:text-lg font-bold border ${getScoreBadge(
                  test.score
                )}`}
              >
                {test.score}%
              </div>
            </div>
            <div className="bg-gray-600 rounded-lg p-2 sm:p-3 mb-2 sm:mb-3">
              <div className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                {test.description}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
              <div>
                <div className="text-gray-400 mb-1">Questions</div>
                <div className="font-medium text-white">
                  {test.test?.totalQuestions || 0} total
                </div>
              </div>
              <div>
                <div className="text-gray-400 mb-1">Lessons Covered</div>
                <div className="font-medium text-white">
                  {test.test?.lessons?.length || 0} lessons
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
