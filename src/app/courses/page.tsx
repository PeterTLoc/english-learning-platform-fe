"use client"

import Carousel from "@/components/ui/Carousel"
import React from "react"
import CourseCard from "@/components/ui/CourseCard"
import { foundationCourses, listeningCourses, workCourses } from "./data"
import { Course } from "@/types/models/course"

const renderCourseCard = (course: Course) => (
  <CourseCard
    id={course.id}
    title={course.name}
    description={course.description}
    href={`/courses/${course.id}`}
    imageUrl={`https://picsum.photos/seed/${course.id}/400/300`}
    ctaLabel={`${course.totalLessons ?? 0} Lessons`}
  />
)

const Page = () => {
  return (
    <div>
      <Carousel
        title="Foundations"
        items={foundationCourses}
        renderItem={renderCourseCard}
      />
      <Carousel
        title="Work English"
        items={workCourses}
        renderItem={renderCourseCard}
      />
      <Carousel
        title="Listening Practice"
        items={listeningCourses}
        renderItem={renderCourseCard}
      />
    </div>
  )
}

export default Page
