import api from "@/lib/api"
import { Course } from "@/types/course/course"

export const getAllCourses = async (): Promise<Course[]> => {
  const response = await api.get("/api/courses")
  return response.data.data
}

export const getCourseById = async (id: string): Promise<Course> => {
  const response = await api.get(`/api/courses/${id}`)
  return response.data.course
}
