export type CourseLevelEnum = "beginner" | "intermediate" | "advanced"
export type CourseTypeEnum = "foundation" | "work" | "listening"

export interface Course {
  _id: string
  name: string
  description: string
  level: string
  type: string
  totalLessons: number
  coverImage?: string
  createdAt: string
  updatedAt: string
  isDeleted: boolean
}
