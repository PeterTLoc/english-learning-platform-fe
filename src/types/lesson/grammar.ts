export interface Grammar {
  _id: string
  lessonId: string
  title: string
  structure: string
  example?: string
  explanation?: string
  order: number
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}
