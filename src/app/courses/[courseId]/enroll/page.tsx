import { getCourseById } from "@/services/courseService"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"

export default async function page({
  params,
}: {
  params: { courseId: string }
}) {
  const course = await getCourseById(params.courseId)

  if (!course) notFound()

  return (
    <div className="px-5">
      <div className="w-[1000px] mx-auto">
        <h1 className="font-bold text-[25px] mt-[9px] mb-2">{course.name}</h1>

        <div className="flex text-sm gap-1 mb-2">
          <p className="px-2 py-1 bg-[#2B2B2B] border border-[#1D1D1D] rounded-[5px]">
            Level {course.level}
          </p>
          <p className="px-2 py-1 bg-[#2B2B2B] border border-[#1D1D1D] rounded-[5px]">
            Lessons {course.totalLessons}
          </p>
        </div>

        <p className="subtext text-sm mb-2">{course.description}</p>

        <div>
          <Link
            href={`/courses/${course._id}`}
            className="button-blue font-bold flex items-center text-black"
          >
            Enroll
          </Link>
        </div>
      </div>
    </div>
  )
}
