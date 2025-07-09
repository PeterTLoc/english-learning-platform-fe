import { User, BookOpen, Trophy } from "lucide-react";
import React from "react";
import { UserProgress } from "../DetailDataModal";

export default function OverView({
  userProgress,
  getScoreColor,
}: {
  userProgress: UserProgress;
  getScoreColor: (score: number) => string;
}) {
  return (
    <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-lg p-4 sm:p-6 border border-blue-800/30">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <div className="text-center">
          <div className="flex justify-center mb-2 sm:mb-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-white mb-1">
            Student
          </h3>
          <p className="text-blue-300 text-sm sm:text-base">
            {userProgress.user?.username || "Unknown"}
          </p>
        </div>
        <div className="text-center">
          <div className="flex justify-center mb-2 sm:mb-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-600 rounded-full flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-white mb-1">
            Course
          </h3>
          <p className="text-green-300 text-sm sm:text-base">
            {userProgress.course?.name || "Unknown"}
          </p>
          <p className="text-xs sm:text-sm text-gray-400">
            {userProgress.course?.level} • {userProgress.course?.type}
          </p>
        </div>
        <div className="text-center">
          <div className="flex justify-center mb-2 sm:mb-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-600 rounded-full flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-white mb-1">
            Average Score
          </h3>
          <p
            className={`text-xl sm:text-2xl font-bold ${getScoreColor(
              userProgress.averageScore || 0
            )}`}
          >
            {userProgress.averageScore || 0}%
          </p>
        </div>
      </div>
    </div>
  );
}
