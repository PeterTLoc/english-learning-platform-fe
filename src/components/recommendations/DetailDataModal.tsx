import React, { useState } from "react";
import {
  X,
  // ChevronDown,
  // ChevronRight,
  // Calendar,
  User,
  BookOpen,
  Award,
  // Target,
  // TrendingUp,
  // AlertCircle,
  // Clock,
  // CheckCircle,
  // XCircle,
  // Trophy,
  // BarChart3,
  GraduationCap,
  // Star,
} from "lucide-react";
import Section from "./detailData/Section";
import OverView from "./detailData/OverView";
import CourseProgress from "./detailData/CourseProgress";
import TestResult from "./detailData/TestResult";
import CourseAccordion from "./detailData/CourseAccordion";

export interface LessonLength {
  for: string;
  amount: number;
}

export interface Lesson {
  _id: string;
  name: string;
  description: string;
  length: LessonLength[];
  order: number;
  completed: boolean;
}

export interface TestLesson {
  _id: string;
  name: string;
  order: number;
}

export interface Test {
  _id: string;
  name: string;
  description: string;
  totalQuestions: number;
  order: number;
  lessons: TestLesson[];
}

export interface UserTest {
  _id: string;
  test: Test;
  attemptNo: number;
  score: number;
  status: string;
  description: string;
}

export interface Course {
  _id: string;
  name: string;
  description: string;
  level: string;
  type: string;
  totalLessons: number;
  coverImage?: string;
}

export interface User {
  _id: string;
  username: string;
}

export interface UserProgress {
  _id: string;
  lessonFinished: number;
  averageScore: number | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  course: Course;
  user: User;
  lessons: Lesson[];
  userTests: UserTest[];
}

export default function DetailDataModal({
  isOpen,
  onClose,
  data,
}: {
  isOpen: boolean;
  onClose: () => void;
  data: UserProgress[];
}) {
  // All hooks at the top!
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});
  const [expandedCourses, setExpandedCourses] = useState<
    Record<string, boolean>
  >({});

  // Early return after hooks
  if (!isOpen) return null;
  if (!data || !Array.isArray(data) || data.length === 0) return null;

  // Helper functions
  const toggleSection = (courseId: string, key: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [`${courseId}_${key}`]: !prev[`${courseId}_${key}`],
    }));
  };

  const toggleCourse = (courseId: string) => {
    setExpandedCourses((prev) => ({
      ...prev,
      [courseId]: !prev[courseId],
    }));
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return "bg-green-900 border-green-600 text-green-200";
    if (score >= 60) return "bg-yellow-900 border-yellow-600 text-yellow-200";
    return "bg-red-900 border-red-600 text-red-200";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-gray-900 rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-700 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-3">
            <GraduationCap className="w-7 h-7 text-blue-400" />
            Learning Progress Report
          </h1>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700 rounded-lg text-base sm:text-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        {/* Content: List all courses as accordions */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {data.map((userProgress: UserProgress, idx: number) => {
            const courseId =
              userProgress.course?._id.toString() || `course_${idx}`;
            const isCourseExpanded = expandedCourses[courseId] ?? idx === 0; // expand first by default
            return (
              <div
                key={courseId}
                className="mb-4 sm:mb-8 border border-gray-700 rounded-lg bg-gray-850"
              >
                {/* Course Accordion Header */}
                <CourseAccordion
                  userProgress={userProgress}
                  idx={idx}
                  courseId={courseId}
                  isCourseExpanded={isCourseExpanded}
                  toggleCourse={toggleCourse}
                />

                {/* Course Details Accordion Body */}
                {isCourseExpanded && (
                  <div className="p-6 bg-gray-900 rounded-b-lg">
                    <Section
                      courseId={courseId}
                      key="overview"
                      title="Student Overview"
                      icon={<User className="w-5 h-5" />}
                      content={
                        <OverView
                          userProgress={userProgress}
                          getScoreColor={getScoreColor}
                        />
                      }
                      expandedSections={expandedSections}
                      toggleSection={toggleSection}
                    />

                    <Section
                      courseId={courseId}
                      key="courseProgress"
                      title="Course Progress"
                      icon={<BookOpen className="w-5 h-5" />}
                      content={<CourseProgress userProgress={userProgress} />}
                      expandedSections={expandedSections}
                      toggleSection={toggleSection}
                    />

                    <Section
                      courseId={courseId}
                      key="testResults"
                      title="Test Results"
                      icon={<Award className="w-5 h-5" />}
                      content={
                        <TestResult
                          userProgress={userProgress}
                          getScoreBadge={getScoreBadge}
                        />
                      }
                      expandedSections={expandedSections}
                      toggleSection={toggleSection}
                    />

                    <div className="flex justify-end mt-4">
                      <span className="text-xs text-gray-500">
                        Last updated: {formatDate(userProgress.updatedAt)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {/* Footer */}
        <div className="flex justify-end items-center p-4 sm:p-6 border-t border-gray-700 bg-gray-800">
          <button
            onClick={onClose}
            className="px-4 py-2 sm:px-6 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-base sm:text-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
