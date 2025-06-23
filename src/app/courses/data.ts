import { Course } from "@/types/models/course"

export const foundationCourses: Course[] = [
  { id: 1, name: "English Foundations", description: "Grammar", totalLessons: 12 },
  { id: 2, name: "Daily English Conversations", description: "Speaking", totalLessons: 10 },
  { id: 3, name: "Mastering English Vocabulary", description: "Vocabulary", totalLessons: 8 },
]

export const workCourses: Course[] = [
  { id: 4, name: "English for Work", description: "Business English", totalLessons: 15 },
  { id: 5, name: "Professional Emails", description: "Email writing", totalLessons: 7 },
  { id: 6, name: "Office Dialogues", description: "Listening practice", totalLessons: 9 },
]

export const listeningCourses: Course[] = [
  { id: 7, name: "Listening Practice", description: "General", totalLessons: 6 },
  { id: 8, name: "Movie Listening", description: "With subtitles", totalLessons: 11 },
  { id: 9, name: "Podcast Practice", description: "Real speed audio", totalLessons: 5 },
]
