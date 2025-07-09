import React, { useState } from "react";
import {
  X,
  ChevronDown,
  ChevronRight,
  Calendar,
  User,
  BookOpen,
  Award,
  Target,
  TrendingUp,
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  Trophy,
  BarChart3,
  GraduationCap,
  Star,
} from "lucide-react";

export default function DetailDataModal({
  isOpen,
  onClose,
  data,
}: {
  isOpen: boolean;
  onClose: () => void;
  data: any;
}) {
  // All hooks at the top!
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    overview: true,
    courseProgress: true,
    testResults: true,
  });
  const [selectedCourseIndex, setSelectedCourseIndex] = useState(0);

  // Early return after hooks
  if (!isOpen) return null;
  if (!data || !Array.isArray(data)) return null;

  const userProgress = data[selectedCourseIndex];

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [key]: !prev[key],
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

  const renderOverview = () => (
    <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-lg p-6 border border-blue-800/30">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center">
          <div className="flex justify-center mb-3">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">Student</h3>
          <p className="text-blue-300">
            {userProgress.user?.username || "Unknown"}
          </p>
        </div>

        <div className="text-center">
          <div className="flex justify-center mb-3">
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">Course</h3>
          <p className="text-green-300">
            {userProgress.course?.name || "Unknown"}
          </p>
          <p className="text-sm text-gray-400">
            {userProgress.course?.level} • {userProgress.course?.type}
          </p>
        </div>

        <div className="text-center">
          <div className="flex justify-center mb-3">
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">
            Average Score
          </h3>
          <p
            className={`text-2xl font-bold ${getScoreColor(
              userProgress.averageScore || 0
            )}`}
          >
            {userProgress.averageScore || 0}%
          </p>
        </div>
      </div>
    </div>
  );

  const renderCourseProgress = () => (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-2">
          Lesson Progress
        </h3>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <CheckCircle className="w-4 h-4" />
          <span>
            {userProgress.lessonFinished || 0} of{" "}
            {userProgress.course?.totalLessons || 0} lessons completed
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {userProgress.lessons?.map((lesson: any, index: number) => (
          <div
            key={lesson._id}
            className="bg-gray-700 rounded-lg p-4 border border-gray-600"
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
                  <h4 className="font-medium text-white">{lesson.name}</h4>
                  <p className="text-sm text-gray-400">{lesson.description}</p>
                </div>
              </div>
              <div
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  lesson.completed
                    ? "bg-green-900 text-green-200"
                    : "bg-gray-600 text-gray-300"
                }`}
              >
                {lesson.completed ? "Completed" : "In Progress"}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-sm">
              <div className="text-center">
                <div className="text-gray-400">Exercise</div>
                <div className="font-medium text-white">
                  {lesson.length?.find((l: any) => l.for === "exercise")
                    ?.amount || 0}
                </div>
              </div>
              <div className="text-center">
                <div className="text-gray-400">Vocabulary</div>
                <div className="font-medium text-white">
                  {lesson.length?.find((l: any) => l.for === "vocabulary")
                    ?.amount || 0}
                </div>
              </div>
              <div className="text-center">
                <div className="text-gray-400">Grammar</div>
                <div className="font-medium text-white">
                  {lesson.length?.find((l: any) => l.for === "grammar")
                    ?.amount || 0}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTestResults = () => (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-2">
          Test Performance
        </h3>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <BarChart3 className="w-4 h-4" />
          <span>{userProgress.userTests?.length || 0} test attempts</span>
        </div>
      </div>

      <div className="space-y-4">
        {userProgress.userTests?.map((test: any, index: number) => (
          <div
            key={test._id}
            className="bg-gray-700 rounded-lg p-4 border border-gray-600"
          >
            <div className="flex items-center justify-between mb-3">
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
                  <h4 className="font-medium text-white">
                    Attempt #{test.attemptNo}
                  </h4>
                  <p className="text-sm text-gray-400">{test.test?.name}</p>
                </div>
              </div>
              <div
                className={`px-3 py-1 rounded-full text-lg font-bold border ${getScoreBadge(
                  test.score
                )}`}
              >
                {test.score}%
              </div>
            </div>

            <div className="bg-gray-600 rounded-lg p-3 mb-3">
              <div className="text-sm text-gray-300 leading-relaxed">
                {test.description}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
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

  const renderSection = (
    key: string,
    title: string,
    icon: React.ReactNode,
    content: React.ReactNode
  ) => {
    const isExpanded = expandedSections[key];

    return (
      <div className="mb-6">
        <div
          className="flex items-center gap-3 p-4 bg-gray-750 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors"
          onClick={() => toggleSection(key)}
        >
          <div className="text-blue-400">{icon}</div>
          <h2 className="text-xl font-semibold text-white flex-1">{title}</h2>
          <div className="text-gray-400">
            {isExpanded ? (
              <ChevronDown className="w-5 h-5" />
            ) : (
              <ChevronRight className="w-5 h-5" />
            )}
          </div>
        </div>

        {isExpanded && <div className="mt-4">{content}</div>}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <GraduationCap className="w-7 h-7 text-blue-400" />
            Learning Progress Report
          </h1>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700 rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <select
            value={selectedCourseIndex}
            onChange={(e) => setSelectedCourseIndex(Number(e.target.value))}
            className="mb-4 p-2 rounded bg-gray-800 text-white"
          >
            {data.map((course: any, idx: number) => (
              <option key={course._id} value={idx}>
                {course.course?.name || `Course ${idx + 1}`}
              </option>
            ))}
          </select>

          {renderSection(
            "overview",
            "Student Overview",
            <User className="w-5 h-5" />,
            renderOverview()
          )}

          {renderSection(
            "courseProgress",
            "Course Progress",
            <BookOpen className="w-5 h-5" />,
            renderCourseProgress()
          )}

          {renderSection(
            "testResults",
            "Test Results",
            <Award className="w-5 h-5" />,
            renderTestResults()
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t border-gray-700 bg-gray-800">
          <div className="text-sm text-gray-400">
            Last updated: {formatDate(userProgress.updatedAt)}
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
