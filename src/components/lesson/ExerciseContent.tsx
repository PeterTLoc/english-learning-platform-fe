"use client"

import { useEffect, useState } from "react"
import { getExercisesByLessonId } from "@/services/lessonService"
import { Exercise } from "@/types/lesson/exercise"

interface ExerciseContentProps {
  lessonId: string
}

export default function ExerciseContent({ lessonId }: ExerciseContentProps) {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [loading, setLoading] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userAnswer, setUserAnswer] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  useEffect(() => {
    const fetchExercises = async () => {
      setLoading(true)
      try {
        const data = await getExercisesByLessonId(lessonId)
        setExercises(data)
      } catch (error) {
        console.error("Failed to fetch exercises:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchExercises()
  }, [lessonId])

  const currentExercise = exercises[currentIndex]
  const cleanedAnswer = userAnswer.trim().toLowerCase()
  const isCorrect =
    isSubmitted &&
    currentExercise &&
    Array.isArray(currentExercise.answer) &&
    currentExercise.answer.some(
      (ans) => ans.trim().toLowerCase() === cleanedAnswer
    )

  const handleSubmit = () => {
    if (!userAnswer.trim()) return
    setIsSubmitted(true)
  }

  const handleSelect = (opt: string) => {
    setUserAnswer(opt)
    setIsSubmitted(true)
  }

  const handleNext = () => {
    setIsSubmitted(false)
    setUserAnswer("")
    setCurrentIndex((prev) => prev + 1)
  }

  if (loading) return <p>Loading exercises...</p>
  if (!exercises.length) return <p>No exercises available.</p>

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between text-sm text-gray-500">
        <span>
          Question {currentIndex + 1} of {exercises.length}
        </span>
        {isSubmitted && (
          <span className={isCorrect ? "text-green-500" : "text-red-500"}>
            {isCorrect ? "Correct" : "Incorrect"}
          </span>
        )}
      </div>

      {/* Main Exercise Card */}
      <div className="bg-neutral-900 p-6 rounded-lg shadow space-y-4">
        <p className="text-base font-semibold">{currentExercise.question}</p>

        {currentExercise.image && (
          <img
            src={currentExercise.image}
            alt="Exercise"
            className="w-32 h-auto rounded"
          />
        )}

        {/* Input Field or Options */}
        {currentExercise.options?.length ? (
          <ul className="space-y-2">
            {currentExercise.options.map((opt, i) => (
              <li key={i}>
                <button
                  onClick={() => handleSelect(opt)}
                  disabled={isSubmitted}
                  className={`w-full text-left px-4 py-2 rounded border transition
                    ${
                      isSubmitted && currentExercise.answer.includes(opt)
                        ? "bg-green-100 border-green-500"
                        : isSubmitted && userAnswer === opt
                        ? "bg-red-100 border-red-500"
                        : userAnswer === opt
                        ? "bg-blue-100 border-blue-500"
                        : "border-gray-300"
                    }`}
                >
                  {opt}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="space-y-2">
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              disabled={isSubmitted}
              placeholder="Type your answer..."
              className="w-full px-3 py-2 border rounded bg-black text-white"
            />
            {!isSubmitted && (
              <button
                onClick={handleSubmit}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Submit
              </button>
            )}
          </div>
        )}

        {/* Explanation */}
        {isSubmitted && currentExercise.explanation && (
          <p className="text-sm text-gray-300">
            Explanation: {currentExercise.explanation}
          </p>
        )}
      </div>

      {/* Next Button */}
      {isSubmitted && currentIndex < exercises.length - 1 && (
        <button
          onClick={handleNext}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Next
        </button>
      )}

      {/* Finish Message */}
      {isSubmitted && currentIndex === exercises.length - 1 && (
        <div className="text-center text-green-500 font-semibold">
          You’ve completed all exercises!
        </div>
      )}
    </div>
  )
}
