interface LessonContentProps {
  lessonId: string | null
  tab: string | null
}

export default function LessonContent({ lessonId, tab }: LessonContentProps) {
  if (!lessonId || !tab) {
    return <p className="text-gray-500">Select a lesson and tab to see content.</p>
  }

  const renderContent = () => {
    switch (tab) {
      case "Vocabulary":
        return <div>Vocabulary content for {lessonId}</div>
      case "Grammar":
        return <div>Grammar content for {lessonId}</div>
      case "Exercises":
        return <div>Exercises content for {lessonId}</div>
      default:
        return <div>Unknown tab</div>
    }
  }

  return <div className="container">{renderContent()}</div>
}
