"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { getAllLessonsByCourseId } from "@/services/lessonService"
import { getUserExercisesByLessonId } from "@/services/userExerciseService"
import { getAllExercisesByLessonId } from "@/services/lessonService"
import { getTestsByLessonId } from "@/services/testService"
import { getUserTests } from "@/services/userTestService"
import LessonList from "@/components/course/enroll/LessonList"
import CourseCompletionStatus from "@/components/course/enroll/CourseCompletionBanner"
import TestList from "@/components/course/enroll/TestList"
import LoadingSpinner from "@/components/ui/LoadingSpinner"
import { Lesson } from "@/types/lesson/lesson"
import { useCourse } from "@/context/CourseContext"
import { useRouter } from "next/navigation"

interface CourseContentProps {
  courseId: string
}

export default function CourseContent({ courseId }: CourseContentProps) {
  const { user } = useAuth()
  const { userCourses } = useCourse()
  const router = useRouter()
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [tests, setTests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isCourseCompleted, setIsCourseCompleted] = useState(false)
  const [lessonCompletion, setLessonCompletion] = useState<
    Record<string, boolean>
  >({})
  const [testCompletion, setTestCompletion] = useState<Record<string, boolean>>(
    {}
  )
  const [testCompletionLoading, setTestCompletionLoading] = useState(true)

  const status = userCourses[courseId]?.status || ""
  const isEnrolled = ["ongoing", "completed"].includes(status)

  useEffect(() => {
    // Enrollment check and redirect
    if (userCourses && Object.keys(userCourses).length > 0) {
      const status = userCourses[courseId]?.status || ""
      const isEnrolled = ["ongoing", "completed"].includes(status)
      if (!isEnrolled) {
        router.push(`/courses/${courseId}/enroll`)
        return
      }
    }
    setLoading(true)
    let isMounted = true
    const fetchData = async () => {
      try {
        // Fetch lessons
        const allLessons = await getAllLessonsByCourseId(courseId)
        // Calculate lesson completion
        const lessonCompletionStatus: Record<string, boolean> = {}
        for (const lesson of allLessons) {
          const allExercises = await getAllExercisesByLessonId(lesson._id)
          if (allExercises.length === 0) {
            lessonCompletionStatus[lesson._id] = false
          } else {
            if (user && user._id) {
              const userExercises = await getUserExercisesByLessonId(
                user._id,
                lesson._id
              )
              const completedExercises = userExercises.filter(
                (e: any) => e.completed
              )
              lessonCompletionStatus[lesson._id] =
                completedExercises.length === allExercises.length
            } else {
              lessonCompletionStatus[lesson._id] = false
            }
          }
        }
        setLessonCompletion(lessonCompletionStatus)
        // Fetch all tests for all lessons
        let allTests: any[] = []
        for (const lesson of allLessons) {
          const lessonTests = await getTestsByLessonId(lesson._id)
          if (Array.isArray(lessonTests)) {
            allTests = allTests.concat(lessonTests)
          }
        }
        // Deduplicate by _id
        const uniqueTests = Array.from(
          new Map(allTests.map((test) => [test._id, test])).values()
        )
        if (isMounted) {
          setLessons(allLessons)
          setTests(uniqueTests)
        }
        // Fetch user test completion
        setTestCompletionLoading(true)
        if (user && user._id && uniqueTests.length > 0) {
          try {
            const response = await getUserTests(user._id)
            const userTests = response.data || []
            const completion: Record<string, boolean> = {}
            uniqueTests.forEach((test) => {
              const userTest = userTests.find(
                (ut: any) => ut.testId === test._id && ut.status === "passed"
              )
              completion[test._id] = !!userTest
            })
            setTestCompletion(completion)
          } catch {
            setTestCompletion({})
          } finally {
            setTestCompletionLoading(false)
          }
        } else {
          setTestCompletion({})
          setTestCompletionLoading(false)
        }
      } catch (error) {
        if (isMounted) {
          setLessons([])
          setTests([])
          setLessonCompletion({})
          setTestCompletion({})
          setTestCompletionLoading(false)
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    fetchData()
    return () => {
      isMounted = false
    }
  }, [user?._id, courseId, userCourses, router])

  // Only render null after all hooks
  if (!isEnrolled) return null

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <LoadingSpinner size="medium" />
      </div>
    )
  }

  return (
    <div className="mt-5">
      <CourseCompletionStatus isCompleted={isCourseCompleted} loading={false} />

      <h2 className="subtitle">Lessons</h2>
      <LessonList
        lessons={lessons}
        preloadedLessonCompletion={lessonCompletion}
      />

      <h2 className="subtitle">Tests</h2>
      <TestList
        courseId={courseId}
        tests={tests}
        preloadedTestCompletion={testCompletion}
        loading={testCompletionLoading}
      />
    </div>
  )
}
