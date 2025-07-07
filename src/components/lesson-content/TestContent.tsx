"use client"

import { useEffect, useState, useMemo, useRef } from "react"
import { useAuth } from "@/context/AuthContext"
import {
  getTestsByLessonId,
  getTestById,
  submitTest,
  TestSubmissionResponse,
} from "@/services/testService"
import { Test } from "@/types/course/test"
import ContentSlideIn from "@/components/ui/ContentSlideIn"
import { getUserExercisesByLessonId } from "@/services/userExerciseService"
import { getAllExercisesByLessonId } from "@/services/lessonService"
import TestSelection from "./test/TestSelection"
import TestTaking from "./test/TestTaking"
import TestResults from "./test/TestResults"
import LessonCompletionWarning from "./test/LessonCompletionWarning"
import { getUserTests } from "@/services/userTestService"

interface TestContentProps {
  lessonId: string
  allLessonIds?: string[]
  onNavigateToLesson?: (lessonId: string) => void
  onTestCompleted?: () => void
}

type TestState = "selecting" | "taking" | "completed"

export default function TestContent({
  lessonId,
  allLessonIds = [],
  onNavigateToLesson,
  onTestCompleted,
}: TestContentProps) {
  const { user } = useAuth()
  const [tests, setTests] = useState<Test[]>([])
  const [selectedTest, setSelectedTest] = useState<Test | null>(null)
  const [currentTest, setCurrentTest] = useState<Test | null>(null)
  const [testState, setTestState] = useState<TestState>("selecting")
  const [loading, setLoading] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string[]>>({})
  const [completedQuestions, setCompletedQuestions] = useState<number>(0)
  const [testResult, setTestResult] = useState<TestSubmissionResponse | null>(
    null
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [areAllLessonsCompleted, setAreAllLessonsCompleted] = useState(false)
  const [checkingCompletion, setCheckingCompletion] = useState(true)
  const [lessonCompletionStatus, setLessonCompletionStatus] = useState<Record<string, boolean>>({})
  const [userTestStatusLoading, setUserTestStatusLoading] = useState(true)
  const [testStatuses, setTestStatuses] = useState({})

  // Memoize allLessonIds to prevent unnecessary re-renders
  const memoizedAllLessonIds = useMemo(() => allLessonIds, [allLessonIds.join(',')])

  // Check if all lessons are completed
  useEffect(() => {
    let isMounted = true

    const checkAllLessonsCompletion = async () => {
      if (!user?._id || memoizedAllLessonIds.length === 0) {
        if (isMounted) {
          setAreAllLessonsCompleted(false)
          setCheckingCompletion(false)
        }
        return
      }

      try {
        const completionStatus: Record<string, boolean> = {}
        let allCompleted = true

        // Check completion for all lessons
        for (const lessonId of memoizedAllLessonIds) {
          // Get all exercises for this lesson
          const allExercises = await getAllExercisesByLessonId(lessonId)

          if (allExercises.length === 0) {
            completionStatus[lessonId] = false
            allCompleted = false
            continue
          }

          // Get user exercises for this lesson
          const userExercises = await getUserExercisesByLessonId(
            user._id,
            lessonId
          )

          // Check if all exercises are completed
          const completedExercises = userExercises.filter(
            (userExercise: any) => userExercise.completed
          )

          const isLessonCompleted = completedExercises.length === allExercises.length
          completionStatus[lessonId] = isLessonCompleted

          if (!isLessonCompleted) {
            allCompleted = false
          }
        }

        if (isMounted) {
          setLessonCompletionStatus(completionStatus)
          setAreAllLessonsCompleted(allCompleted)
          setCheckingCompletion(false)
        }
      } catch (error) {
        console.error("Failed to check lesson completion:", error)
        if (isMounted) {
          setAreAllLessonsCompleted(false)
          setCheckingCompletion(false)
        }
      }
    }

    checkAllLessonsCompletion()

    return () => {
      isMounted = false
    }
  }, [user?._id, memoizedAllLessonIds])

  useEffect(() => {
    const fetchTests = async () => {
      setLoading(true)
      try {
        const data = await getTestsByLessonId(lessonId)
        setTests(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error("Failed to fetch tests", error)
        setTests([])
      } finally {
        setLoading(false)
      }
    }

    fetchTests()
  }, [lessonId])

  // Fetch user test statuses when tests are loaded
  useEffect(() => {
    const fetchTestStatuses = async () => {
      if (!user?._id || tests.length === 0) {
        setUserTestStatusLoading(false)
        setTestStatuses({})
        return
      }
      try {
        const response = await getUserTests(user._id)
        const userTests = response.data || []
        const statuses: Record<string, any> = {}
        tests.forEach((test) => {
          statuses[test._id] = { status: "not-attempted" }
        })
        userTests.forEach((userTest: any) => {
          const matchingTest = tests.find((test) => test._id === userTest.testId)
          if (matchingTest && statuses[userTest.testId]) {
            const currentStatus = statuses[userTest.testId]
            if (currentStatus.status === "passed") return
            if (userTest.status === "passed") {
              statuses[userTest.testId] = {
                status: userTest.status,
                score: userTest.score,
                attemptNo: userTest.attemptNo,
              }
            } else if (
              userTest.status === "failed" &&
              currentStatus.status === "not-attempted"
            ) {
              statuses[userTest.testId] = {
                status: userTest.status,
                score: userTest.score,
                attemptNo: userTest.attemptNo,
              }
            }
          }
        })
        setTestStatuses(statuses)
      } catch (error) {
        setTestStatuses({})
      } finally {
        setUserTestStatusLoading(false)
      }
    }
    fetchTestStatuses()
  }, [user?._id, tests])

  const handleStartTest = async (test: Test) => {
    setLoading(true)
    try {
      const fullTest = await getTestById(test._id)

      if (!fullTest.exercises || fullTest.exercises.length === 0) {
        alert(
          "This test has no exercises available. Please contact an administrator."
        )
        return
      }

      setCurrentTest(fullTest)
      setSelectedTest(test)
      setTestState("taking")
      setCurrentQuestionIndex(0)
      setAnswers({})
      setCompletedQuestions(0)
    } catch (error) {
      console.error("Failed to start test", error)
      alert("Failed to load test. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerSelect = (exerciseId: string, answer: string) => {
    setAnswers((prev) => {
      if (!answer.trim()) {
        const { [exerciseId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [exerciseId]: [answer] };
    });
  }

  const handleMultipleChoiceSelect = (exerciseId: string, selectedOptions: string[]) => {
    setAnswers((prev) => {
      if (!selectedOptions.length) {
        const { [exerciseId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [exerciseId]: selectedOptions };
    });
  }

  const handleNext = () => {
    // Mark current question as completed when user presses Next
    if (currentQuestionIndex < (currentTest?.exercises?.length || 0) - 1) {
      // Mark the current question as completed
      setCompletedQuestions(prev => Math.max(prev, currentQuestionIndex + 1))
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  const handleSubmitTest = async () => {
    if (!currentTest || !user?._id) return

    setIsSubmitting(true)
    try {
      // Get the exercise IDs that are actually in the test
      const testExerciseIds = currentTest.exercises?.map(ex => ex._id) || []
      
      // Filter answers to only include exercises that are in the test
      const validAnswers = Object.entries(answers)
        .filter(([exerciseId]) => testExerciseIds.includes(exerciseId))
        .map(([exerciseId, selectedAnswers]) => ({
          exerciseId,
          selectedAnswers,
        }))

      const submissionData = {
        testId: currentTest._id,
        userId: user._id,
        answers: validAnswers,
      }

      const result = await submitTest(submissionData)
      setTestResult(result)
      setTestState("completed")
      
      // Notify parent component if test was passed
      if (result.status === "passed" && onTestCompleted) {
        onTestCompleted()
      }
    } catch (error: any) {
      console.error("Failed to submit test", error)
      console.error("Error details:", error.response?.data)
      alert(`Failed to submit test: ${error.response?.data?.message || error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRetakeTest = () => {
    setTestState("selecting")
    setSelectedTest(null)
    setCurrentTest(null)
    setCurrentQuestionIndex(0)
    setAnswers({})
    setCompletedQuestions(0)
    setTestResult(null)
  }

  const handleStartLearning = () => {
    // Find the first incomplete lesson
    const firstIncompleteLesson = memoizedAllLessonIds.find(lessonId => !lessonCompletionStatus[lessonId])
    
    if (firstIncompleteLesson && onNavigateToLesson) {
      onNavigateToLesson(firstIncompleteLesson)
    }
  }

  // Wait for all loading to finish before rendering anything
  if (checkingCompletion || loading || userTestStatusLoading) {
    return (
      <ContentSlideIn
        keyValue={`${lessonId}-checking-completion`}
        isLoading={true}
        direction="bottom"
        loadingComponent={
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#4CC2FF]"></div>
          </div>
        }
      >
        <p className="text-gray-500">Checking lesson completion...</p>
      </ContentSlideIn>
    )
  }

  // Show message if not all lessons are completed
  if (!areAllLessonsCompleted) {
    return (
      <LessonCompletionWarning
        lessonId={lessonId}
        onStartLearning={handleStartLearning}
      />
    )
  }

  // Test selection screen
  if (testState === "selecting") {
    return (
      <TestSelection
        lessonId={lessonId}
        tests={tests}
        onStartTest={handleStartTest}
        loading={false}
        testStatuses={testStatuses}
        statusLoading={userTestStatusLoading}
      />
    )
  }

  // Test taking screen
  if (testState === "taking" && currentTest) {
    return (
      <TestTaking
        lessonId={lessonId}
        test={currentTest}
        currentQuestionIndex={currentQuestionIndex}
        answers={answers}
        completedQuestions={completedQuestions}
        onAnswerSelect={handleAnswerSelect}
        onMultipleChoiceSelect={handleMultipleChoiceSelect}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onSubmit={handleSubmitTest}
        isSubmitting={isSubmitting}
      />
    )
  }

  // Test results screen
  if (testState === "completed" && testResult) {
    return (
      <TestResults
        lessonId={lessonId}
        testResult={testResult}
        onRetake={handleRetakeTest}
      />
    )
  }

  return (
    <ContentSlideIn
      keyValue={`${lessonId}-error`}
      isLoading={false}
      direction="bottom"
    >
      <p className="text-gray-500">Something went wrong.</p>
    </ContentSlideIn>
  )
}
