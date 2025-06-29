// Course Level Enum (CEFR levels)
export type CourseLevelEnum = "A1" | "A2" | "B1" | "B2" | "C1" | "C2"

// Course Type Enum
export type CourseTypeEnum = "free" | "membership"

export interface Course {
  _id: string
  name: string
  description: string
  level: CourseLevelEnum
  type: CourseTypeEnum
  totalLessons: number
  coverImage?: string
  createdAt: string
  updatedAt: string
  isDeleted: boolean
}
