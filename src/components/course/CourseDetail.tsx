"use client"

import LessonContent from "@/components/course/LessonContent"
import LessonSidebar from "@/components/course/LessonSideBar"
import CourseInfoModal from "@/components/course/CourseInfoModal"
import { useEffect, useState } from "react"
import { Course } from "@/types/course/course"
import { getAllLessonsByCourseId } from "@/services/lessonService"
import { parseAxiosError } from "@/utils/apiErrors"
import { Lesson } from "@/types/lesson/lesson"

interface CourseDetailProps {
  course: Course
}

export default function CourseDetail({ course }: CourseDetailProps) {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [openLessonId, setOpenLessonId] = useState<string | null>(null)
  const [activeTabs, setActiveTabs] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false)

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const data = await getAllLessonsByCourseId(course._id)
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
  }, [course._id])

  return (
    <div className="mt-10 flex">
      <LessonSidebar
        lessons={lessons}
        openLessonId={openLessonId}
        activeTabs={activeTabs}
        setOpenLessonId={setOpenLessonId}
        setActiveTabs={setActiveTabs}
      />

      <div className="px-5 flex-1">
        <div className="max-w-[1000px] mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="title">{course.name}</h1>
            <button
              onClick={() => setIsInfoModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              View Course Information
            </button>
          </div>

          <LessonContent
            lessonId={openLessonId}
            tab={openLessonId ? activeTabs[openLessonId] || "Vocabulary" : null}
          />
        </div>
      </div>

      <CourseInfoModal
        course={course}
        lessons={lessons}
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
      />
    </div>
  )
}
