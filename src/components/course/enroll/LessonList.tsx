"use client"

import { useEffect, useState } from "react"
import { getAllLessonsByCourseId } from "@/services/lessonService"
import { CheckCircle, ChevronRight, BookOpen, FileText } from "lucide-react"
import { parseAxiosError } from "@/utils/apiErrors"
import { Lesson } from "@/types/lesson/lesson"
import { useAuth } from "@/context/AuthContext"
import { getUserExercisesByLessonId } from "@/services/userExerciseService"
import { getAllExercisesByLessonId } from "@/services/lessonService"
import { getTestsByLessonId } from "@/services/testService"
import { getUserTests } from "@/services/userTestService"
import { useRouter } from "next/navigation"

interface LessonListProps {
  lessons: Lesson[]
  preloadedLessonCompletion?: Record<string, boolean>
}

export default function LessonList({ 
  lessons, 
  preloadedLessonCompletion 
}: LessonListProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [lessonCompletion, setLessonCompletion] = useState<Record<string, boolean>>({})
  const [completionLoading, setCompletionLoading] = useState(!preloadedLessonCompletion)

  // Use preloaded completion data if available
  useEffect(() => {
    if (preloadedLessonCompletion) {
      setLessonCompletion(preloadedLessonCompletion)
      setCompletionLoading(false)
    }
  }, [preloadedLessonCompletion])

  // Check completion status for all lessons (only if not preloaded)
  useEffect(() => {
    if (preloadedLessonCompletion) {
      return // Skip if we have preloaded data
    }

    const checkCompletion = async () => {
      if (!user?._id || lessons.length === 0) {
        setCompletionLoading(false)
        return
      }

      const lessonCompletionStatus: Record<string, boolean> = {}

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
      } catch (error) {
        console.error("Failed to check completion:", error)
      } finally {
        setCompletionLoading(false)
      }
    }

    checkCompletion()
  }, [user?._id, lessons, preloadedLessonCompletion])

  const handleLessonClick = (lessonId: string) => {
    router.push(`/courses/${lessons[0]?.courseId || ""}/lessons/${lessonId}`)
  }

  return lessons.length === 0 ? (
    <p className="container text-md text-center subtext">No lessons found for this course.</p>
  ) : (
    <ul className="flex flex-col gap-2">
      {/* Lesson Items */}
      {lessons.map((lesson: Lesson) => (
        <li
          key={lesson._id}
          className="px-5 h-[68px] bg-[#2B2B2B] border border-[#1D1D1D] rounded-[5px] flex items-center justify-between hover:bg-[#323232] cursor-pointer transition-colors duration-150"
          onClick={() => handleLessonClick(lesson._id)}
        >
          <div className="flex items-center gap-5">
            <BookOpen size={20} className="text-white" />
            <div>
              <h3 className="text-md">{lesson.name}</h3>

              <div className="text-sm subtext flex gap-[10px]">
                {lesson.length.map((item, index) => (
                  <div key={item.for} className="flex items-center gap-1">
                    <p>{item.amount}</p>
                    <p>{item.for}</p>
                    {index !== lesson.length.length - 1 && (
                      <p className="w-[1px] h-3 bg-[#AAAAAA] ml-[6px]"></p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {lessonCompletion[lesson._id] && (
              <span
                className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                style={{ background: "rgba(34,197,94,0.12)" }}
              >
                <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                Completed
              </span>
            )}
            <ChevronRight size={20} />
          </div>
        </li>
      ))}
    </ul>
  )
}
