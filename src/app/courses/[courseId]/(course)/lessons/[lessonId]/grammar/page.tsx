import GrammarContent from "@/components/lesson/GrammarContent";

interface PageProps {
  params: { courseId: string; lessonId: string };
}

export default async function Page({ params }: PageProps) {
  const { courseId, lessonId } = await params;
  return (
    <GrammarContent courseId={courseId} lessonId={lessonId} itemsPerPage={1} />
  );
}
