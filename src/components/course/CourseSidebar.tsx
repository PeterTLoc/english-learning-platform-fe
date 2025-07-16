"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { getAllLessonsByCourseId } from "@/services/lessonService"
import { getTestsByLessonId } from "@/services/testService"
import { motion } from "framer-motion"
import { BookOpen, CheckCircle } from "lucide-react"
import { Lesson } from "@/types/lesson/lesson"
import { Test } from "@/types/course/test"
import LoadingSpinner from "@/components/ui/LoadingSpinner"
import { useAuth } from "@/context/AuthContext"
import { getUserLessonByLessonId } from "@/services/userLessonService"
import { useSidebarRefresh } from "@/context/SidebarRefreshContext"
import { getUserTests } from "@/services/userTestService"

// Accept courseId as a prop
interface CourseSidebarProps {
  courseId: string
}

const CourseSidebar: React.FC<CourseSidebarProps> = ({ courseId }) => {
  const pathname = usePathname()
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [tests, setTests] = useState<Test[]>([])
  const [loadingLessons, setLoadingLessons] = useState(true)
  const [loadingTests, setLoadingTests] = useState(true)
  const [lessonCompletion, setLessonCompletion] = useState<
    Record<string, boolean>
  >({})
  const [loadingCompletion, setLoadingCompletion] = useState(true)
  const [testCompletion, setTestCompletion] = useState<Record<string, boolean>>({})
  const { user } = useAuth()
  const { refreshKey } = useSidebarRefresh()

  useEffect(() => {
    const fetchLessons = async () => {
      setLoadingLessons(true)
      try {
        const data = await getAllLessonsByCourseId(courseId)
        setLessons(data)
      } catch (error) {
        setLessons([])
      } finally {
        setLoadingLessons(false)
      }
    }
    fetchLessons()
  }, [courseId])

  useEffect(() => {
    const fetchAllTests = async () => {
      setLoadingTests(true)
      try {
        // Fetch tests for each lesson and flatten
        const allTests: Test[] = []
        for (const lesson of lessons) {
          const lessonTests = await getTestsByLessonId(lesson._id)
          console.log(lessonTests)
          if (Array.isArray(lessonTests)) {
            allTests.push(...lessonTests)
          }
        }
        // Deduplicate tests by _id
        const uniqueTests = Array.from(
          new Map(allTests.map((test) => [test._id, test])).values()
        )
        setTests(uniqueTests)
      } catch (error) {
        setTests([])
      } finally {
        setLoadingTests(false)
      }
    }
    if (lessons.length > 0) {
      fetchAllTests()
    } else {
      setTests([])
      setLoadingTests(false)
    }
  }, [lessons])

  useEffect(() => {
    const fetchCompletion = async () => {
      setLoadingCompletion(true)
      if (!user?._id || lessons.length === 0) {
        setLessonCompletion({})
        setLoadingCompletion(false)
        return
      }
      const completion: Record<string, boolean> = {}
      await Promise.all(
        lessons.map(async (lesson) => {
          try {
            const res = await getUserLessonByLessonId(lesson._id)
            completion[lesson._id] = res.userLesson.status === "completed"
          } catch {
            completion[lesson._id] = false
          }
        })
      )
      setLessonCompletion(completion)
      setLoadingCompletion(false)
    }
    fetchCompletion()
  }, [user?._id, lessons, refreshKey])

  useEffect(() => {
    const fetchTestCompletion = async () => {
      if (!user?._id || tests.length === 0) {
        setTestCompletion({})
        return
      }
      try {
        const response = await getUserTests(user._id)
        const userTests = response.data || []
        const completion: Record<string, boolean> = {}
        tests.forEach((test) => {
          const userTest = userTests.find((ut: any) => ut.testId === test._id && ut.status === "passed")
          completion[test._id] = !!userTest
        })
        setTestCompletion(completion)
      } catch {
        setTestCompletion({})
      }
    }
    fetchTestCompletion()
  }, [user?._id, tests])

  return (
    <nav>
      {/* Lessons Section */}
      <div className="mb-4">
        <div className="text-[#AAAAAA] text-lg mb-2">Lessons</div>
        {loadingLessons || loadingCompletion ? (
          <div className="flex flex-col items-center justify-center gap-2 h-full">
            <LoadingSpinner size="small" />
            <p className="text-md">Loading lesson list...</p>
          </div>
        ) : lessons.length === 0 ? (
          <span className="text-gray-400 text-lg">No lessons found.</span>
        ) : (
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="flex flex-col gap-3">
              {lessons.map((lesson) => {
                const href = `/courses/${courseId}/lessons/${lesson._id}`
                const isActive = pathname.startsWith(href)
                const isCompleted = lessonCompletion[lesson._id]
                return (
                  <li key={lesson._id} className="list-none">
                    <Link href={href} className="block">
                      <div
                        className={`relative flex items-center group w-full text-md px-3 gap-3 rounded transition-colors duration-150 cursor-pointer`}
                        style={{
                          background: isActive ? "#2D2D2D" : undefined,
                          minHeight: 50,
                          height: 50,
                        }}
                        onMouseOver={(e) =>
                          (e.currentTarget.style.background = "#2D2D2D")
                        }
                        onMouseOut={(e) =>
                          (e.currentTarget.style.background = isActive
                            ? "#2D2D2D"
                            : "")
                        }
                      >
                        {isActive && (
                          <motion.div
                            layoutId="sidebar-active-bar"
                            className="absolute left-0 top-0 h-full rounded-r"
                            style={{
                              width: 3,
                              minWidth: 3,
                              background: "#4CC2FF",
                            }}
                            transition={{
                              type: "spring",
                              stiffness: 500,
                              damping: 40,
                            }}
                          />
                        )}
                        <span
                          className="flex items-center justify-center"
                          style={{ width: 20, height: 20 }}
                        >
                          <BookOpen size={20} />
                        </span>
                        <span>{lesson.name}</span>
                        {isCompleted ? (
                          <span className="ml-auto inline-block w-2 h-2 rounded-full bg-green-500"></span>
                        ) : (
                          <span className="ml-auto inline-block w-2 h-2 rounded-full bg-[#AAAAAA]"></span>
                        )}
                      </div>
                    </Link>
                  </li>
                )
              })}
            </div>
          </motion.div>
        )}
      </div>
      {/* Tests Section */}
      <div>
        <div className="text-lg text-[#AAAAAA] mb-2">Tests</div>
        {loadingLessons || loadingTests ? (
          <div className="flex flex-col items-center justify-center gap-2 h-full">
            <LoadingSpinner size="small" />
            <p className="text-md">Loading test list...</p>
          </div>
        ) : tests.length === 0 ? (
          <span className="text-gray-400 text-lg mb-2">No tests found.</span>
        ) : (
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="flex flex-col gap-1">
              {tests.map((test) => {
                const href = `/courses/${courseId}/tests/${test._id}`
                const isActive = pathname.startsWith(href)
                const isPassed = testCompletion[test._id]
                return (
                  <li key={test._id} className="list-none">
                    <Link href={href} className="block">
                      <div
                        className={`relative flex items-center group w-full text-md px-3 gap-3 rounded transition-colors duration-150 cursor-pointer`}
                        style={{
                          background: isActive ? "#2D2D2D" : undefined,
                          minHeight: 50,
                          height: 50,
                        }}
                        onMouseOver={(e) =>
                          (e.currentTarget.style.background = "#2D2D2D")
                        }
                        onMouseOut={(e) =>
                          (e.currentTarget.style.background = isActive
                            ? "#2D2D2D"
                            : "")
                        }
                      >
                        {isActive && (
                          <motion.div
                            layoutId="sidebar-active-bar"
                            className="absolute left-0 top-0 h-full rounded-r"
                            style={{
                              width: 3,
                              minWidth: 3,
                              background: "#4CC2FF",
                            }}
                            transition={{
                              type: "spring",
                              stiffness: 500,
                              damping: 40,
                            }}
                          />
                        )}
                        <span
                          className="flex items-center justify-center"
                          style={{ width: 20, height: 20 }}
                        >
                          <CheckCircle size={20} />
                        </span>
                        <span>{test.name}</span>
                        {isPassed ? (
                          <span className="ml-auto inline-block w-2 h-2 rounded-full bg-green-500"></span>
                        ) : (
                          <span className="ml-auto inline-block w-2 h-2 rounded-full bg-[#AAAAAA]"></span>
                        )}
                      </div>
                    </Link>
                  </li>
                )
              })}
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  )
}

export default CourseSidebar
