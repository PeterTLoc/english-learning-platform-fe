"use client"

import LessonContent from "@/components/course/LessonContent"
import LessonSidebar from "@/components/course/LessonSideBar"
import { useState } from "react"
import { Course } from "@/types/models/course"

interface Lesson {
  id: string
  title: string
}

interface CourseDetailProps {
  course: Course
}

export default function CourseDetail({ course }: CourseDetailProps) {
  const [openLessonId, setOpenLessonId] = useState<string | null>(null)
  const [activeTabs, setActiveTabs] = useState<Record<string, string>>({})

  const lessons: Lesson[] = [
    { id: "lesson-1", title: "Lesson 1: Basics" },
    { id: "lesson-2", title: "Lesson 2: Greetings" },
    { id: "lesson-3", title: "Lesson 3: Numbers" },
  ] // Fallback hardcoded lessons if needed

  return (
    <div className="flex">
      <LessonSidebar
        lessons={lessons}
        openLessonId={openLessonId}
        activeTabs={activeTabs}
        setOpenLessonId={setOpenLessonId}
        setActiveTabs={setActiveTabs}
      />

      <div className="px-5 flex-1">
        <div className="w-[1000px] mx-auto">
          <h1 className="title">{course.name}</h1>

          <LessonContent
            lessonId={openLessonId}
            tab={openLessonId ? activeTabs[openLessonId] || "Vocabulary" : null}
          />
        </div>
      </div>
    </div>
  )
}
