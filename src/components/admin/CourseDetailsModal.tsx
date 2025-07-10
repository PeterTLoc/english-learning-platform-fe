"use client";

import { useEffect, useState } from "react";
import { Course } from "@/types/course/course";
import { CourseDetails, getCourseDetails } from "@/services/courseService";
import { parseAxiosError } from "@/utils/apiErrors";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import {
  createLesson,
  updateLesson,
  deleteLesson,
  createTest,
  updateTest,
  deleteTest,
  createExercise,
  updateExercise,
  deleteExercise,
} from "@/services/lessonService";
// import { Lesson } from "@/types/lesson/lesson";
// import { Test } from "@/types/course/test";
// import { IExercise } from "@/types/models/IExercise";
import CourseFormModal from "./CourseFormModals";
import { useToast } from "@/context/ToastContext";
import Image from "next/image";
import VocabularyService from "@/services/vocabularyService";
import GrammarService from "@/services/grammarService";

const vocabularyService = new VocabularyService();
const grammarService = new GrammarService();

interface CourseDetailsModalProps {
  course: Course;
  isOpen: boolean;
  onClose: () => void;
}

interface ModalState {
  isOpen: boolean;
  type: "lesson" | "test" | "exercise" | "vocabulary" | "grammar";
  mode: "create" | "edit";
  data?: any;
  parentId?: string; // lessonId for tests and exercises
}

