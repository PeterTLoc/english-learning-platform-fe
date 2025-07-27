"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react"
import { useAuth } from "@/context/AuthContext"
import { getAllUserCourses, UserCourse } from "@/services/userCourseService"

interface UserCourseMap {
  [courseId: string]: UserCourse // ✅ store full backend object
}

interface CourseContextType {
  userCourses: UserCourseMap
  fetchAllCourses: () => Promise<void>
  setCourseStatus: (courseId: string, status: UserCourse["status"]) => void
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
      const userCourseList: UserCourse[] = await getAllUserCourses(user._id)
      const map: UserCourseMap = {}

      for (const uc of userCourseList) {
        map[String(uc.courseId)] = uc
      }

      setUserCourses(map)
    } catch (err) {
      console.error("Failed to fetch user courses", err)
    }
  }, [user?._id])

  useEffect(() => {
    if (!loading && user?._id) {
      fetchAllCourses()
    }
  }, [user?._id, loading, fetchAllCourses])

  const setCourseStatus = (courseId: string, status: UserCourse["status"]) => {
    setUserCourses((prev) => {
      const existing = prev[courseId]
      if (!existing) return prev

      return {
        ...prev,
        [courseId]: {
          ...existing,
          status,
        },
      }
    })
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
