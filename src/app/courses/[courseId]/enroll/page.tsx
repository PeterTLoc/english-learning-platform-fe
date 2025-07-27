import { getCourseById } from "@/services/courseService"
import { notFound } from "next/navigation"
import EnrollButton from "@/components/course/enroll/EnrollButton"
import CourseContent from "@/components/course/enroll/CourseOverview"
import { BookOpen, Target } from "lucide-react"

export default async function Page({
  params,
}: {
  params: Promise<{ courseId: string }>
}) {
  const { courseId } = await params
  const course = await getCourseById(courseId)
  if (!course) notFound()

  return (
    <div>
      {/* Background Section */}
      <div className="relative overflow-hidden">
        {/* Blurred Cover Image */}
        <div
          className="absolute inset-0 bg-cover bg-center scale-110 filter blur-2xl"
          style={{ backgroundImage: `url(${course.coverImage})` }}
        />

        {/* Darker Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/70 to-[#151515]" />

        {/* Decorative Glows */}
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-[#0094FF]/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#0063B1]/10 rounded-full blur-3xl" />

        {/* Main Content */}
        <div className="relative z-20 pt-[100px] pb-16 px-6">
          <div className="max-w-[1000px] mx-auto flex flex-col text-white">
            <h1 className="font-bold text-[32px] tracking-tight mb-2">
              {course.name}
            </h1>

            {/* Info Badges */}
            <div className="flex gap-3 text-sm mb-3">
              <span className="flex items-center gap-2 px-3 py-2 rounded-md bg-gradient-to-r from-[#084c75] to-[#0d5e8c] text-white shadow-md">
                <Target className="w-4 h-4 text-[#4FC3F7]" />
                Level {course.level}
              </span>
              <span className="flex items-center gap-2 px-3 py-2 rounded-md bg-gradient-to-r from-[#355a17] to-[#4d6b1a] text-white shadow-md">
                <BookOpen className="w-4 h-4 text-[#A3E635]" />
                {course.totalLessons} Lessons
              </span>
            </div>

            <p className="mb-5 text-base text-white/90 leading-relaxed max-w-[800px]">
              {course.description}
            </p>

            <div>
              <EnrollButton courseId={course._id} />
            </div>
          </div>
        </div>

        {/* Stop gradient at the very bottom */}
        <div className="absolute bottom-0 w-full h-12 bg-gradient-to-b from-transparent to-[#202020]" />
      </div>

      {/* Separate Section Below Gradient */}
      <div className="px-5">
        <div className="max-w-[1000px] mx-auto mb-16">
          <CourseContent courseId={course._id} />
        </div>
      </div>
    </div>
  )
}
