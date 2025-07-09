interface TestNavigationProps {
  currentQuestionIndex: number
  totalQuestions: number
  onPrevious: () => void
  onNext: () => void
  onSubmit: () => void
  isSubmitting: boolean
  answeredQuestions: number
  completedQuestions: number
  className?: string
}

export default function TestNavigation({
  currentQuestionIndex,
  totalQuestions,
  onPrevious,
  onNext,
  onSubmit,
  isSubmitting,
  answeredQuestions,
  completedQuestions,
  className = "",
}: TestNavigationProps) {
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1
  const allQuestionsAnswered = answeredQuestions === totalQuestions

  return (
    <div className={`flex gap-2 self-center ${className}`}>
      <button
        onClick={onPrevious}
        disabled={currentQuestionIndex === 0}
        className={`button rounded-[5px] border transition-colors px-4
          ${currentQuestionIndex === 0
            ? "bg-transparent text-gray-400 border-transparent cursor-not-allowed"
            : "bg-[#2A2A2A] text-white border-[#303030] hover:bg-[#232323] hover:border-[#303030]"}
        `}
        aria-label="Previous"
      >
        Previous
      </button>

      {!isLastQuestion ? (
        <button
          onClick={onNext}
          className={`button rounded-[5px] border transition-colors px-4
            bg-[#2A2A2A] text-white border-[#303030] hover:bg-[#232323] hover:border-[#303030]`
          }
          aria-label="Next"
        >
          Next
        </button>
      ) : (
        <button
          onClick={onSubmit}
          disabled={isSubmitting || !allQuestionsAnswered}
          className={`button-blue rounded-[5px] border transition-colors px-6
            ${isSubmitting || !allQuestionsAnswered
              ? "bg-transparent text-gray-400 border-transparent cursor-not-allowed"
              : ""}
          `}
        >
          {isSubmitting ? "Submitting..." : "Submit Test"}
        </button>
      )}
    </div>
  )
} 