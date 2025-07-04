"use client"

import LessonContent from "@/components/course/LessonContent"
import LessonSidebar from "@/components/course/LessonSideBar"
import { useEffect, useState } from "react"
import { Course } from "@/types/course/course"
import { getAllLessonsByCourseId } from "@/services/lessonService"
import { parseAxiosError } from "@/utils/apiErrors"
import { Lesson } from "@/types/lesson/lesson"

interface CourseDetailProps {
  course: Course
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function CourseDetail({ course }: CourseDetailProps) {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [openLessonId, setOpenLessonId] = useState<string | null>(null)
  const [activeTabs, setActiveTabs] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const data = await getAllLessonsByCourseId(course._id)
        setLessons(data)

        if (data.length > 0 && !openLessonId) {
          const defaultLesson = data[0]

          const firstAvailableType =
            defaultLesson.length?.[0]?.for || "Vocabulary"

          setOpenLessonId(data[0]._id)
          setActiveTabs((prev) => ({
            ...prev,
            [defaultLesson._id]: capitalize(firstAvailableType),
          }))
        }
      } catch (error) {
        const parsed = parseAxiosError(error)

        console.error("Login failed:", parsed.message)
        throw new Error(parsed.message)
      } finally {
        setLoading(false)
      }
    }

    fetchLessons()
  }, [course._id])

  return (
    <div className="mt-5 flex">
      <LessonSidebar
        lessons={lessons}
        openLessonId={openLessonId}
        activeTabs={activeTabs}
        setOpenLessonId={setOpenLessonId}
        setActiveTabs={setActiveTabs}
      />

      <div className="px-5 flex-1">
        <div className="max-w-[1000px] mx-auto">
          <LessonContent
            lesson={lessons.find((l) => l._id === openLessonId) || null}
            tab={openLessonId ? activeTabs[openLessonId] || "Vocabulary" : null}
          />
        </div>
      </div>
    </div>
  )
}
