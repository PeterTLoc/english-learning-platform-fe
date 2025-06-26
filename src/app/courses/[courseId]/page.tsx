import { getCourseById } from "@/services/courseService"
import CourseDetail from "../../../components/course/CourseDetail"
import { notFound } from "next/navigation"

export default async function Page({
  params,
}: {
  params: { courseId: string }
}) {
  const course = await getCourseById(params.courseId)

  if (!course) notFound()

  return <CourseDetail course={course} />
}
