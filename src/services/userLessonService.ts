import api from "@/lib/api";
import { Lesson } from "@/types/course/lesson";

export interface LessonTracking {
  type: string;
  length: number;
  currentTime: number;
  completed: boolean;
}

export interface UserLesson {
  _id: string;
  userId: string;
  lessonId: string;
  currentOrder: LessonTracking[];
  status: "not-started" | "ongoing" | "completed";
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
  // Populated fields from aggregation
  lesson?: Lesson;
}

export const getUserLessons = async (userId: string) => {
  const response = await api.get(`/api/user-lessons/${userId}/user`);
  return response.data;
};

export const getUserLessonsByCourseId = async (
  userId: string,
  courseId: string
) => {
  const response = await api.get(
    `/api/user-lessons/${userId}/course/${courseId}`
  );
  return response.data;
};

export const getUserLessonByLessonId = async (lessonId: string) => {
  const response = await api.get(`/api/user-lessons/${lessonId}/lesson`);
  return response.data;
};

export const getUserLessonById = async (
  userLessonId: string
): Promise<UserLesson> => {
  const response = await api.get(`/api/user-lessons/${userLessonId}`);
  return response.data.data;
};

export const createUserLesson = async (data: Partial<UserLesson>) => {
  const response = await api.post("/api/user-lessons", data);
  return response.data;
};

export const updateUserLesson = async (id: string, status: string) => {
  const response = await api.patch(`/api/user-lessons/${id}`, {
    status: status,
  });
  return response.data;
};

export const deleteUserLesson = async (id: string) => {
  const response = await api.delete(`/api/user-lessons/${id}`);
  return response.data;
};
