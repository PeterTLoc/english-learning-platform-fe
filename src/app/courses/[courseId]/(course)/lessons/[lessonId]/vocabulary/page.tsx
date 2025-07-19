import VocabularyContent from "@/components/lesson/VocabularyContent";

interface PageProps {
  params: { courseId: string; lessonId: string };
}

export default async function Page({ params }: PageProps) {
  const { courseId, lessonId } = await params;
  return (
    <VocabularyContent
      courseId={courseId}
      lessonId={lessonId}
      itemsPerPage={1}
    />
  );
}
