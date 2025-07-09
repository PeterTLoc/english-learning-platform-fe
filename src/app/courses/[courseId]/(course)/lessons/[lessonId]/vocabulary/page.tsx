import VocabularyContent from "@/components/lesson/VocabularyContent"

interface PageProps {
  params: { courseId: string; lessonId: string }
}

export default function Page({ params }: PageProps) {
  return <VocabularyContent courseId={params.courseId} lessonId={params.lessonId} itemsPerPage={1} />
}