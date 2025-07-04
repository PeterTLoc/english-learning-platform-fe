export interface Exercise {
  _id: string
  lessonId: string
  type:
    | "translate"
    | "image_translate"
    | "fill_in_the_blank"
    | "multiple_choice"
    | string
  question: string
  options?: string[]
  answer: string[] | string
  explanation?: string
  focus: "vocabulary" | "grammar" | "exercise" | string
  image?: string
  order: number
  isDeleted?: boolean
  createdAt?: string
  updatedAt?: string
}
