import { LessonLength } from './LessonLength';

export interface Lesson {
  _id: string
  courseId: string
  name: string
  order: number
  description: string
  length: LessonLength[]
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}
