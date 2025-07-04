export interface Lesson {
  _id: string
  courseId: string
  name: string
  description?: string
  length: {
    for: "vocabulary" | "grammar" | "exercise"
    amount: number
  }[]
  order: number
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}
