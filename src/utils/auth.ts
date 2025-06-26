import { LoginErrors, LoginFormData } from "@/types/auth/auth"

export const validateLoginForm = (form: LoginFormData): LoginErrors => {
  const errors: LoginErrors = {}

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const isValidPassword = (password: string) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,50}$/.test(password)

  if (!form.email) {
    errors.email = "Email is required"
  } else if (!isValidEmail(form.email)) {
    errors.email = "Invalid email format"
  }

  if (!form.password) {
    errors.password = "Password is required"
  } else if (!isValidPassword(form.password)) {
    errors.password =
      "Password must contain at least 1 lowercase letter, 1 uppercase letter, 1 number, 1 symbol, and be 8-50 characters long"
  }

  return errors
}

/**
 * Gets the redirect URL from query parameters
 */
export function getRedirectUrl(): string | null {
  if (typeof window === 'undefined') return null
  
  const params = new URLSearchParams(window.location.search)
  return params.get('redirect') || '/'
}