import api from "@/lib/api"

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

export const getUserCourseById = async (userCourseId: string) => {
  const response = await api.get(`/api/user-courses/${userCourseId}`)
  return response.data.userCourse
}
