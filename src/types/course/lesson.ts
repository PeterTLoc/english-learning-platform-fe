export interface Lesson {
  _id: string
  name: string
  description: string
  content: string
  order: number
  courseId: string
  duration: number
  isDeleted?: boolean
  createdAt: string
  updatedAt: string
} 