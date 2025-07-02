export interface Test {
  _id: string
  name: string
  description: string
  courseId: string
  lessonIds: string[]
  totalQuestions: number
  isDeleted?: boolean
  createdAt: string
  updatedAt: string
  exercises?: any[] // IExercise[] once we define it
} 