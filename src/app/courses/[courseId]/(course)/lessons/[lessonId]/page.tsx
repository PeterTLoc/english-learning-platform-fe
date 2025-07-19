import LessonOverview from "@/components/course/CourseContent";

interface PageProps {
  params: { courseId: string; lessonId: string };
}

export default async function Page({ params }: PageProps) {
  const { courseId, lessonId } = await params;
  return <LessonOverview courseId={courseId} lessonId={lessonId} />;
}
