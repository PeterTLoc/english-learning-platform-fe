import { Test } from "@/types/course/test"
import ContentSlideIn from "@/components/ui/ContentSlideIn"
import { useEffect, useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { getUserTests } from "@/services/userTestService"

interface TestSelectionProps {
  lessonId: string
  tests: Test[]
  onStartTest: (test: Test) => void
  loading: boolean
  testStatuses: any
  statusLoading: boolean
}

export default function TestSelection({
  lessonId,
  tests,
  onStartTest,
  loading,
  testStatuses,
  statusLoading,
}: TestSelectionProps) {
  const { user } = useAuth()

  if (loading) {
    return (
      <ContentSlideIn
        keyValue={`${lessonId}-loading`}
        isLoading={true}
        direction="bottom"
        loadingComponent={
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#4CC2FF]"></div>
          </div>
        }
      >
        <p className="text-gray-500">Loading tests...</p>
      </ContentSlideIn>
    )
  }

  if (!tests || tests.length === 0) {
    return (
      <ContentSlideIn
        keyValue={`${lessonId}-no-tests`}
        isLoading={false}
        direction="bottom"
      >
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4">📝</div>
          <h2 className="text-xl font-bold text-white">No Tests Available</h2>
          <p className="text-gray-300">
            There are no tests configured for this lesson yet.
          </p>
          <div className="bg-gray-800 p-4 rounded-lg">
            <p className="text-sm text-gray-400">
              Tests need to be created by an administrator with specific
              exercises.
            </p>
          </div>
        </div>
      </ContentSlideIn>
    )
  }

  const getStatusBadge = (testId: string) => {
    const status = testStatuses[testId]

    if (statusLoading) {
      return (
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#4CC2FF]"></div>
          <span className="text-gray-400 text-sm">Loading...</span>
        </div>
      )
    }

    if (!status || status.status === "not-attempted") {
      return (
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gray-500"></div>
          <span className="text-gray-400 text-sm">Not attempted</span>
        </div>
      )
    }

    if (status.status === "passed") {
      return (
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-green-400 text-sm font-medium">
            Passed ({status.score}%)
          </span>
        </div>
      )
    }

    if (status.status === "failed") {
      return (
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span className="text-red-400 text-sm font-medium">
            Failed ({status.score}%)
          </span>
        </div>
      )
    }

    return null
  }

  return (
    <ContentSlideIn
      keyValue={`${lessonId}-test-selection`}
      isLoading={false}
      direction="bottom"
    >
      <div className="flex flex-col gap-1">
        {tests.map((test, index) => (
          <div key={test._id} className="flex flex-col">
            <div className="bg-[#2B2B2B] border border-[#1D1D1D] p-5 rounded-t-[5px] flex items-center gap-5 h-[69px]">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                testStatuses[test._id]?.status === "passed" 
                  ? "bg-green-500" 
                  : "bg-[#666666]"
              }`}>
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm text-white">{test.name}</p>
                <p className="text-xs subtext">{test.description}</p>
              </div>
              <button
                className="button-blue px-4 py-2 rounded-[5px] text-sm"
                onClick={() => onStartTest(test)}
              >
                {testStatuses[test._id]?.status === "not-attempted" || !testStatuses[test._id]?.status ? "Start" : "Retake"}
              </button>
            </div>

            <div className="bg-[#2B2B2B] border border-[#1D1D1D] border-t-[#2B2B2B] rounded-b-[5px] p-5 grid grid-cols-[138px_1fr] gap-[5px] text-sm">
              <div className="text-white pl-[40px]">Questions</div>
              <div className="subtext">
                <span>{test.totalQuestions}</span>
              </div>

              <div className="text-white pl-[40px]">Time</div>
              <div className="subtext">
                <span>{Math.ceil(test.totalQuestions * 1.5)}</span> min
              </div>

              {testStatuses[test._id]?.attemptNo && (
                <>
                  <div className="text-white pl-[40px]">Attempts</div>
                  <div className="subtext">
                    <span>{testStatuses[test._id]?.attemptNo}</span>
                  </div>
                </>
              )}

              {testStatuses[test._id]?.score &&
                testStatuses[test._id]?.status && (
                  <>
                    <div className="text-white pl-[40px]">Score</div>
                    <div className="subtext">
                      <span
                        className={`font-medium ${
                          testStatuses[test._id]!.status === "passed"
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {testStatuses[test._id]!.score}%
                      </span>
                    </div>
                  </>
                )}
            </div>
          </div>
        ))}
      </div>
    </ContentSlideIn>
  )
}
