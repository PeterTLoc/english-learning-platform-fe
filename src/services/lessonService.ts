import api from "@/lib/api";
import { Lesson } from "@/types/lesson/lesson";

export const getAllLessonsByCourseId = async (courseId: string): Promise<Lesson[]> => {
  const response = await api.get(`/api/courses/${courseId}/lessons`);
  return response.data.data;
};