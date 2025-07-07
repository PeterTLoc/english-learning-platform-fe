import { IExercise } from "../models/IExercise"

export interface Test {
  _id: string
  name: string
  description: string
  courseId: string
  lessonIds: string[]
  totalQuestions: number
  order: number
  isDeleted?: boolean
  createdAt: string
  updatedAt: string
  exercises?: IExercise[]
} 