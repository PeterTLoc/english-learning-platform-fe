"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { getAllLessonsByCourseId } from "@/services/lessonService"
import { getUserExercisesByLessonId } from "@/services/userExerciseService"
import { getAllExercisesByLessonId } from "@/services/lessonService"
import { getTestsByLessonId } from "@/services/testService"
import { getUserTests } from "@/services/userTestService"
import LessonList from "@/components/lesson/LessonList"
import CourseCompletionStatus from "@/components/course/CourseCompletionStatus"
import { Lesson } from "@/types/lesson/lesson"

interface CourseContentProps {
  courseId: string
}

export default function CourseContent({ courseId }: CourseContentProps) {
  const { user } = useAuth()
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [isCourseCompleted, setIsCourseCompleted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [lessonCompletion, setLessonCompletion] = useState<Record<string, boolean>>({})
  const [testCompletion, setTestCompletion] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const checkCourseCompletion = async () => {
      if (!user?._id) {
        setLoading(false)
        return
      }

      try {
        // Get all lessons for this course
        const allLessons = await getAllLessonsByCourseId(courseId)
        setLessons(allLessons)

        if (allLessons.length === 0) {
          setIsCourseCompleted(false)
          setLoading(false)
          return
        }

        // Check lesson completion status
        const lessonCompletionStatus: Record<string, boolean> = {}
        for (const lesson of allLessons) {
          const allExercises = await getAllExercisesByLessonId(lesson._id)
          
          if (allExercises.length === 0) {
            lessonCompletionStatus[lesson._id] = false
          } else {
            const userExercises = await getUserExercisesByLessonId(user._id, lesson._id)
            const completedExercises = userExercises.filter(
              (userExercise: any) => userExercise.completed
            )
            lessonCompletionStatus[lesson._id] = completedExercises.length === allExercises.length
          }
        }
        setLessonCompletion(lessonCompletionStatus)

        // Check if course test is completed (this implies all lessons are completed)
        let courseTestCompleted = false
        try {
          const availableTests = await getTestsByLessonId(allLessons[0]._id)
          
          if (availableTests.length > 0) {
            const response = await getUserTests(user._id)
            const userTests = response.data || []
            
            const passedTestIds = new Set()
            userTests.forEach((userTest: any) => {
              if (userTest.status === 'passed') {
                passedTestIds.add(userTest.testId)
              }
            })
            
            const allAvailableTestIds = availableTests.map((test: any) => test._id)
            courseTestCompleted = allAvailableTestIds.every(testId => passedTestIds.has(testId))
          }
        } catch (error) {
          console.error('Failed to check course test completion:', error)
          courseTestCompleted = false
        }

        setTestCompletion({ course: courseTestCompleted })
        setIsCourseCompleted(courseTestCompleted)
      } catch (error) {
        console.error("Failed to check course completion:", error)
        setIsCourseCompleted(false)
      } finally {
        setLoading(false)
      }
    }

    checkCourseCompletion()
  }, [user?._id, courseId])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4CC2FF] mx-auto mb-4"></div>
          <p className="text-gray-400 text-sm">Loading course content...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <CourseCompletionStatus isCompleted={isCourseCompleted} loading={false} />
      <h2 className="subtitle">Lessons</h2>
      <LessonList 
        courseId={courseId} 
        preloadedLessonCompletion={lessonCompletion}
        preloadedTestCompletion={testCompletion}
      />
    </div>
  )
} 