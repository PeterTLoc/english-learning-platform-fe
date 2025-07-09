import LessonOverview from "@/components/course/CourseContent"

interface PageProps {
  params: { courseId: string; lessonId: string }
}

export default function Page({ params }: PageProps) {
  return (
    <LessonOverview courseId={params.courseId} lessonId={params.lessonId} />
  )
}
