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
import { updateUserCourse } from "@/services/userCourseService"

export default function CourseContent({ courseId }: { courseId: string }) {
  const { user } = useAuth()
  const { userCourses, setCourseStatus } = useCourse()
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
    // Enrollment check
    if (userCourses && Object.keys(userCourses).length > 0) {
      const s = userCourses[courseId]?.status || ""
      if (!["ongoing", "completed"].includes(s)) {
        router.push(`/courses/${courseId}/enroll`)
        return
      }
    }

    setLoading(true)
    let isMounted = true

    const fetchData = async () => {
      try {
        const allLessons = await getAllLessonsByCourseId(courseId)

        // ✅ Compute lesson completion
        const lessonCompletionStatus: Record<string, boolean> = {}
        for (const lesson of allLessons) {
          const allExercises = await getAllExercisesByLessonId(lesson._id)
          if (allExercises.length === 0) {
            lessonCompletionStatus[lesson._id] = false
          } else if (user?._id) {
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

        setLessonCompletion(lessonCompletionStatus)

        // ✅ Collect all tests
        let allTests: any[] = []
        for (const lesson of allLessons) {
          const lessonTests = await getTestsByLessonId(lesson._id)
          if (Array.isArray(lessonTests))
            allTests = allTests.concat(lessonTests)
        }
        const uniqueTests = Array.from(
          new Map(allTests.map((t) => [t._id, t])).values()
        )

        if (isMounted) {
          setLessons(allLessons)
          setTests(uniqueTests)
        }

        // ✅ Fetch user test completion
        let testCompletionStatus: Record<string, boolean> = {}
        if (user?._id && uniqueTests.length > 0) {
          try {
            const response = await getUserTests(user._id)
            const userTests = response.data || []
            uniqueTests.forEach((test) => {
              const userTest = userTests.find(
                (ut: any) => ut.testId === test._id && ut.status === "passed"
              )
              testCompletionStatus[test._id] = !!userTest
            })
          } catch {
            testCompletionStatus = {}
          }
        }
        setTestCompletion(testCompletionStatus)
        setTestCompletionLoading(false)

        // ✅ Check completion
        const allLessonsDone = allLessons.every(
          (l) => lessonCompletionStatus[l._id]
        )
        const allTestsDone =
          uniqueTests.length === 0 ||
          uniqueTests.every((t) => testCompletionStatus[t._id])
        const done = allLessonsDone && allTestsDone

        if (isMounted) setIsCourseCompleted(done)
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

  // ✅ Separate effect: mark course as completed in backend if not yet
  useEffect(() => {
    if (!isCourseCompleted) return

    const uc = userCourses[courseId]

    // ✅ Guard: only update if we have a valid backend _id
    if (!uc || !uc._id || uc.status === "completed") return
    ;(async () => {
      try {
        console.log("✅ Marking course completed in backend...", uc._id)
        await updateUserCourse(uc._id, { status: "completed" })
        setCourseStatus(courseId, "completed")
      } catch (err: any) {
        if (err?.response?.status === 404) {
          // 🔹 Silently skip if backend doesn't recognize this record
          console.warn("⚠️ Skipping backend update, course not found.")
        } else {
          // Only log real errors
          console.error("❌ Failed to mark course completed:", err)
        }
      }
    })()
  }, [isCourseCompleted, userCourses, courseId, setCourseStatus])

  if (!isEnrolled) return null

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 h-full mt-5">
        <LoadingSpinner size="medium" />
        <p className="text-lg">Loading course content...</p>
      </div>
    )
  }

  return (
    <div className="mt-5 flex flex-col gap-4">
      <CourseCompletionStatus isCompleted={isCourseCompleted} loading={false} />

      <h1 className="text-lg">Lessons</h1>
      <LessonList
        lessons={lessons}
        preloadedLessonCompletion={lessonCompletion}
      />

      <h2 className="text-lg">Tests</h2>
      <TestList
        courseId={courseId}
        tests={tests}
        preloadedTestCompletion={testCompletion}
        loading={testCompletionLoading}
      />
    </div>
  )
}
