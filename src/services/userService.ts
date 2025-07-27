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
  courses?: {
    total: number
    completed: number
    inProgress: number
    list: Array<{
      _id: string
      courseId: string
      name: string
      progress: number
      status: string
      lessonFinished: number
      totalLessons: number
    }>
  }
  lessons?: {
    total: number
    completed: number
    inProgress: number
    list: Array<{
      _id: string
      lesson: {
        courseId: string
        name: string
      }
      status: string
    }>
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
  flashcards?: {
    total: number
    mastered: number
    learning: number
    studying: number
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

class UserService {
  /**
   * Get users with pagination and filtering
   */
  async getUsers(params: UserQueryParams): Promise<PaginatedUsers> {
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
  async disableUser(userId: string): Promise<void> {
    await api.delete(`/api/users/${userId}`)
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<{ user: User }> {
    const response = await api.get(`/api/users/${userId}`)
    return response.data
  }

  /**
   * Get detailed user information including stats, flashcards, courses, lessons, tests, and achievements
   */
  async getUserDetailById(userId: string): Promise<UserDetail> {
    const userResponse = await api.get(`/api/users/${userId}`)
    const user = userResponse.data.user

    const userDetail: UserDetail = {
      ...user,
    }

    const [
      statsResponse,
      coursesResponse,
      lessonsResponse,
      testsResponse,
      achievementsResponse,
      flashcardsResponse,
    ] = await Promise.allSettled([
      api.get(`/api/statistics/user/${userId}`).catch(() => ({ data: null })),
      getUserCourses(userId).catch(() => null),
      getUserLessons(userId).catch(() => null),
      getUserTests(userId).catch(() => null),
      api
        .get(`/api/user-achievements/${userId}/users`)
        .catch(() => ({ data: null })),
      api.get(`/api/user-flashcards/${userId}`).catch(() => ({ data: null })),
    ])

    if (statsResponse.status === "fulfilled" && statsResponse.value?.data) {
      userDetail.stats = statsResponse.value.data
    }

    if (coursesResponse.status === "fulfilled" && coursesResponse.value) {
      const courses = coursesResponse.value.data || []
      userDetail.courses = {
        total: courses.length,
        completed: courses.filter((c: any) => c.status === "completed").length,
        inProgress: courses.filter((c: any) => c.status === "ongoing").length,
        list: courses.map((c: any) => ({
          _id: c._id,
          courseId: c.courseId,
          name: c.course?.name || "Unknown Course",
          progress: c.progress || 0,
          status: c.status,
          lessonFinished: c.lessonFinished || 0,
          totalLessons: c.course?.totalLessons || 0,
        })),
      }
    }

    if (lessonsResponse.status === "fulfilled" && lessonsResponse.value) {
      const lessons = lessonsResponse.value.data || []
      userDetail.lessons = {
        total: lessons.length,
        completed: lessons.filter((l: any) => l.status === "completed").length,
        inProgress: lessons.filter((l: any) => l.status === "ongoing")
          .length,
        list: lessons.map((l: any) => ({
          _id: l._id,
          lesson: {
            courseId: l.lesson?.courseId || l.courseId,
            name: l.lesson?.name || "Unknown Lesson",
          },
          status: l.status,
        })),
      }
    }

    if (testsResponse.status === "fulfilled" && testsResponse.value) {
      const tests = testsResponse.value.data || []
      const scores = tests.map((t: any) => t.score || 0)
      const averageScore = scores.length
        ? scores.reduce((a: number, b: number) => a + b, 0) / scores.length
        : 0
      userDetail.tests = {
        total: tests.length,
        completed: tests.filter((t: any) => t.status === "passed" || t.status === "failed").length,
        averageScore: Number(averageScore.toFixed(2)),
        highestScore: scores.length ? Math.max(...scores) : 0,
      }
    }

    if (
      achievementsResponse.status === "fulfilled" &&
      achievementsResponse.value?.data
    ) {
      const achievements = achievementsResponse.value.data.data || []
      userDetail.achievements = {
        total: achievements.length,
        list: achievements.map((a: any) => ({
          _id: a._id,
          title: a.achievement?.name || "Unknown Achievement",
          description: a.achievement?.description || "",
          dateAwarded: a.createdAt,
        })),
      }
    }

    if (flashcardsResponse.status === "fulfilled" && flashcardsResponse.value?.data) {
      const flashcards = flashcardsResponse.value.data || []
      userDetail.flashcards = {
        total: flashcards.length,
        mastered: flashcards.filter((f: any) => f.status === "mastered").length,
        learning: flashcards.filter((f: any) => f.status === "learning").length,
        studying: flashcards.filter((f: any) => f.status === "studying").length,
      }
    }

    return userDetail
  }

  /**
   * Update user profile information (username and avatar only)
   */
  async updateUserProfile(
    userId: string,
    profileData: { username?: string; avatarFile?: File }
  ): Promise<{ user: User }> {
    const formData = new FormData()

    // Add username as "name" field (backend expects "name" not "username")
    if (profileData.username) {
      formData.append("name", profileData.username)
    }

    // Add avatar file if provided
    if (profileData.avatarFile) {
      formData.append("avatar", profileData.avatarFile)
    }

    const response = await api.patch(`/api/users/${userId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  }

  /**
   * Change user password
   */
  async changePassword(
    userId: string,
    passwordData: { oldPassword: string; newPassword: string }
  ): Promise<void> {
    await api.put(`/api/auth/change-password`, passwordData)
  }

  /*
   * Get top leaderboard user
   */
  async getLeaderboard(limit?: number, sortBy: string = "points") {
    const response = await api.get(
      `/api/users/leaderboard?limit=${limit}&sortBy=${sortBy}`
    )

    return response.data
  }
}

export default UserService
