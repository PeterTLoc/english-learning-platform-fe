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

export interface Lesson {
  _id: string;
  courseId: string;
  name: string;
  description: string;
  length: number;
  order: number;
  isDeleted: boolean;
  createdAt: string; 
  updatedAt: string; 
  __v: number;
  course: Course;
}