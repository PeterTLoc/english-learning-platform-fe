import { IExercise } from "@/types/models/IExercise"

export interface Exercise {
  _id: string
  lessonId: string
  type:
    | "translate"
    | "image_translate"
    | "fill_in_the_blank"
    | "multiple_choice"
    | string
  question: string
  options?: string[]
  answer: string[] | string
  explanation?: string
  focus: "vocabulary" | "grammar" | "exercise" | string
  image?: string
  order: number
  isDeleted?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface ExerciseCardProps {
  exercise: IExercise
  index: number
  selectedAnswer?: string | string[]
  onSelect: (exerciseId: string, answer: string) => void
  hasSubmitted: boolean
  isCompleted?: boolean
  userAnswer?: string
  isCorrect?: boolean
  completedAt?: Date | string
}

export interface ProgressBarProps {
  completed: number
  total: number
  percent: number
}

export interface PaginationControlsProps {
  page: number
  totalPages: number
  onPrev: () => void
  onNext: () => void
  onPageSelect: (page: number) => void
}

export interface ExerciseNavigationProps {
  currentPage: number
  totalPages: number
  completedPages: number[]
  onPageSelect: (page: number) => void
  onBatchSubmit?: () => void
  hasUnsubmittedAnswers?: boolean
  isSubmitting?: boolean
  allExercises?: IExercise[]
  completedExercisesMap?: Record<string, { completed: boolean; userAnswer?: string; isCorrect?: boolean; completedAt?: Date }>
  selectedAnswers?: Record<string, string | string[]>
  itemsPerPage?: number
}

export interface ExerciseSubmissionData {
  id: string
  exerciseId: string
  answer: string
}

export interface UserExerciseData {
  exerciseId: string
  exercise?: any
  completed?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface ExerciseContentState {
  exercises: IExercise[]
  allExercises: IExercise[]
  loading: boolean
  page: number
  totalPages: number
  selectedAnswers: Record<string, string | string[]>
  hasSubmittedAnswers: boolean
  userExercises: UserExerciseData[]
  completedExercises: Record<string, boolean>
}
