import { getCourseById } from "@/services/courseService";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const course = await getCourseById(courseId);

  if (!course) notFound();

  return <>Hi</>;
}
