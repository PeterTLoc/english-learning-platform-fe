import api from "@/lib/api"
import { Exercise } from "@/types/lesson/exercise"
import { Grammar } from "@/types/lesson/grammar"
import { Lesson } from "@/types/lesson/lesson"
import { Vocabulary } from "@/types/lesson/vocabulary"
import { Test } from "@/types/course/test"
import { IExercise } from "@/types/models/IExercise"

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

interface CreateLessonData {
  courseId: string
  name: string
  description: string
}

// Lesson CRUD operations
export const getAllLessons = async (): Promise<Lesson[]> => {
  const response = await api.get("/api/lessons")
  return response.data.data
}

export const getLessonById = async (lessonId: string): Promise<Lesson> => {
  const response = await api.get(`/api/lessons/${lessonId}`)
  return response.data.lesson
}

export const createLesson = async (lessonData: FormData): Promise<Lesson> => {
  // Convert FormData to proper object
  const data: CreateLessonData = {
    courseId: lessonData.get("courseId") as string,
    name: lessonData.get("name") as string,
    description: lessonData.get("description") as string,
  }

  const response = await api.post("/api/lessons", data)
  return response.data.lesson
}

export const updateLesson = async (
  lessonId: string,
  lessonData: FormData
): Promise<Lesson> => {
  const response = await api.patch(`/api/lessons/${lessonId}`, lessonData)
  return response.data.lesson
}

export const deleteLesson = async (lessonId: string): Promise<void> => {
  await api.delete(`/api/lessons/${lessonId}`)
}

// Test CRUD operations
export const getTestsByLessonId = async (lessonId: string): Promise<Test[]> => {
  const response = await api.get(`/api/tests/lesson/${lessonId}`)
  return response.data.tests
}

export const getTestById = async (testId: string): Promise<Test> => {
  const response = await api.get(`/api/tests/${testId}`)
  return response.data.test
}

export const createTest = async (testData: FormData): Promise<Test> => {
  // Convert FormData to regular object
  const formDataObj = Object.fromEntries(testData.entries())

  // Create the data object with proper types
  const data = {
    name: formDataObj.name as string,
    description: formDataObj.description as string,
    totalQuestions: Number(formDataObj.totalQuestions),
    courseId: formDataObj.courseId as string,
    lessonIds: formDataObj.lessonIds
      ? JSON.parse(formDataObj.lessonIds as string)
      : [],
  }

  const response = await api.post("/api/tests", data)
  return response.data.test
}

export const updateTest = async (
  testId: string,
  testData: FormData
): Promise<Test> => {
  const response = await api.patch(`/api/tests/${testId}`, testData)
  return response.data.test
}

export const deleteTest = async (testId: string): Promise<void> => {
  await api.delete(`/api/tests/${testId}`)
}

// Exercise CRUD operations
export interface PaginatedExercisesResponse {
  data: IExercise[]
  total: number
  page: number
  totalPages: number
  message: string
}

export const getExercisesByLessonId = async (
  lessonId: string,
  page = 1,
  size = 10
): Promise<PaginatedExercisesResponse> => {
  const response = await api.get(
    `/api/exercises/${lessonId}/lesson?page=${page}&size=${size}`
  )
  return response.data
}

export const getAllExercisesByLessonId = async (
  lessonId: string
): Promise<IExercise[]> => {
  // Use a very large size to get all exercises in one request
  const response = await api.get(
    `/api/exercises/${lessonId}/lesson?page=1&size=1000`
  )
  return response.data.data
}

export const getExerciseById = async (
  exerciseId: string
): Promise<IExercise> => {
  const response = await api.get(`/api/exercises/${exerciseId}`)
  return response.data.exercise
}

export const createExercise = async (
  exerciseData: FormData
): Promise<IExercise> => {
  const response = await api.post("/api/exercises", exerciseData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
  return response.data.exercise
}

export const updateExercise = async (
  exerciseId: string,
  exerciseData: FormData
): Promise<IExercise> => {
  const response = await api.patch(
    `/api/exercises/${exerciseId}`,
    exerciseData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  )
  return response.data.exercise
}

export const deleteExercise = async (exerciseId: string): Promise<void> => {
  await api.delete(`/api/exercises/${exerciseId}`)
}
