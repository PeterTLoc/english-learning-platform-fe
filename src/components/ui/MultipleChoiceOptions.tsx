import { IExercise } from "@/types/models/IExercise"
import { isMultipleChoice } from "@/utils/exerciseUtils"

interface MultipleChoiceOptionsProps {
  exercise: IExercise
  selectedAnswer: string
  hasSubmitted: boolean
  showCorrectAnswer?: boolean
  onOptionClick: (option: string) => void
  onContinueToNext?: () => void
}

export default function MultipleChoiceOptions({
  exercise,
  selectedAnswer,
  hasSubmitted,
  showCorrectAnswer = false,
  onOptionClick,
  onContinueToNext,
}: MultipleChoiceOptionsProps) {
  if (!isMultipleChoice(exercise)) return null

  const isSubmitted = hasSubmitted || showCorrectAnswer

  const getOptionStyle = (option: string) => {
    const isSelected = selectedAnswer === option
    const isCorrect = Array.isArray(exercise.answer)
      ? exercise.answer.includes(option)
      : exercise.answer
      ? exercise.answer === option
      : false
    const isSubmitted = hasSubmitted || showCorrectAnswer

    if (isSubmitted) {
      if (isCorrect) {
        return "border-green-500 text-white bg-[#373737]"
      }
      if (isSelected && !isCorrect) {
        return "border-red-500 text-white bg-[#373737]"
      }
      return "border-[#3F3F3F] text-white bg-[#373737]"
    }

    return isSelected
      ? "border-[#4CC2FF] text-white bg-[#373737]"
      : "border-[#3F3F3F] text-white bg-[#373737] hover:border-[#4CC2FF]"
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        {exercise.options?.map((option, idx) => (
          <button
            key={option}
            type="button"
            disabled={isSubmitted}
            onClick={() => onOptionClick(option)}
            className={`w-[365px] h-[34px] px-5 text-left border rounded-[5px] overflow-hidden transition-colors flex items-center text-sm ${getOptionStyle(
              option
            )}`}
          >
            {option}
          </button>
        ))}
      </div>

      {showCorrectAnswer && onContinueToNext && (
        <div className="mt-8">
          <button
            type="button"
            className="button-blue"
            onClick={onContinueToNext}
          >
            Continue
          </button>
        </div>
      )}
    </>
  )
}
