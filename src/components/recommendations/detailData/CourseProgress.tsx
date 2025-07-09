import React from "react";
import { Lesson, LessonLength, UserProgress } from "../DetailDataModal";
import { CheckCircle, Clock } from "lucide-react";

export default function CourseProgress({
  userProgress,
}: {
  userProgress: UserProgress;
}) {
  return (
    <div className="bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-700">
      <div className="mb-4 sm:mb-6">
        <h3 className="text-base sm:text-lg font-semibold text-white mb-2">
          Lesson Progress
        </h3>
        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-400">
          <CheckCircle className="w-4 h-4" />
          <span>
            {userProgress.lessonFinished || 0} of{" "}
            {userProgress.course?.totalLessons || 0} lessons completed
          </span>
        </div>
      </div>
      <div className="space-y-3 sm:space-y-4">
        {userProgress.lessons?.map((lesson: Lesson) => (
          <div
            key={lesson._id}
            className="bg-gray-700 rounded-lg p-3 sm:p-4 border border-gray-600"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    lesson.completed ? "bg-green-600" : "bg-gray-600"
                  }`}
                >
                  {lesson.completed ? (
                    <CheckCircle className="w-4 h-4 text-white" />
                  ) : (
                    <Clock className="w-4 h-4 text-gray-400" />
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-white text-sm sm:text-base">
                    {lesson.name}
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-400">
                    {lesson.description}
                  </p>
                </div>
              </div>
              <div
                className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                  lesson.completed
                    ? "bg-green-900 text-green-200"
                    : "bg-gray-600 text-gray-300"
                }`}
              >
                {lesson.completed ? "Completed" : "In Progress"}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:gap-3 text-xs sm:text-sm">
              <div className="text-center">
                <div className="text-gray-400">Exercise</div>
                <div className="font-medium text-white">
                  {lesson.length?.find(
                    (l: LessonLength) => l.for === "exercise"
                  )?.amount || 0}
                </div>
              </div>
              <div className="text-center">
                <div className="text-gray-400">Vocabulary</div>
                <div className="font-medium text-white">
                  {lesson.length?.find(
                    (l: LessonLength) => l.for === "vocabulary"
                  )?.amount || 0}
                </div>
              </div>
              <div className="text-center">
                <div className="text-gray-400">Grammar</div>
                <div className="font-medium text-white">
                  {lesson.length?.find((l: LessonLength) => l.for === "grammar")
                    ?.amount || 0}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
