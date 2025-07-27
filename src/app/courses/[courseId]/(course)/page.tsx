import { getCourseById } from "@/services/courseService"
import { notFound } from "next/navigation"

export default async function Page({
  params,
}: {
  params: { courseId: string }
}) {
  const { courseId } = params
  const course = await getCourseById(courseId)

  if (!course) notFound()

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-84px)] text-center p-6">
      <h1 className="text-3xl font-bold mb-3">🤔 Oops, you&apos;re not supposed to be here!</h1>
      <p className="text-gray-400 mb-4 max-w-md">
        You&apos;re looking at <span className="font-semibold">{course.name}</span>, 
        but there&apos;s no lesson selected.
      </p>
      <p className="text-gray-500 mb-6">
        👉 Pick a lesson from the course to get started.
      </p>
    </div>
  )
}
