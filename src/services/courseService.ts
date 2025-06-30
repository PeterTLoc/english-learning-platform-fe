import api from "@/lib/api"
import { Course, CourseLevelEnum, CourseTypeEnum } from "@/types/course/course"

export interface CourseQueryParams {
  page?: number
  size?: number
  search?: string
  level?: CourseLevelEnum
  type?: CourseTypeEnum
  sortBy?: string
  order?: string
}

export interface PaginatedCourses {
  page: number
  total: number
  totalPages: number
  data: Course[]
}

export const getAllCourses = async (params: CourseQueryParams): Promise<PaginatedCourses> => {
  const queryParams = new URLSearchParams()
  
  if (params.page) queryParams.set("page", params.page.toString())
  if (params.size) queryParams.set("size", params.size.toString())
  if (params.search) queryParams.set("search", params.search)
  if (params.level) queryParams.set("level", params.level)
  if (params.type) queryParams.set("type", params.type)
  if (params.sortBy) queryParams.set("sortBy", params.sortBy)
  if (params.order) queryParams.set("order", params.order)
  
  const response = await api.get(`/api/courses?${queryParams.toString()}`)
  return response.data
}

export const getCourseById = async (id: string): Promise<Course> => {
  const response = await api.get(`/api/courses/${id}`)
  return response.data.course
}

export const createCourse = async (courseData: FormData): Promise<Course> => {
  const response = await api.post("/api/courses", courseData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data.course;
}

export const updateCourse = async (id: string, courseData: FormData): Promise<Course> => {
  const response = await api.patch(`/api/courses/${id}`, courseData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data.course;
}

export const deleteCourse = async (id: string): Promise<void> => {
  await api.delete(`/api/courses/${id}`)
}
