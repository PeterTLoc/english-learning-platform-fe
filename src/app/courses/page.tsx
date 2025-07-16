"use client"

import React, { useEffect, useState } from "react"
import Carousel from "@/components/ui/Carousel"
import CourseCard from "@/components/course/CourseCard"
import { Course } from "@/types/course/course"
import { getAllCourses } from "@/services/courseService"
import LoadingSpinner from "@/components/ui/LoadingSpinner"
import { parseAxiosError } from "@/utils/apiErrors"

const renderCourseCard = (course: Course) => (
  <CourseCard
    id={course._id}
    title={course.name}
    description={course.description}
    href={`/courses/${course._id}/enroll`}
    imageUrl={
      course.coverImage ||
      `https://www.aesence.com/wp-content/uploads/2022/08/white-kenyahara-aesence.jpg`
    }
    ctaLabel={`${course.totalLessons ?? 0} Lessons`}
  />
)

const page = () => {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const  { data: courseList } = await getAllCourses({})
        setCourses(courseList)
      } catch (error) {
        const parsed = parseAxiosError(error)

        console.error("Login failed:", parsed.message)
        throw new Error(parsed.message)
      } finally {
        setLoading(false)
      }
    }

    loadCourses()
  }, [])

  if (loading) return <LoadingSpinner fullScreen />

  const coursesByLevel = courses.reduce<Record<string, Course[]>>(
    (acc, course) => {
      const level = course.level || "Unknown"
      if (!acc[level]) acc[level] = []
      acc[level].push(course)
      return acc
    },
    {}
  )

  return (
    <div className="flex flex-col">
      {Object.entries(coursesByLevel).map(([level, levelCourses]) => (
        <Carousel
          key={level}
          title={`Level ${level}`}
          items={levelCourses}
          renderItem={renderCourseCard}
          itemKey={(course) => course._id}
        />
      ))}
    </div>
  )
}

export default page
