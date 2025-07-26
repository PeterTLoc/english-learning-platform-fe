import api from "@/lib/api"
import { Test } from "@/types/course/test"

export interface TestSubmission {
  testId: string
  userId: string
  answers: Array<{
    exerciseId: string
    selectedAnswers: string[]
  }>
}

export interface TestResult {
  exerciseId: string
  selectedAnswers: string[]
  correctAnswers: string[]
  isCorrect: boolean
}

export interface TestSubmissionResponse {
  id: string
  userId: string
  testId: string
  attemptNo: number
  score: number
  status: 'passed' | 'failed'
  description: string
  submittedAt: string
  results: TestResult[]
}

export const getTestsByLessonId = async (lessonId: string): Promise<Test[]> => {
  try {
    const response = await api.get(`/api/tests/lesson/${lessonId}`)
    return response.data.data || []
  } catch (error) {
    console.error("Error in getTestsByLessonId:", error)
    throw error
  }
}

export const getTestById = async (testId: string): Promise<Test> => {
  try {
    const response = await api.get(`/api/tests/${testId}?_t=${Date.now()}`)
    return response.data.test
  } catch (error) {
    console.error("Error in getTestById:", error)
    throw error
  }
}

export const submitTest = async (data: TestSubmission): Promise<TestSubmissionResponse> => {
  try {
    const response = await api.post(`/api/tests/${data.testId}/submission`, {
      userId: data.userId,
      answers: data.answers
    })
    
    const result = response.data.submission
    return result
  } catch (error: any) {
    console.error("Error in submitTest:", error)
    console.error("Error response:", error.response?.data)
    console.error("Error status:", error.response?.status)
    throw error
  }
} 