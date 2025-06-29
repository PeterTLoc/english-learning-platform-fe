export interface Test {
  _id: string
  name: string
  description: string
  courseId: string
  duration: number
  totalQuestions: number
  passingScore: number
  isDeleted?: boolean
  createdAt: string
  updatedAt: string
} 