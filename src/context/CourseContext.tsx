"use client"

import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useAuth } from "@/context/AuthContext"
import { getAllUserCourses } from "@/services/userCourseService"

type CourseStatus = "ongoing" | "completed" | null

interface UserCourseMap {
  [courseId: string]: {
    id: string
    status: CourseStatus
    currentOrder: number
  }
}

interface CourseContextType {
  userCourses: UserCourseMap
  fetchAllCourses: () => Promise<void>
  setCourseStatus: (courseId: string, status: CourseStatus) => void
}

const CourseContext = createContext<CourseContextType | undefined>(undefined)

export const useCourse = () => {
  const ctx = useContext(CourseContext)
  if (!ctx) throw new Error("useCourse must be used inside CourseProvider")
  return ctx
}

export const CourseProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth()
  const [userCourses, setUserCourses] = useState<UserCourseMap>({})

  const fetchAllCourses = useCallback(async () => {
    if (!user?._id) return

    try {
      const userCourseList = await getAllUserCourses(user._id)
      const map: UserCourseMap = {}

      for (const uc of userCourseList) {
        map[String(uc.courseId)] = {
          id: uc.id,
          status: uc.status,
          currentOrder: uc.currentOrder,
        }
      }

      setUserCourses(map)
    } catch (err) {
      console.error("Failed to fetch user courses", err)
    }
  }, [user?._id])

  // Automatically fetch user courses when user is available and auth is loaded
  useEffect(() => {
    if (!loading && user?._id) {
      fetchAllCourses()
    }
  }, [user?._id, loading, fetchAllCourses])

  const setCourseStatus = (courseId: string, status: CourseStatus) => {
    setUserCourses((prev) => ({
      ...prev,
      [courseId]: {
        ...prev[courseId],
        status,
      },
    }))
  }

  return (
    <CourseContext.Provider
      value={{
        userCourses,
        fetchAllCourses,
        setCourseStatus,
      }}
    >
      {children}
    </CourseContext.Provider>
  )
}
