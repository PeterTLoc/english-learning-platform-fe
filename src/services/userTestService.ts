import api from "@/lib/api"
import { Test } from "@/types/course/test"

export interface UserTest {
  _id: string
  userId: string
  testId: string
  attemptNo: number
  score: number
  status: 'not-started' | 'in-progress' | 'completed'
  description: string
  isDeleted?: boolean
  createdAt: string
  updatedAt: string
  // Populated fields from aggregation
  test?: Test
}

export const getUserTests = async (userId: string) => {
  const response = await api.get(`/api/user-tests/${userId}/user`)
  return response.data
}

export const getUserTestByTestId = async (testId: string) => {
  const response = await api.get(`/api/user-tests/${testId}/test`)
  return response.data
}

export const getUserTestById = async (userTestId: string): Promise<UserTest> => {
  const response = await api.get(`/api/user-tests/${userTestId}`)
  return response.data.data
}

export const createUserTest = async (data: Partial<UserTest>) => {
  const response = await api.post('/api/user-tests', data)
  return response.data
}

export const updateUserTest = async (id: string, data: Partial<UserTest>) => {
  const response = await api.put(`/api/user-tests/${id}`, data)
  return response.data
}

export const deleteUserTest = async (id: string) => {
  const response = await api.delete(`/api/user-tests/${id}`)
  return response.data
} 