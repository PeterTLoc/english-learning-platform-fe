import api from "@/lib/api"
import { Course } from "@/types/course/course"
import { UserCourseStatusType } from "@/enums/UserCourseStatusEnum"

export interface UserCourse {
  _id: string
  userId: string
  courseId: string
  lessonFinished: number
  averageScore: number | null
  status: UserCourseStatusType
  isDeleted?: boolean
  createdAt: string
  updatedAt: string
  // Populated fields from aggregation
  course?: Course
}

export const getUserCourses = async (userId: string) => {
  const response = await api.get(`/api/user-courses/${userId}/user`)
  return response.data
}

export const getUserCourseByCourseId = async (courseId: string) => {
  const response = await api.get(`/api/user-courses/${courseId}/course`)
  return response.data
}

export const getUserCourseById = async (userCourseId: string): Promise<UserCourse> => {
  const response = await api.get(`/api/user-courses/${userCourseId}`)
  return response.data.data
}

export const createUserCourse = async (data: Partial<UserCourse>) => {
  const response = await api.post('/api/user-courses', data)
  return response.data
}

export const updateUserCourse = async (id: string, data: Partial<UserCourse>) => {
  const response = await api.put(`/api/user-courses/${id}`, data)
  return response.data
}

export const deleteUserCourse = async (id: string) => {
  const response = await api.delete(`/api/user-courses/${id}`)
  return response.data
}

export const enrollCourse = async (userId: string, courseId: string) => {
  const response = await api.post("/api/user-courses", {
    userId,
    courseId,
  })

  return response.data.userCourse
}

export const getAllUserCourses = async (userId: string) => {
  const response = await api.get(`/api/user-courses/${userId}/user`)
  return response.data.data
}
