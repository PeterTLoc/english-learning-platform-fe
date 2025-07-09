import ExerciseContent from "@/components/lesson/ExerciseContent"

interface PageProps {
  params: { courseId: string; lessonId: string }
}

export default function Page({ params }: PageProps) {
  return <ExerciseContent courseId={params.courseId} lessonId={params.lessonId} itemsPerPage={1} />
}