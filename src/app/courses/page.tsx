"use client"

import React, { useEffect, useState } from "react"
import Carousel from "@/components/ui/Carousel"
import CourseCard from "@/components/ui/CourseCard"
import { Course } from "@/types/course/course"
import { getAllCourses } from "@/services/courseService"
import LoadingSpinner from "@/components/ui/LoadingSpinner"

const renderCourseCard = (course: Course) => (
  <CourseCard
    id={course._id}
    title={course.name}
    description={course.description}
    href={`/courses/${course._id}/enroll`}
    imageUrl={
      course.coverImage || `https://picsum.photos/seed/${course._id}/400/300`
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
        const data = await getAllCourses()
        setCourses(data)
      } catch (error) {
        console.error("Error fetching courses", error)
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
    <div className="flex flex-col gap-[27px]">
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
