export type CourseLevelEnum = "beginner" | "intermediate" | "advanced"
export type CourseTypeEnum = "foundation" | "work" | "listening"

export interface Course {
  id: string
  name: string
  description?: string
  level: CourseLevelEnum
  type: CourseTypeEnum
  totalLessons?: number
  coverImage: string
}
