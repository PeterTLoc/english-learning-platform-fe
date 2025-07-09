import { Test } from "@/types/course/test"

interface TestHeaderProps {
  test: Test
  currentQuestionIndex: number
  totalQuestions: number
  answeredQuestions: number
  completedQuestions: number
}

export default function TestHeader({
  test,
  currentQuestionIndex,
  totalQuestions,
  answeredQuestions,
  completedQuestions,
}: TestHeaderProps) {
  return (
    <div>
      <div className="mb-4">
        <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 transition-all duration-300 rounded-full"
            style={{
              width: `${(answeredQuestions / totalQuestions) * 100}%`,
            }}
          />
        </div>
        <div className="flex justify-between items-center mt-2 subtext text-sm">
          <span>
            {answeredQuestions} of {totalQuestions} answered
          </span>
          <span>
            {Math.round((answeredQuestions / totalQuestions) * 100)}%
          </span>
        </div>
      </div>
    </div>
  )
}
