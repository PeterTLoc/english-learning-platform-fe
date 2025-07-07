export interface Vocabulary {
  _id: string
  lessonId: string
  englishContent: string
  vietnameseContent: string
  imageUrl?: string
  order: number
  createdAt: string
  updatedAt: string
  isDeleted?: boolean
}
