import api from "@/lib/api"
import { getUserCourses } from "./userCourseService"
import { getUserLessons } from "./userLessonService"
import { getUserTests } from "./userTestService"

export interface User {
  _id: string
  username: string
  email: string
  role: number
  avatar: string
  lastOnline: string
  onlineStreak: number
  activeUntil: string | null
  isDeleted: boolean
  points: number
  createdAt: string
}

export interface UserDetail extends User {
  stats?: {
    totalPoints: number
    completedLessons: number
    completedCourses: number
    completedTests: number
    averageScore: number
    flashcardsMastered: number
  }
  flashcards?: {
    total: number
    mastered: number
    learning: number
    studying: number
  }
  courses?: {
    total: number
    completed: number
    inProgress: number
    list: Array<{
      _id: string
      name: string
      progress: number
      status: string
    }>
  }
  lessons?: {
    total: number
    completed: number
    inProgress: number
  }
  tests?: {
    total: number
    completed: number
    averageScore: number
    highestScore: number
  }
  achievements?: {
    total: number
    list: Array<{
      _id: string
      title: string
      description: string
      dateAwarded: string
    }>
  }
}

export interface PaginatedUsers {
  page: number
  total: number
  totalPages: number
  data: User[]
}

export interface UserQueryParams {
  page?: number
  size?: number
  search?: string
  role?: string
  sortBy?: string
  order?: string
}

/**
 * Get users with pagination and filtering
 */
export const getUsers = async (params: UserQueryParams): Promise<PaginatedUsers> => {
  const queryParams = new URLSearchParams()
  
  if (params.page) queryParams.set("page", params.page.toString())
  if (params.size) queryParams.set("size", params.size.toString())
  if (params.search) queryParams.set("search", params.search)
  if (params.role) queryParams.set("role", params.role)
  if (params.sortBy) queryParams.set("sortBy", params.sortBy)
  if (params.order) queryParams.set("order", params.order)
  
  const response = await api.get(`/api/users?${queryParams.toString()}`)
  return response.data
}

/**
 * Disable user (soft delete)
 */
export const disableUser = async (userId: string): Promise<void> => {
  await api.delete(`/api/users/${userId}`)
}

/**
 * Get user by ID
 */
export const getUserById = async (userId: string): Promise<User> => {
  const response = await api.get(`/api/users/${userId}`)
  return response.data.user
}

/**
 * Get detailed user information including stats, flashcards, courses, lessons, tests, and achievements
 */
export const getUserDetailById = async (userId: string): Promise<UserDetail> => {
  // First get the basic user information
  const userResponse = await api.get(`/api/users/${userId}`)
  const user = userResponse.data.user

  // Initialize the detailed user object
  const userDetail: UserDetail = {
    ...user
  }

  // Use Promise.allSettled to handle potentially unimplemented endpoints
  const [
    statsResponse,
    coursesResponse,
    lessonsResponse,
    testsResponse,
    achievementsResponse,
    flashcardsResponse
  ] = await Promise.allSettled([
    api.get(`/api/statistics/user/${userId}`).catch(() => ({ data: null })),
    getUserCourses(userId).catch(() => null),
    getUserLessons(userId).catch(() => null),
    getUserTests(userId).catch(() => null),
    api.get(`/api/user-achievements/${userId}/users`).catch(() => ({ data: null })),
    api.get(`/api/flashcard-sets/${userId}/user`).catch(() => ({ data: null }))
  ])

  // Safely add data if the endpoint was successful
  if (statsResponse.status === 'fulfilled' && statsResponse.value?.data) {
    userDetail.stats = statsResponse.value.data
  }

  if (coursesResponse.status === 'fulfilled' && coursesResponse.value) {
    const courses = coursesResponse.value.data || [];
    userDetail.courses = {
      total: courses.length,
      completed: courses.filter((c: any) => c.status === 'completed').length,
      inProgress: courses.filter((c: any) => c.status === 'ongoing').length,
      list: courses.map((c: any) => ({
        _id: c._id,
        name: c.course?.name || 'Unknown Course',
        progress: c.progress || 0,
        status: c.status
      }))
    }
  }

  if (lessonsResponse.status === 'fulfilled' && lessonsResponse.value) {
    const lessons = lessonsResponse.value.data || [];
    userDetail.lessons = {
      total: lessons.length,
      completed: lessons.filter((l: any) => l.status === 'completed').length,
      inProgress: lessons.filter((l: any) => l.status === 'in-progress').length
    }
  }

  if (testsResponse.status === 'fulfilled' && testsResponse.value) {
    const tests = testsResponse.value.data || [];
    const scores = tests.map((t: any) => t.score || 0);
    userDetail.tests = {
      total: tests.length,
      completed: tests.filter((t: any) => t.status === 'completed').length,
      averageScore: scores.length ? scores.reduce((a: number, b: number) => a + b, 0) / scores.length : 0,
      highestScore: scores.length ? Math.max(...scores) : 0
    }
  }

  if (achievementsResponse.status === 'fulfilled' && achievementsResponse.value?.data) {
    const achievements = achievementsResponse.value.data.data || [];
    userDetail.achievements = {
      total: achievements.length,
      list: achievements.map((a: any) => ({
        _id: a._id,
        title: a.achievement?.name || 'Unknown Achievement',
        description: a.achievement?.description || '',
        dateAwarded: a.createdAt
      }))
    }
  }

  if (flashcardsResponse.status === 'fulfilled' && flashcardsResponse.value?.data) {
    userDetail.flashcards = flashcardsResponse.value.data
  }

  // Return user detail with whatever data was successfully fetched
  return userDetail
} 