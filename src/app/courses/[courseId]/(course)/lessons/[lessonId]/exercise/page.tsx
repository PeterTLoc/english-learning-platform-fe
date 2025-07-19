import ExerciseContent from "@/components/lesson/ExerciseContent";

interface PageProps {
  params: { courseId: string; lessonId: string };
}

export default async function Page({ params }: PageProps) {
  const { courseId, lessonId } = await params;
  return (
    <ExerciseContent courseId={courseId} lessonId={lessonId} itemsPerPage={1} />
  );
}
