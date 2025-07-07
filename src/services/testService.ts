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

// Get tests by lesson ID
export const getTestsByLessonId = async (lessonId: string): Promise<Test[]> => {
  try {
    console.log("Calling getTestsByLessonId for lesson:", lessonId)
    const response = await api.get(`/api/tests/lesson/${lessonId}`)
    console.log("getTestsByLessonId response:", response.data)
    return response.data.data || []
  } catch (error) {
    console.error("Error in getTestsByLessonId:", error)
    throw error
  }
}

// Get test by ID (includes exercises)
export const getTestById = async (testId: string): Promise<Test> => {
  try {
    console.log("Calling getTestById for test:", testId)
    const response = await api.get(`/api/tests/${testId}?_t=${Date.now()}`)
    console.log('getTestById API Response:', response.data)
    return response.data.test
  } catch (error) {
    console.error("Error in getTestById:", error)
    throw error
  }
}

// Submit a test
export const submitTest = async (data: TestSubmission): Promise<TestSubmissionResponse> => {
  try {
    console.log("Submitting test with data:", data)
    const response = await api.post(`/api/tests/${data.testId}/submission`, {
      userId: data.userId,
      answers: data.answers
    })
    console.log("submitTest response:", response.data)
    console.log("submitTest response.submission:", response.data.submission)
    
    // Return the submission data directly
    const result = response.data.submission
    console.log("Returning from submitTest:", result)
    return result
  } catch (error: any) {
    console.error("Error in submitTest:", error)
    console.error("Error response:", error.response?.data)
    console.error("Error status:", error.response?.status)
    throw error
  }
} 