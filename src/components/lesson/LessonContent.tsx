"use client"

import { Lesson } from "@/types/lesson/lesson"
import VocabularyContent from "../lesson-content/VocabularyContent"
import GrammarContent from "../lesson-content/GrammarContent"
import ExerciseContent from "../lesson-content/ExerciseContent"

interface LessonContentProps {
  lesson: Lesson | null
  tab: string | null
  setSidebarRefreshKey?: React.Dispatch<React.SetStateAction<number>>
}

export default function LessonContent({ lesson, tab, setSidebarRefreshKey }: LessonContentProps) {
  if (!lesson?._id || !tab) {
    return (
      <p className="text-gray-500">Select a lesson and tab to see content.</p>
    )
  }

  const renderContent = () => {
    switch (tab) {
      case "Vocabulary":
        return <VocabularyContent lessonId={lesson._id} itemsPerPage={1} />
      case "Grammar":
        return <GrammarContent lessonId={lesson._id} itemsPerPage={1} />
      case "Exercise":
        return <ExerciseContent lessonId={lesson._id} itemsPerPage={1} setSidebarRefreshKey={setSidebarRefreshKey} />
      default:
        return <div>No {tab} content found for this lesson.</div>
    }
  }

  return <div>{renderContent()}</div>
}
