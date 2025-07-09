import { BookOpen, ChevronDown, ChevronRight } from "lucide-react";
import React from "react";
import { UserProgress } from "../DetailDataModal";
import Image from "next/image";

export default function CourseAccordion({
  userProgress,
  idx,
  isCourseExpanded,
  toggleCourse,
  courseId,
}: {
  userProgress: UserProgress;
  idx: number;
  isCourseExpanded: boolean;
  toggleCourse: (courseId: string) => void;
  courseId: string;
}) {
  return (
    <div
      className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 p-3 sm:p-4 cursor-pointer bg-gray-800 hover:bg-gray-700 rounded-t-lg transition-colors"
      onClick={() => toggleCourse(courseId)}
    >
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden flex items-center justify-center bg-gray-700">
        {userProgress.course?.coverImage ? (
          <Image
            src={userProgress.course.coverImage}
            alt={userProgress.course?.name}
            className="object-cover w-full h-full"
            width={100}
            height={100}
          />
        ) : (
          <BookOpen className="w-8 h-8 text-blue-400" />
        )}
      </div>
      <div className="flex-1 text-center sm:text-left">
        <h2 className="text-lg sm:text-xl font-bold text-white">
          {userProgress.course?.name || `Course ${idx + 1}`}
        </h2>
        <div className="text-xs sm:text-sm text-gray-400">
          {userProgress.course?.level} • {userProgress.course?.type}
        </div>
      </div>
      <div className="text-gray-400">
        {isCourseExpanded ? (
          <ChevronDown className="w-6 h-6" />
        ) : (
          <ChevronRight className="w-6 h-6" />
        )}
      </div>
    </div>
  );
}
