import { useState, useCallback, useMemo, useEffect } from "react";
import { IExercise } from "@/types/models/IExercise";
import {
  ExerciseContentState,
  UserExerciseData,
} from "@/types/lesson/exercise";
import {
  getExercisesByLessonId,
  getAllExercisesByLessonId,
} from "@/services/lessonService";
import {
  createUserExercise,
  submitExercisesForLesson,
  getUserExercise,
  getUserExercisesByLessonId,
} from "@/services/userExerciseService";
import {
  calculateProgress,
  filterUserExercisesByLesson,
  isAnswerCorrect,
} from "@/utils/exerciseUtils";

interface UseExerciseContentProps {
  lessonId: string;
  userId?: string;
  itemsPerPage?: number;
}

export const useExerciseContent = ({
  lessonId,
  userId,
  itemsPerPage = 5,
}: UseExerciseContentProps) => {
  const [state, setState] = useState<ExerciseContentState>({
    exercises: [],
    allExercises: [],
    loading: false,
    page: 1,
    totalPages: 1,
    selectedAnswers: {},
    hasSubmittedAnswers: false,
    userExercises: [],
    completedExercises: {},
  });

  const [isBatchSubmitting, setIsBatchSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchUserExercises = useCallback(async () => {
    if (!userId || !lessonId) return;
    try {
      // Use the lesson-specific API
      const data = await getUserExercisesByLessonId(userId, lessonId);
      console.log('Fetched user exercises for lesson:', data);
      setState((prev) => ({ ...prev, userExercises: data }));
      return true;
    } catch (err) {
      console.error("Failed to fetch user exercises", err);
      return false;
    }
  }, [userId, lessonId]);

  const fetchAllExercises = useCallback(async () => {
    try {
      const data = await getAllExercisesByLessonId(lessonId);
      setState((prev) => ({ ...prev, allExercises: data }));
      return true;
    } catch (error) {
      console.error("Failed to fetch all exercises", error);
      return false;
    }
  }, [lessonId]);

  const fetchExercises = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true }));

    try {
      const data = await getExercisesByLessonId(lessonId);
      setState((prev) => ({
        ...prev,
        exercises: data || [],
        totalPages: 1,
        loading: false,
      }));
    } catch (error) {
      console.error("Failed to fetch exercises", error);
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, [lessonId]);

  // Filter user exercises to only include those for the current lesson
  const lessonUserExercises = useMemo(() => {
    const filtered = filterUserExercisesByLesson(state.userExercises, state.allExercises);
    console.log('lessonUserExercises:', filtered);
    return filtered;
  }, [state.allExercises, state.userExercises]);

  // Create a map of completed exercises with their details
  const completedExercisesMap = useMemo(() => {
    const map: Record<
      string,
      {
        completed: boolean;
        userAnswer?: string;
        isCorrect?: boolean;
        completedAt?: Date;
      }
    > = {};
    state.userExercises.forEach((userExercise: any) => {
      const exerciseId = userExercise.exerciseId;
      // Use the completed property directly from the API
      map[exerciseId] = {
        completed: !!userExercise.completed,
        userAnswer: userExercise.userAnswer,
        isCorrect: !!userExercise.completed,
        completedAt: userExercise.createdAt ? new Date(userExercise.createdAt) : undefined,
      };
    });
    return map;
  }, [state.userExercises]);

  const completedIds = useMemo(
    () =>
      new Set(
        lessonUserExercises
          .filter(
            (ue) =>
              typeof (ue as any).completed !== "undefined" &&
              (ue as any).completed
          )
          .map((e) => e.exerciseId)
      ),
    [lessonUserExercises]
  );

  // Check if current page has any answers
  const currentPageHasAnswers = useMemo(() => {
    if (!state.exercises.length) return false;

    return state.exercises.some((exercise) => {
      const exerciseId = exercise._id as string;
      return (
        state.selectedAnswers[exerciseId] &&
        state.selectedAnswers[exerciseId] !== ""
      );
    });
  }, [state.exercises, state.selectedAnswers]);

  // Check if ALL exercises in the lesson have answers
  const allExercisesHaveAnswers = useMemo(() => {
    return state.allExercises.every(
      (exercise) => state.selectedAnswers[exercise._id as string]
    );
  }, [state.allExercises, state.selectedAnswers]);

  const total = state.allExercises.length;
  const completed = state.allExercises.filter((e) =>
    completedIds.has(e._id as string)
  ).length;
  const percent = calculateProgress(completed, total);

  // Ensure selectedAnswers is always a string for each exercise (single-select per exercise)
  const handleSelect = useCallback(
    (exerciseId: string, option: string) => {
      if (state.hasSubmittedAnswers) return;
      setState((prev) => ({
        ...prev,
        selectedAnswers: { ...prev.selectedAnswers, [exerciseId]: option },
      }));
    },
    [state.hasSubmittedAnswers]
  );

  const handleAutoSubmit = useCallback(
    async (exerciseId: string, answer: string) => {
      // Just save the answer locally, no API call
      setState((prev) => ({
        ...prev,
        selectedAnswers: { ...prev.selectedAnswers, [exerciseId]: answer },
      }));
    },
    []
  );

  const handleBatchSubmit = useCallback(async () => {
    if (!userId) {
      console.warn("User ID not found. Are you logged in?");
      return;
    }

    // Check if we have any answers to submit
    const exercisesWithAnswers = state.allExercises.filter(
      (exercise) => state.selectedAnswers[exercise._id as string]
    );

    if (exercisesWithAnswers.length === 0) {
      console.warn("No exercises have answers to submit");
      return;
    }

    setIsBatchSubmitting(true);

    // Submit exercises that have answers
    const submissionPayload = {
      userId,
      answers: exercisesWithAnswers.map((exercise) => ({
        exerciseId: exercise._id as string,
        selectedAnswers: [
          state.selectedAnswers[exercise._id as string] as string,
        ],
      })),
    };

    console.log(
      "Submitting payload:",
      JSON.stringify(submissionPayload, null, 2)
    );

    try {
      const result = await submitExercisesForLesson(
        lessonId,
        submissionPayload
      );
      console.log("Submission successful:", result);

      // Process the results to update local state
      const newCompletedExercises = { ...state.completedExercises };
      result.results.forEach((result) => {
        newCompletedExercises[result.exerciseId] = result.isCorrect;
      });

      // Mark exercises as submitted and validated
      setState((prev) => ({
        ...prev,
        hasSubmittedAnswers: true,
        completedExercises: newCompletedExercises,
      }));

      // Refresh user exercises to get updated completion status
      await fetchUserExercises();
    } catch (err) {
      console.error("Failed to submit exercises:", err);
      // Show user-friendly error message
      alert("Failed to submit exercises. Please try again.");
    } finally {
      setIsBatchSubmitting(false);
    }
  }, [
    userId,
    lessonId,
    state.allExercises,
    state.selectedAnswers,
    state.completedExercises,
    fetchUserExercises,
  ]);

  const handlePageChange = useCallback((newPage: number) => {
    setState((prev) => ({ ...prev, page: newPage }));
  }, []);

  // Fetch both user exercises and all exercises before calculating progress
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    Promise.all([fetchUserExercises(), fetchAllExercises()]).then(() => {
      if (isMounted) setLoading(false);
    });
    return () => { isMounted = false; };
  }, [userId, lessonId, fetchUserExercises, fetchAllExercises]);

  return {
    state,
    total,
    completed,
    percent,
    currentPageHasAnswers,
    allExercisesHaveAnswers,
    isBatchSubmitting,
    lessonUserExercises,
    completedExercisesMap,
    fetchUserExercises,
    fetchAllExercises,
    fetchExercises,
    handleSelect,
    handleAutoSubmit,
    handleBatchSubmit,
    handlePageChange,
    loading,
  };
};
