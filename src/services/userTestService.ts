import api from "@/lib/api";
import { Test } from "@/types/course/test";

export interface UserTest {
  _id: string;
  userId: string;
  testId: string;
  attemptNo: number;
  score: number;
  status: "not-started" | "passed" | "failed";
  description: string;
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
  // Populated fields from aggregation
  test?: Test;
}

export const getUserTests = async (userId: string) => {
  const response = await api.get(`/api/user-tests/${userId}/user`);
  return response.data;
};

export const getUserTestByTestId = async (testId: string) => {
  const response = await api.get(`/api/user-tests/${testId}/test`);
  return response.data;
};

export const getUserTestById = async (
  userTestId: string
): Promise<UserTest> => {
  const response = await api.get(`/api/user-tests/${userTestId}`);
  return response.data.data;
};

export const createUserTest = async (data: Partial<UserTest>) => {
  const response = await api.post("/api/user-tests", data);
  return response.data;
};

export const updateUserTest = async (id: string, data: Partial<UserTest>) => {
  const response = await api.put(`/api/user-tests/${id}`, data);
  return response.data;
};

export const deleteUserTest = async (id: string) => {
  const response = await api.delete(`/api/user-tests/${id}`);
  return response.data;
};

// Check if user has passed any tests for a course
export const checkUserTestCompletion = async (userId: string) => {
  try {
    const response = await api.get(
      `/api/user-tests/${userId}/user?page=1&size=100`
    );
    const userTests = response.data.data || [];

    // Check if user has any passed tests
    const passedTests = userTests.filter(
      (test: any) => test.status === "passed"
    );
    return passedTests.length > 0;
  } catch (error) {
    console.error("Failed to check test completion:", error);
    return false;
  }
};
