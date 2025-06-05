import { isAxiosError } from "axios"

export function parseAxiosError(error: unknown): { message: string } {
  if (isAxiosError(error)) {
    const data = error.response?.data

    if (typeof data?.message === "string") {
      return { message: data.message }
    }

    if (typeof data?.detail === "string") {
      return { message: data.detail }
    }
  }

  if (error instanceof Error) {
    return { message: error.message }
  }

  return { message: "Something went wrong" }
}
