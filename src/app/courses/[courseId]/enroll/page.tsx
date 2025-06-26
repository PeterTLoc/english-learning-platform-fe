import { getCourseById } from "@/services/courseService"
import { notFound } from "next/navigation"
import EnrollButton from "@/components/course/EnrollButton"
import LessonList from "@/components/course/LessonList"

export default async function page({
  params,
}: {
  params: { courseId: string }
}) {
  const course = await getCourseById(params.courseId)
  if (!course) notFound()

  return (
    <div>
      {/* Gradient Background Section */}
      <div className="relative">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0063B1] to-[#202020] z-0" />

        {/* Main Content */}
        <div className="relative z-20 px-5 pt-[86px] pb-10">
          <div className="max-w-[1000px] mx-auto">
            <h1 className="font-bold text-3xl mb-4">{course.name}</h1>

            <div className="flex text-sm gap-1">
              <p className="px-2 py-1 bg-[#2B2B2B] border border-[#1D1D1D] rounded-[5px]">
                Level {course.level}
              </p>
              <p className="px-2 py-1 bg-[#2B2B2B] border border-[#1D1D1D] rounded-[5px]">
                Lessons {course.totalLessons}
              </p>
            </div>

            <p className="text-sm mt-8 mb-[14px]">
              {course.description}
            </p>

            <div>
              <EnrollButton courseId={course._id} />
            </div>
          </div>
        </div>
      </div>

      {/* Separate Section Below Gradient */}
      <div className="px-5">
        <div className="max-w-[1000px] mx-auto mb-16">
          <h2 className="subtitle">Lessons</h2>
          <LessonList courseId={course._id} />
        </div>
      </div>
    </div>
  )
}
