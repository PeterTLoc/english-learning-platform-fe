import { Test } from "@/types/course/test"
import { IExercise } from "@/types/models/IExercise"
import ContentSlideIn from "@/components/ui/ContentSlideIn"
import TestQuestion from "./TestQuestion"
import TestProgressBar from "./TestProgressBar"
import TestPagination from "./TestPagination"

interface TestTakingProps {
  lessonId: string
  test: Test
  currentQuestionIndex: number
  answers: Record<string, string[]>
  completedQuestions: number
  onAnswerSelect: (exerciseId: string, answer: string) => void
  onMultipleChoiceSelect?: (exerciseId: string, selectedOptions: string[]) => void
  onPrevious: () => void
  onNext: () => void
  onSubmit: () => void
  isSubmitting: boolean
}

export default function TestTaking({
  lessonId,
  test,
  currentQuestionIndex,
  answers,
  completedQuestions,
  onAnswerSelect,
  onMultipleChoiceSelect,
  onPrevious,
  onNext,
  onSubmit,
  isSubmitting,
}: TestTakingProps) {
  const exercises = test.exercises || []
  const currentExercise = exercises[currentQuestionIndex]
  const totalQuestions = exercises.length
  const answeredQuestions = Object.keys(answers).length

  return (
    <div className="h-[calc(100vh-235px)] flex flex-col">
      <TestProgressBar
        test={test}
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={totalQuestions}
        answeredQuestions={answeredQuestions}
        completedQuestions={completedQuestions}
      />
      <div className="flex mb-5">
        <TestPagination
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={totalQuestions}
          onPrevious={onPrevious}
          onNext={onNext}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          answeredQuestions={answeredQuestions}
          completedQuestions={completedQuestions}
        />
      </div>

      {/* Question Content */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <ContentSlideIn
          keyValue={`${lessonId}-test-${currentQuestionIndex}`}
          isLoading={false}
          direction="bottom"
        >
          {currentExercise ? (
            currentExercise.question ? (
              <>
                <TestQuestion
                  exercise={currentExercise}
                  index={currentQuestionIndex + 1}
                  selectedAnswers={
                    answers[currentExercise._id as string] || []
                  }
                  onSelect={(exerciseId: string, answer: string) =>
                    onAnswerSelect(exerciseId, answer)
                  }
                  onMultipleChoiceSelect={onMultipleChoiceSelect}
                />
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-red-500 mb-2">Invalid exercise data</p>
                <p className="text-gray-400 text-sm">
                  Exercise missing required properties
                </p>
              </div>
            )
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-2">Loading question...</p>
              <p className="text-gray-400 text-sm">
                Debug: {totalQuestions} total questions, current index:{" "}
                {currentQuestionIndex}
              </p>
              {exercises.length === 0 && (
                <p className="text-red-400 text-sm mt-2">
                  No exercises found in test data
                </p>
              )}
            </div>
          )}
        </ContentSlideIn>
      </div>
    </div>
  )
} 