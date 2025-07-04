import api from "@/lib/api"
import { Exercise } from "@/types/lesson/exercise"
import { Grammar } from "@/types/lesson/grammar"
import { Lesson } from "@/types/lesson/lesson"
import { Vocabulary } from "@/types/lesson/vocabulary"

export const getAllLessonsByCourseId = async (
  courseId: string
): Promise<Lesson[]> => {
  const response = await api.get(`/api/courses/${courseId}/lessons`)
  return response.data.data
}

export interface PaginatedVocabularyResponse {
  data: Vocabulary[]
  page: number
  total: number
  totalPages: number
}

export const getVocabulariesByLessonId = async (
  lessonId: string,
  page = 1,
  size = 10
): Promise<PaginatedVocabularyResponse> => {
  const response = await api.get(
    `/api/lessons/${lessonId}/vocabularies?page=${page}&size=${size}`
  )
  return response.data
}

export interface PaginatedGrammarResponse {
  data: Grammar[]
  page: number
  total: number
  totalPages: number
}

export const getGrammarsByLessonId = async (
  lessonId: string,
  page = 1,
  size = 10
): Promise<PaginatedGrammarResponse> => {
  const response = await api.get(
    `/api/lessons/${lessonId}/grammars?page=${page}&size=${size}`
  )
  return response.data
}

export const getExercisesByLessonId = async (
  lessonId: string
): Promise<Exercise[]> => {
  const response = await api.get(`/api/exercises/${lessonId}/lesson`)
  return response.data.data
}
