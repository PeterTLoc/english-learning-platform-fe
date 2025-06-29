import api from "@/lib/api"
import { LoginFormPayload, RegisterFormPayload, User } from "@/types/auth/auth"

export const login = async (formData: LoginFormPayload): Promise<User> => {
  const response = await api.post("/api/auth/login", formData)
  return response.data
}

export const register = async (formData: RegisterFormPayload): Promise<User> => {
  const response = await api.post("/api/auth/signup", formData)
  return response.data
}

export const logout = async (): Promise<void> => {
  await api.post("/api/auth/logout")
}

export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get("/api/auth/me")
  return response.data.user;
}
