import GrammarContent from "@/components/lesson/GrammarContent"

interface PageProps {
  params: { courseId: string; lessonId: string }
}

export default function Page({ params }: PageProps) {
  return <GrammarContent courseId={params.courseId} lessonId={params.lessonId} itemsPerPage={1} />
}