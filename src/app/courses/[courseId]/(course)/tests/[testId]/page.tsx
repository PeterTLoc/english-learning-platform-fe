import TestContent from "@/components/test/TestContent";

interface PageProps {
  params: { courseId: string; testId: string };
}

export default function Page({ params }: PageProps) {
  return <TestContent courseId={params.courseId} lessonId={params.testId} />;
}