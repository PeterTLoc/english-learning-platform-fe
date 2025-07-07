import { useState, useEffect } from "react"
import { IExercise } from "@/types/models/IExercise"
import { isMultipleChoice, isAnswerCorrect } from "@/utils/exerciseUtils"
import ContinueButton from "./ContinueButton"
import ExerciseHeader from "./ExerciseHeader"
import ExerciseTextInput from "./ExerciseTextInput"
import ExerciseFeedback from "./ExerciseFeedback"
import MultipleChoiceOptions from "@/components/ui/MultipleChoiceOptions"

interface ExerciseQuestionProps {
  exercise: IExercise
  index: number
  selectedAnswer: string
  onSelect: (exerciseId: string, answer: string) => void
  hasSubmitted: boolean
}

interface ExtendedExerciseQuestionProps extends ExerciseQuestionProps {
  onAutoSubmit?: (exerciseId: string, answer: string) => void
  isCompleted?: boolean
  userAnswer?: string
  isCorrect?: boolean
  showCorrectAnswer?: boolean
  onContinueToNext?: () => void
}

export default function ExerciseQuestion({
  exercise,
  index,
  selectedAnswer,
  onSelect,
  hasSubmitted,
  onAutoSubmit,
  isCompleted = false,
  userAnswer,
  isCorrect,
  showCorrectAnswer = false,
  onContinueToNext,
}: ExtendedExerciseQuestionProps) {
  const exerciseId = String(exercise._id)

  // Reset text input when exercise is validated
  useEffect(() => {
    if (hasSubmitted) {
      // The selectedAnswer will be cleared by the parent component
    }
  }, [hasSubmitted])

  const handleTextInputChange = (value: string) => {
    onSelect(exerciseId, value)
  }

  const handleOptionClick = (option: string) => {
    if (!hasSubmitted) {
      onSelect(exerciseId, option)
      if (onAutoSubmit) {
        onAutoSubmit(exerciseId, option)
      }
    }
  }

  const handleManualSubmit = () => {
    if (selectedAnswer && onAutoSubmit) {
      onAutoSubmit(exerciseId, selectedAnswer as string)
    }
  }

  const isSubmitted = hasSubmitted || showCorrectAnswer
  const isValid = selectedAnswer
    ? isAnswerCorrect(selectedAnswer as string, exercise)
    : true

  // Determine validationResult for text input exercises
  let validationResult: "correct" | "incorrect" | undefined = undefined
  if (!isMultipleChoice(exercise) && isSubmitted && selectedAnswer) {
    validationResult = isValid ? "correct" : "incorrect"
  }

  return (
    <div className="flex flex-col">
      <ExerciseHeader index={index} type={exercise.type} />

      <div
        className={`bg-[#2B2B2B] border border-[#1D1D1D] border-t-[#2B2B2B] rounded-b-[5px] p-5 pl-[60px] pr-[45px]${
          isCompleted ? "opacity-90" : ""
        }`}
      >
        <p className="mb-5 text-white">{exercise.question}</p>

       
          {exercise.image && (
            <img
              src={exercise.image}
              alt="Exercise"
              className="mb-5 rounded-[5px] object-contain max-h-48"
            />
          )}

        <MultipleChoiceOptions
          exercise={exercise}
          selectedAnswer={selectedAnswer as string}
          hasSubmitted={hasSubmitted}
          showCorrectAnswer={showCorrectAnswer}
          onOptionClick={handleOptionClick}
          onContinueToNext={onContinueToNext}
        />

        {!isMultipleChoice(exercise) && (
          <>
            <ExerciseTextInput
              value={selectedAnswer as string}
              onChange={handleTextInputChange}
              onSubmit={handleManualSubmit}
              disabled={isSubmitted}
              showValidation={isSubmitted}
              isValid={isValid}
              validationResult={validationResult}
            />
            {showCorrectAnswer && onContinueToNext && (
              <div className="mt-8">
                <ContinueButton onClick={onContinueToNext} />
              </div>
            )}
          </>
        )}
      </div>

      <ExerciseFeedback
        exercise={exercise}
        hasSubmitted={hasSubmitted}
        isCompleted={isCompleted}
      />
    </div>
  )
}
