"use client"

import {
  getExercisesByLessonId,
  getGrammarsByLessonId,
  getVocabulariesByLessonId,
} from "@/services/lessonService"
import { Lesson } from "@/types/lesson/lesson"
import { Vocabulary } from "@/types/lesson/vocabulary"
import { useEffect, useState } from "react"
import VocabularyContent from "../lesson/VocabularyContent"
import GrammarContent from "../lesson/GrammarContent"
import { Grammar } from "@/types/lesson/grammar"
import { Exercise } from "@/types/lesson/exercise"
import ExerciseContent from "../lesson/ExerciseContent"

interface LessonContentProps {
  lesson: Lesson | null
  tab: string | null
}

export default function LessonContent({ lesson, tab }: LessonContentProps) {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchLessonContent = async () => {
      if (!lesson?._id || !tab) return

      setLoading(true)

      try {
        if (tab === "Exercise") {
          const data = await getExercisesByLessonId(lesson._id)
          setExercises(data)
        }
      } catch (error) {
        console.error(`Failed to fetch ${tab?.toLowerCase()}`, error)
      } finally {
        setLoading(false)
      }
    }

    fetchLessonContent()
  }, [lesson?._id, tab])

  if (!lesson?._id || !tab) {
    return (
      <p className="text-gray-500">Select a lesson and tab to see content.</p>
    )
  }

  const tracking =
    lesson.length.find((entry) => entry.for === tab.toLowerCase()) ||
    (tab === "Exercise" && exercises.length
      ? { for: "exercise", amount: exercises.length }
      : null)

  const renderContent = () => {
    // Vocabulary
    if (tab === "Vocabulary") {
      return <VocabularyContent lessonId={lesson._id} itemsPerPage={1} />
    }

    // Grammar
    if (tab === "Grammar") {
      return <GrammarContent lessonId={lesson._id} itemsPerPage={1} />
    }

    // Exercise
    if (tab === "Exercise") {
      if (!lesson?._id) return <p>Invalid lesson.</p>
      return <ExerciseContent lessonId={lesson._id} />
    }

    // Default fallback for unknown tab or no tracking
    if (!tracking) {
      return <div>No {tab} content found for this lesson.</div>
    }

    return (
      <div>
        {tracking.amount} {tab.toLowerCase()} item(s)
      </div>
    )
  }

  return (
    <>
      <h1 className="title">{tab}</h1>
      <div className="overflow-y-auto max-h-[calc(100vh-243px)]">{renderContent()}</div>
    </>
  )
}
