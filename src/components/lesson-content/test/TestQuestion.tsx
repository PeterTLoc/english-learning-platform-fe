import { IExercise } from "@/types/models/IExercise"
import ExerciseTextInput from "../exercise/ExerciseTextInput"
import ExerciseImage from "../exercise/ExerciseImage"
import ExerciseHeader from "../exercise/ExerciseHeader"
import MultipleChoiceOptions from "@/components/ui/MultipleChoiceOptions"

interface TestQuestionProps {
  exercise: IExercise
  index: number
  selectedAnswers: string[]
  onSelect: (exerciseId: string, answer: string) => void
  onMultipleChoiceSelect?: (exerciseId: string, selectedOptions: string[]) => void
}

export default function TestQuestion({
  exercise,
  index,
  selectedAnswers,
  onSelect,
  onMultipleChoiceSelect,
}: TestQuestionProps) {
  const handleOptionClick = (option: string) => {
    if (selectedAnswers[0] === option) {
      // Deselect if already selected
      onSelect(exercise._id as string, "")
    } else {
      // Select new option
      onSelect(exercise._id as string, option)
    }
  }

  const handleTextChange = (value: string) => {
    onSelect(exercise._id as string, value)
  }

  return (
    <div className="flex flex-col">
      <ExerciseHeader index={index} type={exercise.type} />
      <div className="bg-[#2B2B2B] border border-[#1D1D1D] border-t-[#2B2B2B] rounded-b-[5px] p-5 pl-[60px] pr-[45px]">
        <p className="mb-5 text-white text-sm">{exercise.question}</p>
        {exercise.image && (
          <ExerciseImage image={exercise.image} />
        )}
        <div className="space-y-3">
          {exercise.type === "multiple_choice" && exercise.options ? (
            <MultipleChoiceOptions
              exercise={exercise}
              selectedAnswer={selectedAnswers[0] || ""}
              hasSubmitted={false}
              showCorrectAnswer={false}
              onOptionClick={handleOptionClick}
            />
          ) : (
            <div className="space-y-3">
              <ExerciseTextInput
                value={selectedAnswers[0] || ""}
                onChange={handleTextChange}
                onSubmit={() => {}}
                disabled={false}
                hideSubmitAndHint={true}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 