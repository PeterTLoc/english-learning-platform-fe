import { LoginErrors, LoginFormData } from "@/types/auth/auth"

export const validateLoginForm = (form: LoginFormData): LoginErrors => {
  const errors: LoginErrors = {}

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  if (!form.email) {
    errors.email = "Email is required"
  } else if (!isValidEmail(form.email)) {
    errors.email = "Invalid email format"
  }

  if (!form.password) {
    errors.password = "Password is required"
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