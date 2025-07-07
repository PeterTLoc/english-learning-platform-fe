import { IExercise } from "@/types/models/IExercise"

/**
 * Exercise type constants
 */
const EXERCISE_TYPES = {
  MULTIPLE_CHOICE: 'multiple_choice',
  TRANSLATE: 'translate',
  FILL_IN_THE_BLANK: 'fill_in_the_blank',
  IMAGE_TRANSLATE: 'image_translate',
} as const

/**
 * Answer state styling classes
 */
const ANSWER_STATES = {
  CORRECT: 'border-green-500 bg-green-700',
  INCORRECT: 'border-red-500 bg-red-700',
  SELECTED: 'border-[#4CC2FF]',
  DISABLED: 'opacity-70',
} as const

/**
 * Checks if an exercise is multiple choice type
 */
export const isMultipleChoice = (exercise: IExercise): boolean => {
  return exercise.type === EXERCISE_TYPES.MULTIPLE_CHOICE
}

/**
 * Checks if an exercise has options
 */
export const hasOptions = (exercise: IExercise): boolean => {
  return Array.isArray(exercise.options) && exercise.options.length > 0
}

/**
 * Checks if an answer is correct for a given exercise
 */
export const isCorrectAnswer = (exercise: IExercise, answer: string): boolean => {
  if (Array.isArray(exercise.answer)) {
    return exercise.answer.includes(answer)
  }
  return exercise.answer === answer
}

/**
 * Calculates progress percentage
 */
export const calculateProgress = (completed: number, total: number): number => {
  if (total === 0) return 0
  return Math.round((completed / total) * 100)
}

/**
 * Filters user exercises to only include those for the current lesson
 */
export const filterUserExercisesByLesson = (
  userExercises: { exerciseId: string }[],
  lessonExercises: IExercise[]
): { exerciseId: string }[] => {
  if (!lessonExercises?.length || !userExercises?.length) return []
  
  const lessonExerciseIds = new Set(lessonExercises.map(e => e._id as string))
  
  return userExercises.filter(ue => lessonExerciseIds.has(ue.exerciseId))
}

/**
 * Gets the CSS class name for an answer option based on its state
 */
export const getAnswerOptionClassName = (
  option: string,
  selectedAnswer: string | string[] | undefined,
  exercise: IExercise,
  hasSubmitted: boolean
): string => {
  const baseClass = "px-3 py-2 border rounded bg-[#2A2A2A] text-white transition cursor-pointer multiple-choice-option"
  const disabledClass = hasSubmitted ? " disabled" : ""

  if (hasSubmitted) {
    // If this option is the correct answer, always show green border with background
    if (isCorrectAnswer(exercise, option)) {
      return `${baseClass} correct-answer${disabledClass}`
    }
    // If this option was selected but is incorrect, show red
    else if (selectedAnswer === option && !isCorrectAnswer(exercise, option)) {
      return `${baseClass} incorrect-answer${disabledClass}`
    }
    // Otherwise, show as disabled
    else {
      return `${baseClass} ${ANSWER_STATES.DISABLED}${disabledClass}`
    }
  }

  if (selectedAnswer === option) {
    return `${baseClass} ${ANSWER_STATES.SELECTED}`
  }

  return baseClass
}

/**
 * Formats the correct answer for display
 */
export const formatCorrectAnswer = (exercise: IExercise): string => {
  if (Array.isArray(exercise.answer)) {
    return exercise.answer.join(", ")
  }
  return exercise.answer as string
}

/**
 * Creates submission data for an exercise
 */
export const createSubmissionData = (
  exerciseId: string,
  answer: string
): { id: string; exerciseId: string; answer: string } => {
  return {
    id: exerciseId,
    exerciseId,
    answer
  }
}

export const isAnswerCorrect = (userAnswer: string, exercise: IExercise): boolean => {
  if (!userAnswer || !exercise.answer) return false
  
  const normalizedUserAnswer = normalizeString(userAnswer)
  const normalizedCorrectAnswers = (exercise.answer as string[]).map(answer => 
    normalizeString(answer)
  )
  
  return normalizedCorrectAnswers.includes(normalizedUserAnswer)
}

export const normalizeString = (str: string): string => {
  return str.trim().replace(/\s+/g, " ").replace(/[,.]/g, "").toLowerCase()
} 