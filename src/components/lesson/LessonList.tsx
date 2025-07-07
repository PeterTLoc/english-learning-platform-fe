"use client"

import { useEffect, useState } from "react"
import { getAllLessonsByCourseId } from "@/services/lessonService"
import { CheckCircle, ChevronRight } from "lucide-react"
import { parseAxiosError } from "@/utils/apiErrors"
import { Lesson } from "@/types/lesson/lesson"
import { useAuth } from "@/context/AuthContext"
import { getUserExercisesByLessonId } from "@/services/userExerciseService"
import { getAllExercisesByLessonId } from "@/services/lessonService"
import { getTestsByLessonId } from "@/services/testService"
import { getUserTests } from "@/services/userTestService"
import { useRouter } from "next/navigation"

interface LessonListProps {
  courseId: string
  preloadedLessonCompletion?: Record<string, boolean>
  preloadedTestCompletion?: Record<string, boolean>
}

export default function LessonList({ 
  courseId, 
  preloadedLessonCompletion,
  preloadedTestCompletion 
}: LessonListProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [lessonCompletion, setLessonCompletion] = useState<Record<string, boolean>>({})
  const [completionLoading, setCompletionLoading] = useState(!preloadedLessonCompletion)
  const [testCompletion, setTestCompletion] = useState<Record<string, boolean>>({})
  const [testLoading, setTestLoading] = useState(!preloadedTestCompletion)

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const data = await getAllLessonsByCourseId(courseId)
        setLessons(data)
      } catch (error) {
        const parsed = parseAxiosError(error)
        console.error("Failed to fetch lessons:", parsed.message)
        throw new Error(parsed.message)
      } finally {
        setLoading(false)
      }
    }

    fetchLessons()
  }, [courseId])

  // Use preloaded completion data if available
  useEffect(() => {
    if (preloadedLessonCompletion) {
      setLessonCompletion(preloadedLessonCompletion)
      setCompletionLoading(false)
    }
  }, [preloadedLessonCompletion])

  useEffect(() => {
    if (preloadedTestCompletion) {
      setTestCompletion(preloadedTestCompletion)
      setTestLoading(false)
    }
  }, [preloadedTestCompletion])

  // Check completion status for all lessons and course test (only if not preloaded)
  useEffect(() => {
    if (preloadedLessonCompletion && preloadedTestCompletion) {
      return // Skip if we have preloaded data
    }

    const checkCompletion = async () => {
      if (!user?._id || lessons.length === 0) {
        setCompletionLoading(false)
        setTestLoading(false)
        return
      }

      const lessonCompletionStatus: Record<string, boolean> = {}
      let courseTestCompleted = false

      try {
        // Check lesson completion (only if not preloaded)
        if (!preloadedLessonCompletion) {
          for (const lesson of lessons) {
            // Get all exercises for this lesson
            const allExercises = await getAllExercisesByLessonId(lesson._id)

            if (allExercises.length === 0) {
              lessonCompletionStatus[lesson._id] = false
            } else {
              // Get user exercises for this lesson
              const userExercises = await getUserExercisesByLessonId(user._id, lesson._id)

              // Check if all exercises are completed
              const completedExercises = userExercises.filter(
                (userExercise: any) => userExercise.completed
              )

              lessonCompletionStatus[lesson._id] = completedExercises.length === allExercises.length
            }
          }
          setLessonCompletion(lessonCompletionStatus)
        }

        // Check course test completion (only if not preloaded)
        if (!preloadedTestCompletion) {
          try {
            const availableTests = await getTestsByLessonId(lessons[0]._id)
            
            if (availableTests.length === 0) {
              courseTestCompleted = false
            } else {
              // Get user's test attempts
              const response = await getUserTests(user._id)
              const userTests = response.data || []
              
              // Create a map of test IDs that have been passed
              const passedTestIds = new Set()
              userTests.forEach((userTest: any) => {
                if (userTest.status === 'passed') {
                  passedTestIds.add(userTest.testId)
                }
              })
              
              // Check if ALL available tests have been passed
              const allAvailableTestIds = availableTests.map((test: any) => test._id)
              courseTestCompleted = allAvailableTestIds.every(testId => passedTestIds.has(testId))
            }
            setTestCompletion({ course: courseTestCompleted })
          } catch (error) {
            console.error('Failed to check course test completion:', error)
            setTestCompletion({ course: false })
          }
        }
      } catch (error) {
        console.error("Failed to check completion:", error)
      } finally {
        setCompletionLoading(false)
        setTestLoading(false)
      }
    }

    checkCompletion()
  }, [user?._id, lessons, preloadedLessonCompletion, preloadedTestCompletion])

  const handleLessonClick = (lessonId: string) => {
    router.push(`/courses/${courseId}?lesson=${lessonId}`)
  }

  const handleTestClick = () => {
    router.push(`/courses/${courseId}?test=true`)
  }

  if (loading) return <p>Loading lessons...</p>

  return lessons.length === 0 ? (
    <p>No lessons found for this course.</p>
  ) : (
    <ul className="flex flex-col gap-1">
      {/* Lesson Items */}
      {lessons.map((lesson: Lesson) => (
        <li
          key={lesson._id}
          className="px-5 h-[68px] bg-[#2B2B2B] border border-[#1D1D1D] rounded-[5px] flex items-center justify-between hover:bg-[#323232] cursor-pointer transition-colors duration-150"
          onClick={() => handleLessonClick(lesson._id)}
        >
          <div className="flex items-center gap-5">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
              completionLoading 
                ? "bg-[#666666]" 
                : lessonCompletion[lesson._id] 
                  ? "bg-green-500" 
                  : "bg-[#666666]"
            }`}>
              {completionLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#4CC2FF]"></div>
              ) : (
                <CheckCircle size={16} className="text-white" />
              )}
            </div>
            <div>
              <h3 className="font-bold text-sm">{lesson.name}</h3>

              <div className="text-xs subtext flex gap-[10px]">
                {lesson.length.map((item, index) => (
                  <div key={item.for} className="flex items-center gap-1">
                    <p>{item.amount}</p>
                    <p>{item.for}</p>
                    {index !== lesson.length.length - 1 && (
                      <p className="w-[1px] h-3 bg-gray-300 ml-[6px]"></p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <ChevronRight size={20} />
        </li>
      ))}

      {/* Course Test Item */}
      {testCompletion.course !== undefined && (
        <li 
          className="px-5 h-[68px] bg-[#2B2B2B] border border-[#1D1D1D] rounded-[5px] flex items-center justify-between hover:bg-[#323232] cursor-pointer transition-colors duration-150"
          onClick={handleTestClick}
        >
          <div className="flex items-center gap-5">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
              testLoading 
                ? "bg-[#666666]" 
                : testCompletion.course 
                  ? "bg-green-500" 
                  : "bg-[#666666]"
            }`}>
              {testLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#4CC2FF]"></div>
              ) : (
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              )}
            </div>
            <div>
              <h3 className="font-bold text-sm">Course Test</h3>
              <p className="text-xs subtext">Final assessment for the course</p>
            </div>
          </div>

          <ChevronRight size={20} />
        </li>
      )}
    </ul>
  )
}
