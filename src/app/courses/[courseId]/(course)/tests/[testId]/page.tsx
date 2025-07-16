import TestContent from "@/components/test/TestContent";

interface PageProps {
  params: { courseId: string; testId: string };
}

export default async function Page({ params }: PageProps) {
  const { courseId, testId } = await params;

  return <TestContent courseId={courseId} lessonId={testId} />;
}