export default function CourseDetailsModal({
  course,
  isOpen,
  onClose,
}: CourseDetailsModalProps) {
  const [courseDetails, setCourseDetails] = useState<CourseDetails | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    type: "lesson",
    mode: "create",
  });
  const [refreshKey, setRefreshKey] = useState(0); // Used to trigger re-fetch
  const { showToast } = useToast();

  useEffect(() => {
    const fetchDetails = async () => {
      if (!isOpen) return;

      setLoading(true);
      setError(null);

      try {
        const details = await getCourseDetails(course._id);
        setCourseDetails(details);
      } catch (error) {
        const parsedError = parseAxiosError(error);
        setError(parsedError.message);
        showToast(parsedError.message, "error");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [course._id, isOpen, refreshKey, showToast]);

  const handleCreate = async (
    type: "lesson" | "test" | "exercise" | "vocabulary" | "grammar",
    data: FormData,
    parentId?: string
  ) => {
    try {
      if (type === "lesson") {
        await createLesson(data);
        showToast("Lesson created successfully", "success");
      } else if (type === "test") {
        await createTest(data);
        showToast("Test created successfully", "success");
      } else if (type === "exercise") {
        await createExercise(data);
        showToast("Exercise created successfully", "success");
      } else if (type === "vocabulary") {
        await vocabularyService.createVocabulary(data);
        showToast("Vocabulary created successfully", "success");
      } else if (type === "grammar") {
        await grammarService.createGrammar(data);
        showToast("Grammar created successfully", "success");
      }
      setRefreshKey((prev) => prev + 1); // Trigger re-fetch
      setModalState((prev) => ({ ...prev, isOpen: false }));
    } catch (error) {
      const parsedError = parseAxiosError(error);
      setError(parsedError.message);
      showToast(parsedError.message, "error");
    }
  };

  const handleUpdate = async (
    type: "lesson" | "test" | "exercise" | "vocabulary" | "grammar",
    id: string,
    data: FormData
  ) => {
    try {
      if (type === "lesson") {
        await updateLesson(id, data);
        showToast("Lesson updated successfully", "success");
      } else if (type === "test") {
        await updateTest(id, data);
        showToast("Test updated successfully", "success");
      } else if (type === "exercise") {
        await updateExercise(id, data);
        showToast("Exercise updated successfully", "success");
      } else if (type === "vocabulary") {
        await vocabularyService.updateVocabulary(id, data);
        showToast("Vocabulary updated successfully", "success");
      } else if (type === "grammar") {
        await grammarService.updateGrammar(id, data);
        showToast("Grammar updated successfully", "success");
      }
      setRefreshKey((prev) => prev + 1);
      setModalState((prev) => ({ ...prev, isOpen: false }));
    } catch (error) {
      const parsedError = parseAxiosError(error);
      setError(parsedError.message);
      showToast(parsedError.message, "error");
    }
  };

  const handleDelete = async (
    type: "lesson" | "test" | "exercise" | "vocabulary" | "grammar",
    id: string
  ) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`))
      return;

    try {
      if (type === "lesson") {
        await deleteLesson(id);
        showToast("Lesson deleted successfully", "success");
      } else if (type === "test") {
        await deleteTest(id);
        showToast("Test deleted successfully", "success");
      } else if (type === "exercise") {
        await deleteExercise(id);
        showToast("Exercise deleted successfully", "success");
      } else if (type === "grammar") {
        await grammarService.deleteGrammar(id);
        showToast("Grammar deleted successfully", "success");
      } else if (type === "vocabulary") {
        await vocabularyService.deleteVocabulary(id);
        showToast("Vocabulary deleted successfully", "success");
      }
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      const parsedError = parseAxiosError(error);
      setError(parsedError.message);
      showToast(parsedError.message, "error");
    }
  };

  const openModal = (
    type: "lesson" | "test" | "exercise" | "vocabulary" | "grammar",
    mode: "create" | "edit",
    data?: any,
    parentId?: string
  ) => {
    setModalState({
      isOpen: true,
      type,
      mode,
      data: {
        ...data,
        courseId: course._id,
        lessonId: parentId,
      },
      parentId,
    });
  };

  const formatExerciseType = (type: string) => {
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#202020] border border-[#1D1D1D] rounded-lg flex flex-col w-full max-w-4xl max-h-[90vh]">
        <div className="p-6 border-b border-[#1D1D1D]">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Course Details</h2>
            <button
              onClick={onClose}
              className="text-[#CFCFCF] hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex flex-col gap-4 justify-center items-center h-64">
              <LoadingSpinner />
              <p>Loading...</p>
            </div>
          ) : courseDetails ? (
            <div className="space-y-6">
              {/* Course Information */}
              <div className="bg-[#2D2D2D] p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Course Information
                </h3>
                <div className="grid grid-cols-2 gap-4 text-[#CFCFCF]">
                  <div>
                    <p>
                      <span className="font-medium">Level:</span>{" "}
                      {courseDetails.level}
                    </p>
                    <p>
                      <span className="font-medium">Type:</span>{" "}
                      {courseDetails.type}
                    </p>
                    <p>
                      <span className="font-medium">Total Lessons:</span>{" "}
                      {courseDetails.totalLessons}
                    </p>
                  </div>
                  <div>
                    <p>
                      <span className="font-medium">Total Enrolled:</span>{" "}
                      {courseDetails.totalEnrolled ?? "Unknown"}
                    </p>
                    <p>
                      <span className="font-medium">Created:</span>{" "}
                      {new Date(courseDetails.createdAt).toLocaleString()}
                    </p>
                    <p>
                      <span className="font-medium">Last Updated:</span>{" "}
                      {new Date(courseDetails.updatedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-[#3D3D3D]"></div>

              {/* Course Tests */}
              {courseDetails.courseTests && (
                <>
                  <div className="bg-[#2D2D2D] p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-white">
                        Course Tests
                      </h3>
                      <button
                        onClick={() => openModal("test", "create")}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center space-x-2"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="12" y1="5" x2="12" y2="19"></line>
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        <span>Add Test</span>
                      </button>
                    </div>
                    <div className="space-y-3">
                      {courseDetails.courseTests.map((test) => (
                        <div
                          key={test._id}
                          className="bg-[#373737] p-4 rounded-lg border border-[#4D4D4D]"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-white">
                                {test.name}
                              </h4>
                              <p className="text-[#CFCFCF] text-sm mt-1">
                                {test.description}
                              </p>
                              <div className="mt-2 text-sm text-[#9A9A9A]">
                                <span>Questions: {test.totalQuestions}</span>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => openModal("test", "edit", test)}
                                className="px-3 py-1.5 text-sm rounded-md border border-blue-500 text-blue-400 hover:bg-blue-500/10 transition-colors duration-200"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() =>
                                  handleDelete("test", test._id.toString())
                                }
                                className="px-3 py-1.5 text-sm rounded-md border border-red-500 text-red-400 hover:bg-red-500/10 transition-colors duration-200"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-[#3D3D3D]"></div>
                </>
              )}

              {/* Lessons */}
              <div className="bg-[#2D2D2D] p-4 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-white">Lessons</h3>
                  <button
                    onClick={() => openModal("lesson", "create")}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center space-x-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    <span>Add Lesson</span>
                  </button>
                </div>
                <div className="space-y-6">
                  {courseDetails.lessons.map((lessonData, index) => (
                    <div
                      key={lessonData.lesson._id?.toString() || index}
                      className="bg-[#373737] p-4 rounded-lg border border-[#4D4D4D]"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-medium text-white flex items-center">
                            <span>
                              Lesson {index + 1}: {lessonData.lesson.name}
                            </span>
                            <span className="ml-2 text-sm text-[#9A9A9A] bg-[#2D2D2D] px-2 py-0.5 rounded">
                              {Array.isArray(lessonData.lesson.length)
                                ? lessonData.lesson.length
                                    .map(
                                      (l) =>
                                        `${
                                          l.for.charAt(0).toUpperCase() +
                                          l.for.slice(1)
                                        }: ${l.amount} min`
                                    )
                                    .join(" • ")
                                : "0 min"}
                            </span>
                          </h4>
                          <p className="text-[#CFCFCF] text-sm mt-1">
                            {lessonData.lesson.description}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() =>
                              openModal("lesson", "edit", lessonData.lesson)
                            }
                            className="px-3 py-1.5 text-sm rounded-md border border-blue-500 text-blue-400 hover:bg-blue-500/10 transition-colors duration-200"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() =>
                              handleDelete(
                                "lesson",
                                lessonData.lesson._id?.toString() || ""
                              )
                            }
                            className="px-3 py-1.5 text-sm rounded-md border border-red-500 text-red-400 hover:bg-red-500/10 transition-colors duration-200"
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                      {/* Lesson Stats */}
                      <div className="grid grid-cols-3 gap-4 text-sm text-[#CFCFCF] mb-4 p-3 bg-[#2D2D2D] rounded-md">
                        <div>
                          <p>Exercises: {lessonData.exercises?.length || 0}</p>
                        </div>
                        <div>
                          <p>Tests: {lessonData.tests?.length || 0}</p>
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="border-t border-[#4D4D4D] my-4"></div>

                      {/* Exercises and Tests */}
                      <div className="grid grid-cols-2 gap-6">
                        {/* Vocabulary */}
                        <div>
                          <div className="flex justify-between items-center mb-3">
                            <h5 className="font-medium text-white">
                              Vocabulary
                            </h5>
                            <button
                              onClick={() =>
                                openModal(
                                  "vocabulary",
                                  "create",
                                  null,
                                  lessonData.lesson._id?.toString()
                                )
                              }
                              className="text-blue-400 hover:bg-blue-500/10 border border-blue-500 px-2 py-1 rounded text-sm transition-colors duration-200 flex items-center space-x-1"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                              </svg>
                              <span>Add Vocabulary</span>
                            </button>
                          </div>
                          <div className="space-y-2 max-h-[200px] overflow-y-auto">
                            {lessonData.vocabularies?.map((vocab, exIndex) => (
                              <div
                                key={vocab._id?.toString() || `ex-${exIndex}`}
                                className="bg-[#2D2D2D] p-4 rounded-md border border-[#4D4D4D] flex items-center gap-4 relative"
                              >
                                {vocab.imageUrl && (
                                  <div className="flex-shrink-0">
                                    <Image
                                      src={vocab.imageUrl}
                                      alt="Vocabulary"
                                      className="rounded-md border border-[#4D4D4D] object-cover"
                                      width={50}
                                      height={50}
                                    />
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <p
                                    className="text-white font-bold text-base mb-1 truncate"
                                    style={{
                                      maxWidth: 180,
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      whiteSpace: "nowrap",
                                    }}
                                    title={vocab.englishContent}
                                  >
                                    {vocab.englishContent}
                                  </p>
                                  <div
                                    className="text-[#b0b0b0] text-sm truncate"
                                    style={{
                                      maxWidth: 180,
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      whiteSpace: "nowrap",
                                    }}
                                    title={vocab.vietnameseContent}
                                  >
                                    {vocab.vietnameseContent}
                                  </div>
                                </div>
                                <div className="flex space-x-2 absolute right-4 top-1/2 -translate-y-1/2">
                                  <button
                                    onClick={() =>
                                      openModal(
                                        "vocabulary",
                                        "edit",
                                        vocab,
                                        lessonData.lesson._id?.toString()
                                      )
                                    }
                                    className="px-2 py-1 text-xs rounded border border-blue-500 text-blue-400 hover:bg-blue-500/10 transition-colors duration-200"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDelete(
                                        "vocabulary",
                                        vocab._id?.toString() || ""
                                      )
                                    }
                                    className="px-2 py-1 text-xs rounded border border-red-500 text-red-400 hover:bg-red-500/10 transition-colors duration-200"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Grammar */}
                        <div>
                          <div className="flex justify-between items-center mb-3">
                            <h5 className="font-medium text-white">Grammar</h5>
                            <button
                              onClick={() =>
                                openModal(
                                  "grammar",
                                  "create",
                                  null,
                                  lessonData.lesson._id?.toString()
                                )
                              }
                              className="text-blue-400 hover:bg-blue-500/10 border border-blue-500 px-2 py-1 rounded text-sm transition-colors duration-200 flex items-center space-x-1"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                              </svg>
                              <span>Add Grammar</span>
                            </button>
                          </div>
                          <div className="space-y-2 max-h-[200px] overflow-y-auto">
                            {lessonData.grammars?.map((grammar, grIndex) => (
                              <div
                                key={grammar._id?.toString() || `gr-${grIndex}`}
                                className="bg-[#2D2D2D] p-3 rounded-md border border-[#4D4D4D]"
                              >
                                <div>
                                  <p className="text-[#CFCFCF] font-semibold">
                                    {grammar.title}
                                  </p>
                                  <p className="text-[#9A9A9A]">
                                    Structure: {grammar.structure}
                                  </p>
                                  {grammar.example && (
                                    <p className="text-[#9A9A9A]">
                                      Example: {grammar.example}
                                    </p>
                                  )}
                                  {grammar.explanation && (
                                    <p className="text-[#9A9A9A]">
                                      Explanation: {grammar.explanation}
                                    </p>
                                  )}
                                </div>{" "}
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() =>
                                      openModal(
                                        "grammar",
                                        "edit",
                                        grammar,
                                        lessonData.lesson._id?.toString()
                                      )
                                    }
                                    className="px-2 py-1 text-xs rounded border border-blue-500 text-blue-400 hover:bg-blue-500/10 transition-colors duration-200"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDelete(
                                        "grammar",
                                        grammar._id?.toString() || ""
                                      )
                                    }
                                    className="px-2 py-1 text-xs rounded border border-red-500 text-red-400 hover:bg-red-500/10 transition-colors duration-200"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        {/* Exercises */}
                        <div>
                          <div className="flex justify-between items-center mb-3">
                            <h5 className="font-medium text-white">
                              Exercises
                            </h5>
                            <button
                              onClick={() =>
                                openModal(
                                  "exercise",
                                  "create",
                                  null,
                                  lessonData.lesson._id?.toString()
                                )
                              }
                              className="text-blue-400 hover:bg-blue-500/10 border border-blue-500 px-2 py-1 rounded text-sm transition-colors duration-200 flex items-center space-x-1"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                              </svg>
                              <span>Add Exercise</span>
                            </button>
                          </div>
                          <div className="space-y-2 max-h-[200px] overflow-y-auto">
                            {lessonData.exercises?.map((exercise, exIndex) => (
                              <div
                                key={
                                  exercise._id?.toString() || `ex-${exIndex}`
                                }
                                className="bg-[#2D2D2D] p-3 rounded-md border border-[#4D4D4D]"
                              >
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="text-[#CFCFCF]">
                                      {exercise.question}
                                    </p>
                                    <div className="flex items-center space-x-2 mt-2">
                                      <span className="text-xs text-[#9A9A9A] bg-[#373737] px-2 py-0.5 rounded">
                                        Type:{" "}
                                        {formatExerciseType(exercise.type)}
                                      </span>
                                      {exercise.focus && (
                                        <span className="text-xs text-[#9A9A9A] bg-[#373737] px-2 py-0.5 rounded">
                                          Focus:{" "}
                                          {exercise.focus
                                            .charAt(0)
                                            .toUpperCase() +
                                            exercise.focus
                                              .slice(1)
                                              .toLowerCase()}
                                        </span>
                                      )}
                                    </div>
                                    {exercise.type === "image_translate" &&
                                      exercise.image && (
                                        <div className="mt-2">
                                          <img
                                            src={exercise.image}
                                            alt="Exercise"
                                            className="max-w-[200px] h-auto rounded-md border border-[#4D4D4D]"
                                          />
                                        </div>
                                      )}
                                  </div>
                                  <div className="flex space-x-2">
                                    <button
                                      onClick={() =>
                                        openModal(
                                          "exercise",
                                          "edit",
                                          exercise,
                                          lessonData.lesson._id?.toString()
                                        )
                                      }
                                      className="px-2 py-1 text-xs rounded border border-blue-500 text-blue-400 hover:bg-blue-500/10 transition-colors duration-200"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleDelete(
                                          "exercise",
                                          exercise._id?.toString() || ""
                                        )
                                      }
                                      className="px-2 py-1 text-xs rounded border border-red-500 text-red-400 hover:bg-red-500/10 transition-colors duration-200"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Vertical Divider */}
                        <div className="w-px bg-[#4D4D4D] absolute left-1/2 transform -translate-x-1/2 h-full"></div>

                        {/* Tests */}
                        <div>
                          <div className="flex justify-between items-center mb-3">
                            <h5 className="font-medium text-white">Tests</h5>
                            <button
                              onClick={() =>
                                openModal(
                                  "test",
                                  "create",
                                  null,
                                  lessonData.lesson._id?.toString()
                                )
                              }
                              className="text-blue-400 hover:bg-blue-500/10 border border-blue-500 px-2 py-1 rounded text-sm transition-colors duration-200 flex items-center space-x-1"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                              </svg>
                              <span>Add Test</span>
                            </button>
                          </div>
                          <div className="space-y-2  max-h-[200px] overflow-y-auto">
                            {lessonData.tests?.map((test) => (
                              <div
                                key={test._id}
                                className="bg-[#2D2D2D] p-3 rounded-md border border-[#4D4D4D]"
                              >
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="text-[#CFCFCF]">
                                      {test.name}
                                    </p>
                                    <div className="text-xs text-[#9A9A9A] mt-2">
                                      <span className="bg-[#373737] px-2 py-0.5 rounded">
                                        Questions: {test.totalQuestions}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="flex space-x-2">
                                    <button
                                      onClick={() =>
                                        openModal(
                                          "test",
                                          "edit",
                                          test,
                                          lessonData.lesson._id?.toString()
                                        )
                                      }
                                      className="px-2 py-1 text-xs rounded border border-blue-500 text-blue-400 hover:bg-blue-500/10 transition-colors duration-200"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleDelete(
                                          "test",
                                          test._id.toString()
                                        )
                                      }
                                      className="px-2 py-1 text-xs rounded border border-red-500 text-red-400 hover:bg-red-500/10 transition-colors duration-200"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <div className="p-4 border-t border-[#1D1D1D] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#4CC2FF] text-black rounded hover:bg-[#3AA0DB] transition-colors"
          >
            Close
          </button>
        </div>
      </div>

      {/* Form Modals for Create/Edit */}
      {modalState.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <CourseFormModal
            type={modalState.type}
            mode={modalState.mode}
            data={modalState.data}
            courseDetails={courseDetails}
            onSubmit={(formData) => {
              if (modalState.mode === "create") {
                handleCreate(modalState.type, formData);
              } else {
                handleUpdate(modalState.type, modalState.data._id, formData);
              }
            }}
            onCancel={() =>
              setModalState((prev) => ({ ...prev, isOpen: false }))
            }
          />
        </div>
      )}
    </div>
  );
}
