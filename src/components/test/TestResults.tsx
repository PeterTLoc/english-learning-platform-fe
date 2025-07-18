import { TestSubmissionResponse } from "@/services/testService"
import ContentSlideIn from "@/components/ui/ContentSlideIn"

interface TestResultsProps {
  lessonId: string
  testResult: TestSubmissionResponse
  onRetake: () => void
}

export default function TestResults({
  lessonId,
  testResult,
  onRetake,
}: TestResultsProps) {
  const correctAnswers = testResult.results.filter(
    (result) => result.isCorrect
  ).length
  const totalQuestions = testResult.results.length

  return (
    <ContentSlideIn
      keyValue={`${lessonId}-test-results`}
      isLoading={false}
      direction="bottom"
    >
      <div className="space-y-6">
        <div className="text-center">
          <div
            className={`text-6xl mb-4 ${
              testResult.status === "passed" ? "text-green-500" : "text-red-500"
            }`}
          >
            {testResult.status === "passed" ? "🎉" : "😔"}
          </div>
          <h2 className="text-[22px] font-bold text-white mb-2">
            {testResult.status === "passed"
              ? "Congratulations!"
              : "Test Completed"}
          </h2>
          <p className="subtext mb-4">{testResult.description}</p>

          <div className="container max-w-md mx-auto p-5 mb-4">
            <div className="text-center">
              <p className="text-4xl font-bold text-white mb-2">
                {testResult.score}%
              </p>
              <p className="subtext mb-4">Your Score</p>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="subtext">Correct</p>
                  <p className="text-green-400 font-medium">{correctAnswers}</p>
                </div>
                <div>
                  <p className="subtext">Incorrect</p>
                  <p className="text-red-400 font-medium">
                    {totalQuestions - correctAnswers}
                  </p>
                </div>
                <div>
                  <p className="subtext">Attempt</p>
                  <p className="text-blue-400 font-medium">
                    {testResult.attemptNo}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={onRetake}
            className="button-blue"
          >
            Retake Test
          </button>
        </div>
      </div>
    </ContentSlideIn>
  )
}
