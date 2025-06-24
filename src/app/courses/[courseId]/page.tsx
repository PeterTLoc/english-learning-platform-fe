import { allCourses } from "../data"
import CourseDetail from "./CourseDetail"
import { notFound } from "next/navigation"

export default async function CourseDetailPage({
  params,
}: {
  params: { courseId: string }
}) {
  const course = allCourses.find((c) => c.id === params.courseId)

  if (!course) notFound()

  return <CourseDetail course={course} />
}
