import api from "@/lib/api";
import { Lesson } from "@/types/course/course";

export const getLessonsByCourseId = async (courseId: string): Promise<Lesson[]> => {
  const response = await api.get(`/api/courses/${courseId}/lessons`);
  return response.data.data;
};
