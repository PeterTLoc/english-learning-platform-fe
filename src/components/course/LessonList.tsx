"use client"

import { useEffect, useState } from "react"
import { getAllLessonsByCourseId } from "@/services/lessonService"
import { CheckCircle, ChevronRight } from "lucide-react"
import { parseAxiosError } from "@/utils/apiErrors"
import { Lesson } from "@/types/lesson/lesson"

export default function LessonList({ courseId }: { courseId: string }) {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const data = await getAllLessonsByCourseId(courseId)
        setLessons(data)
      } catch (error) {
        const parsed = parseAxiosError(error)

        console.error("Login failed:", parsed.message)
        throw new Error(parsed.message)
      } finally {
        setLoading(false)
      }
    }

    fetchLessons()
  }, [courseId])

  if (loading) return <p>Loading lessons...</p>

  return lessons.length === 0 ? (
    <p>No lessons found for this course.</p>
  ) : (
    <ul className="flex flex-col gap-1">
      {lessons.map((lesson: any) => (
        <li
          key={lesson._id}
          className="px-5 h-[68px] bg-[#2B2B2B] border border-[#1D1D1D] rounded-[5px] flex items-center justify-between hover:bg-[#323232]"
        >
          <div className="flex items-center gap-5">
            <CheckCircle size={20} />
            <div>
              <h3 className="font-bold text-sm">{lesson.name}</h3>

              <div className="text-xs subtext flex gap-[10px]">
                {lesson.length.map((item: any, index: number) => (
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
    </ul>
  )
}
