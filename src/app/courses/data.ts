import { Course } from "@/types/models/course"

export const foundationCourses: Course[] = [
  {
    id: "1",
    name: "English Foundations",
    description: "Grammar",
    level: "beginner",
    type: "foundation",
    totalLessons: 12,
    coverImage: "https://picsum.photos/seed/1/400/300",
  },
  {
    id: "2",
    name: "Daily English Conversations",
    description: "Speaking",
    level: "beginner",
    type: "foundation",
    totalLessons: 10,
    coverImage: "https://picsum.photos/seed/2/400/300",
  },
  {
    id: "3",
    name: "Mastering English Vocabulary",
    description: "Vocabulary",
    level: "beginner",
    type: "foundation",
    totalLessons: 8,
    coverImage: "https://picsum.photos/seed/3/400/300",
  },
]

export const workCourses: Course[] = [
  {
    id: "4",
    name: "English for Work",
    description: "Business English",
    level: "intermediate",
    type: "work",
    totalLessons: 15,
    coverImage: "https://picsum.photos/seed/4/400/300",
  },
  {
    id: "5",
    name: "Professional Emails",
    description: "Email writing",
    level: "intermediate",
    type: "work",
    totalLessons: 7,
    coverImage: "https://picsum.photos/seed/5/400/300",
  },
  {
    id: "6",
    name: "Office Dialogues",
    description: "Listening practice",
    level: "intermediate",
    type: "work",
    totalLessons: 9,
    coverImage: "https://picsum.photos/seed/6/400/300",
  },
]

export const listeningCourses: Course[] = [
  {
    id: "7",
    name: "Listening Practice",
    description: "General",
    level: "advanced",
    type: "listening",
    totalLessons: 6,
    coverImage: "https://picsum.photos/seed/7/400/300",
  },
  {
    id: "8",
    name: "Movie Listening",
    description: "With subtitles",
    level: "advanced",
    type: "listening",
    totalLessons: 11,
    coverImage: "https://picsum.photos/seed/8/400/300",
  },
  {
    id: "9",
    name: "Podcast Practice",
    description: "Real speed audio",
    level: "advanced",
    type: "listening",
    totalLessons: 5,
    coverImage: "https://picsum.photos/seed/9/400/300",
  },
]

export const allCourses: Course[] = [
  ...foundationCourses,
  ...workCourses,
  ...listeningCourses,
]
