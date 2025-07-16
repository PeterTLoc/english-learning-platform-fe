"use client";

import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useExerciseContent } from "@/hooks/useExerciseContent";
import ExerciseQuestion from "./exercise/ExerciseQuestion";
import ExerciseProgressBar from "./exercise/ExerciseProgressBar";
import { createUserExercise } from "@/services/userExerciseService";
import ContentSlideIn from "@/components/ui/ContentSlideIn";
import { isAnswerCorrect } from "@/utils/exerciseUtils";
import Link from "next/link";
import { getLessonById } from "@/services/lessonService";
import { ChevronRight } from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface ExerciseContentProps {
  courseId: string;
  lessonId: string;
  itemsPerPage?: number;
  setSidebarRefreshKey?: React.Dispatch<React.SetStateAction<number>>;
}

export default function ExerciseContent({
  courseId,
  lessonId,
  itemsPerPage = 5,
  setSidebarRefreshKey,
}: ExerciseContentProps) {
  const { user } = useAuth();
  const router = useRouter();
  const userId = user?._id;
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [isPracticeMode, setIsPracticeMode] = useState(false);
  const hasInitialized = useRef(false);
  const [lessonName, setLessonName] = useState<string>("");
  const [progressKey, setProgressKey] = useState(0); // Force progress bar re-render

  const {
    state,
    completedExercisesMap,
    fetchUserExercises,
    fetchAllExercises,
    fetchExercises,
    handleSelect,
  } = useExerciseContent({
    lessonId,
    userId,
    itemsPerPage,
  });

  // Initialize data only once when component mounts
  useEffect(() => {
    if (!hasInitialized.current && userId) {
      hasInitialized.current = true;
      fetchUserExercises();
      fetchAllExercises();
      fetchExercises();
    }
  }, [userId, lessonId, fetchUserExercises, fetchAllExercises, fetchExercises]);

  // Reset initialization when lessonId changes (route navigation)
  useEffect(() => {
    hasInitialized.current = false;
    setCurrentExerciseIndex(0);
    setShowCorrectAnswer(false);
    setProgressKey(prev => prev + 1);
  }, [lessonId]);

  // Initialize to first incomplete exercise
  useEffect(() => {
    if (state.allExercises.length > 0 && completedExercisesMap) {
      const firstIncompleteIndex = state.allExercises.findIndex((exercise) => {
        const exerciseId = exercise._id as string;
        return !completedExercisesMap[exerciseId]?.completed;
      });

      if (firstIncompleteIndex !== -1) {
        setCurrentExerciseIndex(firstIncompleteIndex);
      }
    }
  }, [state.allExercises, completedExercisesMap]);

  // Get all exercises for the lesson
  const allExercises = state.allExercises;
  const currentExercise = allExercises[currentExerciseIndex];
  const total = allExercises.length;
  const completed = allExercises.filter((e) => {
    const exerciseId = e._id as string;
    return completedExercisesMap[exerciseId]?.completed;
  }).length;

  // Calculate progress percentage
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Find next incomplete exercise
  const findNextIncompleteExercise = () => {
    // First, try to find the next incomplete exercise after current index
    for (let i = currentExerciseIndex + 1; i < total; i++) {
      const exerciseId = allExercises[i]._id as string;
      if (!completedExercisesMap[exerciseId]?.completed) {
        return i;
      }
    }

    // If no incomplete exercises found after current index, loop back to beginning
    for (let i = 0; i < currentExerciseIndex; i++) {
      const exerciseId = allExercises[i]._id as string;
      if (!completedExercisesMap[exerciseId]?.completed) {
        return i;
      }
    }

    return -1;
  };

  // Check if all exercises are completed
  const allExercisesCompleted = () => {
    return allExercises.every((exercise) => {
      const exerciseId = exercise._id as string;
      return completedExercisesMap[exerciseId]?.completed;
    });
  };

  // Handle exercise completion
  const handleExerciseComplete = async (exerciseId: string, answer: string) => {
    if (!userId) return;

    const isMultipleChoiceExercise =
      currentExercise?.type === "multiple_choice";

    // For multiple choice, show feedback immediately
    if (isMultipleChoiceExercise) {
      setShowCorrectAnswer(true);
    }

    try {
      const response = await createUserExercise({
        id: exerciseId,
        exerciseId: exerciseId,
        answer: answer,
      });

      const isCorrect = response.message === "Correct answer";

      if (isCorrect) {
        if (!isPracticeMode) {
          await fetchUserExercises();
          // Force progress bar update
          setProgressKey(prev => prev + 1);
          if (setSidebarRefreshKey) setSidebarRefreshKey((prev) => prev + 1);
        }

        if (!isPracticeMode) {
          const allCompleted = allExercises.every((exercise) => {
            const exId = exercise._id as string;
            return completedExercisesMap[exId]?.completed;
          });

          if (allCompleted) {
            setShowCorrectAnswer(true);
          } else {
            const nextIndex = findNextIncompleteExercise();
            if (nextIndex !== -1) {
              setCurrentExerciseIndex(nextIndex);
              setShowCorrectAnswer(false);
            } else {
              setShowCorrectAnswer(true);
            }
          }
        } else {
          setShowCorrectAnswer(true);
        }
      } else {
        if (!isMultipleChoiceExercise) {
          setShowCorrectAnswer(true);
        }
      }
    } catch (error) {
      console.error("Failed to submit exercise:", error);
      if (isMultipleChoiceExercise) {
        setShowCorrectAnswer(true);
      }
    }
  };

  // Handle clicking correct answer to continue
  const handleContinueToNext = () => {
    if (isPracticeMode) {
      if (currentExerciseIndex < total - 1) {
        setCurrentExerciseIndex(currentExerciseIndex + 1);
      } else {
        setCurrentExerciseIndex(0);
      }
      setShowCorrectAnswer(false);
      if (currentExercise) {
        handleSelect(currentExercise._id as string, "");
      }
    } else {
      const nextIndex = findNextIncompleteExercise();
      if (nextIndex !== -1) {
        setCurrentExerciseIndex(nextIndex);
        setShowCorrectAnswer(false);
      } else {
        setShowCorrectAnswer(false);
        if (currentExercise) {
          handleSelect(currentExercise._id as string, "");
        }
      }
    }
  };

  // Handle practice again
  const handlePracticeAgain = () => {
    setIsPracticeMode(true);
    setCurrentExerciseIndex(0);
    setShowCorrectAnswer(false);
    setProgressKey(prev => prev + 1);
    Object.keys(state.selectedAnswers).forEach((key) => {
      handleSelect(key, "");
    });
  };

  // Handle navigation back to lesson overview
  const handleBackToLesson = () => {
    router.push(`/courses/${courseId}/lessons/${lessonId}`);
  };

  useEffect(() => {
    getLessonById(lessonId).then((lesson) => setLessonName(lesson?.name || ""));
  }, [lessonId]);

  if (state.loading || !lessonName) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 h-full">
        <LoadingSpinner size="medium" />
        <p className="text-lg">Loading exercise content...</p>
      </div>
    )
  }

  if (!allExercises.length)
    return (
      <ContentSlideIn keyValue={`${lessonId}-empty`} isLoading={false}>
        <div className="title flex items-center gap-5 mb-4">
          <Link href={`/courses/${courseId}/lessons/${lessonId}`} className="text-[#AAAAAA] transition-colors duration-200 hover:text-white">
            {lessonName}
          </Link>
          <ChevronRight size={20} strokeWidth={3} className="subtext" />
          <span>Exercise</span>
        </div>
        <div className="flex flex-col bg-[#2B2B2B] border border-[#1D1D1D] rounded-lg p-5">
          <p className="text-lg">No exercise available.</p>
        </div>
      </ContentSlideIn>
    );
  const isAllCompleted = allExercisesCompleted();

  // Debug logs for progress bar
  console.log('allExercises:', allExercises);
  console.log('completedExercisesMap:', completedExercisesMap);
  console.log('completed:', completed, 'total:', total, 'percent:', percent);
  console.log('isAllCompleted:', isAllCompleted);

  return (
    <>
      <div className="title flex items-center gap-5 mb-4">
        <Link href={`/courses/${courseId}/lessons/${lessonId}`} className="text-[#AAAAAA] transition-colors duration-200 hover:text-white">
          {lessonName}
        </Link>
        <ChevronRight size={20} strokeWidth={3} className="subtext" />
        <span>Exercise</span>
      </div>
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="h-[calc(100vh-275px)] flex flex-col gap-5">
          {/* Progress Bar */}
          <div>
            <ExerciseProgressBar
              key={`progress-${progressKey}-${lessonId}`}
              completed={completed}
              total={total}
              percent={percent}
            />
          </div>

          {/* Exercise Content */}
          <div className="flex-1 overflow-y-auto text-md">
            {isAllCompleted && !isPracticeMode ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-[17px] font-bold text-white mb-2">
                  Congratulations!
                </h2>
                <p className="text-md subtext mb-6">
                  You have completed all exercises in this lesson.
                </p>
                <div className="flex gap-3 justify-center">
                  <button className="button-blue" onClick={handlePracticeAgain}>
                    Practice Again
                  </button>
                  <button className="button" onClick={handleBackToLesson}>
                    Back to Lesson
                  </button>
                </div>
              </div>
            ) : currentExercise ? (
              <ExerciseQuestion
                exercise={currentExercise}
                index={currentExerciseIndex + 1}
                selectedAnswer={(() => {
                  const val =
                    state.selectedAnswers[currentExercise._id as string];
                  if (Array.isArray(val)) return val[0] || "";
                  return val || "";
                })()}
                onSelect={handleSelect}
                hasSubmitted={showCorrectAnswer}
                onAutoSubmit={handleExerciseComplete}
                isCompleted={
                  isPracticeMode
                    ? false
                    : completedExercisesMap[currentExercise._id as string]
                        ?.completed
                }
                userAnswer={
                  isPracticeMode
                    ? undefined
                    : completedExercisesMap[currentExercise._id as string]
                        ?.userAnswer
                }
                isCorrect={
                  isPracticeMode
                    ? undefined
                    : completedExercisesMap[currentExercise._id as string]
                        ?.isCorrect
                }
                showCorrectAnswer={showCorrectAnswer}
                onContinueToNext={handleContinueToNext}
              />
            ) : (
              <p>Loading exercise...</p>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
}
