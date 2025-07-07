import api from "@/lib/api"

interface SubmitExercisePayload {
  id: string // For DTO validation
  exerciseId: string // For controller expectation
  answer: string // renamed from selectedAnswer
}

interface SubmitExercisesPayload {
  userId: string
  answers: {
    exerciseId: string
    selectedAnswers: string[]
  }[]
}

// Add new interface for batch submission response
interface BatchSubmissionResponse {
  userId: string
  submittedAt: Date
  results: {
    exerciseId: string
    selectedAnswers: string[]
    correctAnswers: string[]
    isCorrect: boolean
  }[]
}

export const createUserExercise = async (
  payload: SubmitExercisePayload
): Promise<any> => {
  console.log('Sending payload to API:', payload)
  try {
    const response = await api.post("/api/user-exercises/submission", payload)
    return response.data
  } catch (error: any) {
    console.error('API Error Details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method
    })
    throw error
  }
}

export const submitExercisesForLesson = async (
  lessonId: string,
  payload: SubmitExercisesPayload
): Promise<BatchSubmissionResponse> => {
  console.log('Sending exercises submission to API:', payload)
  try {
    const response = await api.post(`/api/lessons/${lessonId}/exercises/submission`, payload)
    return response.data.submission
  } catch (error: any) {
    console.error('API Error Details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method,
      message: error.message,
      stack: error.stack
    })
    throw error
  }
}

export const getUserExercise = async (
  userId: string
): Promise<{ exerciseId: string; exercise?: any }[]> => {
  const response = await api.get(`/api/user-exercises/${userId}/user`)
  // The backend returns { data: [...], page, totalPages, total, message }
  return response.data.data || [] // <- ✅ returns the data array from the paginated response
}

// Add function to get user exercises by lesson ID
export const getUserExercisesByLessonId = async (
  userId: string,
  lessonId: string
): Promise<any[]> => {
  try {
    // Get all user exercises and filter by lesson
    const response = await api.get(`/api/user-exercises/${userId}/user?size=1000`)
    const allUserExercises = response.data.data || []
    
    // Filter to only include exercises from the current lesson
    return allUserExercises.filter((userExercise: any) => 
      userExercise.exercise?.lessonId === lessonId
    )
  } catch (error: any) {
    console.error('Failed to get user exercises by lesson ID:', error)
    return []
  }
}


