import { useState, useCallback, useMemo } from "react"
import { IExercise } from "@/types/models/IExercise"
import { ExerciseContentState, UserExerciseData } from "@/types/lesson/exercise"
import {
  getExercisesByLessonId,
  getAllExercisesByLessonId,
  PaginatedExercisesResponse,
} from "@/services/lessonService"
import { createUserExercise, submitExercisesForLesson, getUserExercise, getUserExercisesByLessonId } from "@/services/userExerciseService"
import {
  calculateProgress,
  filterUserExercisesByLesson,
  isAnswerCorrect,
} from "@/utils/exerciseUtils"

interface UseExerciseContentProps {
  lessonId: string
  userId?: string
  itemsPerPage?: number
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
  })

  const [isBatchSubmitting, setIsBatchSubmitting] = useState(false)

  const fetchUserExercises = useCallback(async () => {
    if (!userId) return
    
    try {
      const data = await getUserExercise(userId)
      setState(prev => ({ ...prev, userExercises: data }))
    } catch (err) {
      console.error("Failed to fetch user exercises", err)
    }
  }, [userId])

  const fetchAllExercises = useCallback(async () => {
    try {
      const data = await getAllExercisesByLessonId(lessonId)
      setState(prev => ({ ...prev, allExercises: data }))
    } catch (error) {
      console.error("Failed to fetch all exercises", error)
    }
  }, [lessonId])

  const fetchExercises = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true }))
    
    try {
      const data: PaginatedExercisesResponse = await getExercisesByLessonId(
        lessonId,
        state.page,
        itemsPerPage
      )
      setState(prev => ({
        ...prev,
        exercises: data.data,
        totalPages: data.totalPages,
        loading: false,
      }))
    } catch (error) {
      console.error("Failed to fetch exercises", error)
      setState(prev => ({ ...prev, loading: false }))
    }
  }, [lessonId, state.page, itemsPerPage])

  // Filter user exercises to only include those for the current lesson
  const lessonUserExercises = useMemo(() => {
    return filterUserExercisesByLesson(state.userExercises, state.allExercises)
  }, [state.allExercises, state.userExercises])

  // Create a map of completed exercises with their details
  const completedExercisesMap = useMemo(() => {
    const map: Record<string, { completed: boolean; userAnswer?: string; isCorrect?: boolean; completedAt?: Date }> = {}
    lessonUserExercises.forEach(userExercise => {
      const exerciseId = userExercise.exerciseId
      const exercise = state.allExercises.find(ex => ex._id === exerciseId)
      // Only add if userExercise has the right properties
      if (
        exercise &&
        typeof (userExercise as any).completed !== 'undefined' &&
        typeof (userExercise as any).createdAt !== 'undefined'
      ) {
        map[exerciseId] = {
          completed: (userExercise as any).completed || false,
          userAnswer: undefined,
          isCorrect: (userExercise as any).completed || false,
          completedAt: (userExercise as any).createdAt ? new Date((userExercise as any).createdAt) : undefined,
        }
      }
    })
    return map
  }, [lessonUserExercises, state.allExercises])

  const completedIds = useMemo(
    () => new Set(lessonUserExercises.filter(ue => typeof (ue as any).completed !== 'undefined' && (ue as any).completed).map((e) => e.exerciseId)),
    [lessonUserExercises]
  )

  // Check if current page has any answers
  const currentPageHasAnswers = useMemo(() => {
    if (!state.exercises.length) return false
    
    return state.exercises.some(exercise => {
      const exerciseId = exercise._id as string
      return state.selectedAnswers[exerciseId] && state.selectedAnswers[exerciseId] !== ""
    })
  }, [state.exercises, state.selectedAnswers])

  // Check if ALL exercises in the lesson have answers
  const allExercisesHaveAnswers = useMemo(() => {
    return state.allExercises.every(exercise => 
      state.selectedAnswers[exercise._id as string]
    )
  }, [state.allExercises, state.selectedAnswers])

  const total = state.allExercises.length
  const completed = state.allExercises.filter((e) =>
    completedIds.has(e._id as string)
  ).length
  const percent = calculateProgress(completed, total)

  // Ensure selectedAnswers is always a string for each exercise (single-select per exercise)
  const handleSelect = useCallback((exerciseId: string, option: string) => {
    if (state.hasSubmittedAnswers) return
    setState(prev => ({
      ...prev,
      selectedAnswers: { ...prev.selectedAnswers, [exerciseId]: option }
    }))
  }, [state.hasSubmittedAnswers])

  const handleAutoSubmit = useCallback(async (exerciseId: string, answer: string) => {
    // Just save the answer locally, no API call
    setState(prev => ({
      ...prev,
      selectedAnswers: { ...prev.selectedAnswers, [exerciseId]: answer }
    }))
  }, [])

  const handleBatchSubmit = useCallback(async () => {
    if (!userId) {
      console.warn("User ID not found. Are you logged in?")
      return
    }

    // Check if we have any answers to submit
    const exercisesWithAnswers = state.allExercises.filter(exercise => 
      state.selectedAnswers[exercise._id as string]
    )

    if (exercisesWithAnswers.length === 0) {
      console.warn("No exercises have answers to submit")
      return
    }

    setIsBatchSubmitting(true)

    // Submit exercises that have answers
    const submissionPayload = {
      userId,
      answers: exercisesWithAnswers.map(exercise => ({
        exerciseId: exercise._id as string,
        selectedAnswers: [state.selectedAnswers[exercise._id as string] as string]
      }))
    }

    console.log('Submitting payload:', JSON.stringify(submissionPayload, null, 2))

    try {
      const result = await submitExercisesForLesson(lessonId, submissionPayload)
      console.log('Submission successful:', result)
      
      // Process the results to update local state
      const newCompletedExercises = { ...state.completedExercises }
      result.results.forEach(result => {
        newCompletedExercises[result.exerciseId] = result.isCorrect
      })
      
      // Mark exercises as submitted and validated
      setState(prev => ({
        ...prev,
        hasSubmittedAnswers: true,
        completedExercises: newCompletedExercises
      }))

      // Refresh user exercises to get updated completion status
      await fetchUserExercises()
    } catch (err) {
      console.error("Failed to submit exercises:", err)
      // Show user-friendly error message
      alert("Failed to submit exercises. Please try again.")
    } finally {
      setIsBatchSubmitting(false)
    }
  }, [userId, lessonId, state.allExercises, state.selectedAnswers, state.completedExercises, fetchUserExercises])

  const handlePageChange = useCallback((newPage: number) => {
    setState(prev => ({ ...prev, page: newPage }))
  }, [])

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
  }
} 