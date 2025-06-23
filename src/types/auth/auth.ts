export interface LoginErrors {
  email?: string
  password?: string
}

export interface LoginFormData {
  email: string
  password: string
}

export interface RegisterErrors {
  name?: string
  email?: string
  password?: string
  confirmPassword?: string
}

export interface RegisterFormData {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export interface User {
  username: string
  role: number
  avatar: string
  googleId: string
  email: string
  password: string
  lastOnline: Date
  onlineStreak: number
  activeUntil: Date | null
  isDeleted?: boolean
  createdAt?: Date
  updatedAt?: Date
  resetPasswordPin: {
    value: string | null
    expiresAt: Date | null
    isVerified: boolean
  }
}

export interface LoginFormPayload {
  email: string
  password: string
}

export interface RegisterFormPayload {
  name: string
  email: string
  password: string
}
