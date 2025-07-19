"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  getTestsByLessonId,
  getTestById,
  submitTest,
  TestSubmissionResponse,
} from "@/services/testService";
import { Test } from "@/types/course/test";
import ContentSlideIn from "@/components/ui/ContentSlideIn";
import { getUserExercisesByLessonId } from "@/services/userExerciseService";
import { getAllExercisesByLessonId } from "@/services/lessonService";

import { getUserTests } from "@/services/userTestService";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getUserLessonByLessonId } from "@/services/userLessonService";
import { getAllLessonsByCourseId } from "@/services/lessonService";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import TestResults from "./TestResults";
import LessonCompletionWarning from "./LessonCompletionWarning";
import TestTaking from "./TestTaking";
import { useToast } from "@/context/ToastContext";
import { AxiosError } from "axios";
interface TestContentProps {
  courseId: string;
  lessonId: string; // this is testId
  onNavigateToLesson?: (lessonId: string) => void;
  onTestCompleted?: () => void;
}

type TestState = "selecting" | "taking" | "completed";

export default function TestContent({
  courseId,
  lessonId,
  onNavigateToLesson,
  onTestCompleted,
}: TestContentProps) {
  const { user } = useAuth();
  const [test, setTest] = useState<any>(null);
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [currentTest, setCurrentTest] = useState<Test | null>(null);
  const [testState, setTestState] = useState<TestState>("selecting");
  const [loading, setLoading] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [completedQuestions, setCompletedQuestions] = useState<number>(0);
  const [testResult, setTestResult] = useState<TestSubmissionResponse | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completionStatus, setCompletionStatus] = useState<null | boolean>(
    null
  );
  const [lessonCompletionStatus, setLessonCompletionStatus] = useState<
    Record<string, boolean>
  >({});
  const [userTestStatusLoading, setUserTestStatusLoading] = useState(true);
  const [testStatuses, setTestStatuses] = useState({});
  const [testName, setTestName] = useState("");
  const [allLessonIds, setAllLessonIds] = useState<string[]>([]);
  const [forceRetake, setForceRetake] = useState(false);

  const { showToast } = useToast();
  // Memoize allLessonIds to prevent unnecessary re-renders
  const memoizedAllLessonIds = useMemo(
    () => allLessonIds,
    [allLessonIds.join(",")]
  );

  // Fetch test info on mount
  useEffect(() => {
    async function fetchTest() {
      try {
        const fetchedTest = await getTestById(lessonId);
        setTest(fetchedTest);
        setTestName(fetchedTest.name || "");
        setAllLessonIds(fetchedTest.lessonIds || []);
      } catch (err) {
        if (err instanceof AxiosError && err.response?.status === 403) {
          setCompletionStatus(false);
          setLoading(false);

          setUserTestStatusLoading(false);
          setCompletionStatus(false);
          setTestName("failed");
        } else {
          setTest(null);
          setTestName("failed");
          setAllLessonIds([]);
          showToast(
            err instanceof AxiosError
              ? err.response?.data?.message
              : "Failed to fetch test",
            "error"
          );
          setLoading(false);

          setUserTestStatusLoading(false);
          setCompletionStatus(false);
          setTestName("");
        }
      }
    }
    fetchTest();
  }, [lessonId]);

  // Efficient lesson completion check
  useEffect(() => {
    let isMounted = true;
    const checkAllLessonsCompletion = async () => {
      if (!user?._id || !courseId || allLessonIds.length === 0) {
        if (isMounted) {
          setCompletionStatus(false);
        }
        return;
      }
      try {
        // For each lessonId, check completion using getUserLessonByLessonId
        const results = await Promise.all(
          allLessonIds.map(async (lessonId) => {
            try {
              const res = await getUserLessonByLessonId(lessonId);
              return { lessonId, status: res.userLesson.status };
            } catch {
              return { lessonId, status: null };
            }
          })
        );
        const completionStatusObj: Record<string, boolean> = {};
        let allCompleted = true;
        for (const { lessonId, status } of results) {
          const isLessonCompleted = status === "completed";
          completionStatusObj[lessonId] = isLessonCompleted;
          if (!isLessonCompleted) allCompleted = false;
        }
        if (isMounted) {
          setLessonCompletionStatus(completionStatusObj);
          setCompletionStatus(allCompleted);
        }
      } catch (error) {
        if (isMounted) {
          setCompletionStatus(false);
        }
      }
    };
    setCompletionStatus(null); // set to null before starting check
    checkAllLessonsCompletion();
    return () => {
      isMounted = false;
    };
  }, [user?._id, courseId, allLessonIds]);

  // When all lessons are completed and test is loaded, start the test automatically
  useEffect(() => {
    if (completionStatus === true && test && testState === "selecting") {
      setCurrentTest(test);
      setTestState("taking");
      setCurrentQuestionIndex(0);
      setAnswers({});
      setCompletedQuestions(0);
    }
  }, [completionStatus, test, testState]);

  // Remove any useEffect or logic that calls getTestsByLessonId
  // Use the fetched test object for all test logic below
  // For example, use test.exercises, testName, etc.

  // Fetch user test statuses when tests are loaded
  useEffect(() => {
    const fetchTestStatuses = async () => {
      if (!user?._id || !test) {
        setUserTestStatusLoading(false);
        setTestStatuses({});
        return;
      }
      try {
        const response = await getUserTests(user._id);
        const userTests = response.data || [];
        const statuses: Record<string, any> = {};
        // Assuming test._id is the testId for user tests
        statuses[test._id] = { status: "not-attempted" };
        userTests.forEach((userTest: any) => {
          const matchingTest = test && userTest.testId === test._id;
          if (matchingTest && statuses[userTest.testId]) {
            const currentStatus = statuses[userTest.testId];
            if (currentStatus.status === "passed") return;
            if (userTest.status === "passed") {
              statuses[userTest.testId] = {
                status: userTest.status,
                score: userTest.score,
                attemptNo: userTest.attemptNo,
              };
            } else if (
              userTest.status === "failed" &&
              currentStatus.status === "not-attempted"
            ) {
              statuses[userTest.testId] = {
                status: userTest.status,
                score: userTest.score,
                attemptNo: userTest.attemptNo,
              };
            }
          }
        });
        setTestStatuses(statuses);
      } catch (error) {
        setTestStatuses({});
      } finally {
        setUserTestStatusLoading(false);
      }
    };
    fetchTestStatuses();
  }, [user?._id, test]);

  const handleStartTest = async (test: Test) => {
    setLoading(true);
    try {
      const fullTest = await getTestById(test._id);

      if (!fullTest.exercises || fullTest.exercises.length === 0) {
        showToast(
          "This test has no exercises available. Please contact an administrator.",
          "error"
        );
        return;
      }

      setCurrentTest(fullTest);
      setSelectedTest(test);
      setTestState("taking");
      setCurrentQuestionIndex(0);
      setAnswers({});
      setCompletedQuestions(0);
    } catch (error) {
      console.error("Failed to start test", error);
      showToast("Failed to load test. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (exerciseId: string, answer: string) => {
    setAnswers((prev) => {
      if (!answer.trim()) {
        const { [exerciseId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [exerciseId]: [answer] };
    });
  };

  const handleMultipleChoiceSelect = (
    exerciseId: string,
    selectedOptions: string[]
  ) => {
    setAnswers((prev) => {
      if (!selectedOptions.length) {
        const { [exerciseId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [exerciseId]: selectedOptions };
    });
  };

  const handleNext = () => {
    // Mark current question as completed when user presses Next
    if (currentQuestionIndex < (currentTest?.exercises?.length || 0) - 1) {
      // Mark the current question as completed
      setCompletedQuestions((prev) => Math.max(prev, currentQuestionIndex + 1));
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmitTest = async () => {
    if (!currentTest || !user?._id) return;

    setIsSubmitting(true);
    try {
      // Get the exercise IDs that are actually in the test
      const testExerciseIds = currentTest.exercises?.map((ex) => ex._id) || [];

      // Filter answers to only include exercises that are in the test
      const validAnswers = Object.entries(answers)
        .filter(([exerciseId]) => testExerciseIds.includes(exerciseId))
        .map(([exerciseId, selectedAnswers]) => ({
          exerciseId,
          selectedAnswers,
        }));

      const submissionData = {
        testId: currentTest._id,
        userId: user._id,
        answers: validAnswers,
      };

      const result = await submitTest(submissionData);
      setTestResult(result);
      setTestState("completed");
      setForceRetake(false);

      // Notify parent component if test was passed
      if (result.status === "passed" && onTestCompleted) {
        onTestCompleted();
      }
    } catch (error: any) {
      console.error("Failed to submit test", error);
      console.error("Error details:", error.response?.data);
      alert(
        `Failed to submit test: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetakeTest = () => {
    setTestState("selecting");
    setSelectedTest(null);
    setCurrentTest(null);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setCompletedQuestions(0);
    setTestResult(null);
    setForceRetake(true);
  };

  const handleStartLearning = () => {
    // Find the first incomplete lesson
    const firstIncompleteLesson = memoizedAllLessonIds.find(
      (lessonId) => !lessonCompletionStatus[lessonId]
    );

    if (firstIncompleteLesson && onNavigateToLesson) {
      onNavigateToLesson(firstIncompleteLesson);
    }
  };

  // Calculate progress for the test
  const totalQuestions = currentTest?.exercises?.length || 0;
  const completedQuestionsCount = Object.keys(answers).length;
  const percent =
    totalQuestions > 0
      ? Math.round((completedQuestionsCount / totalQuestions) * 100)
      : 0;

  // Spinner is shown while completionStatus is null
  if (
    completionStatus === null ||
    loading ||
    userTestStatusLoading ||
    !testName
  ) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 h-full">
        <LoadingSpinner size="medium" />
        <p className="text-lg">Loading test...</p>
      </div>
    );
  }
  // Breadcrumb at the top
  const breadcrumb = (
    <div className="title flex items-center gap-5 mb-4">{testName}</div>
  );

  // Check if test is already passed
  const typedTestStatuses = testStatuses as Record<
    string,
    { status: "passed" | "failed"; score?: number; attemptNo?: number }
  >;
  const isTestPassed =
    typedTestStatuses &&
    test &&
    typedTestStatuses[test._id]?.status === "passed";

  // If test is passed and no testResult, show a minimal TestResults screen
  if (isTestPassed && !testResult && !forceRetake) {
    const minimalResult = {
      id: test?._id || "",
      userId: user?._id || "",
      testId: test?._id || "",
      attemptNo: typedTestStatuses[test._id]?.attemptNo ?? 1,
      score: typedTestStatuses[test._id]?.score ?? 100,
      status: "passed" as "passed",
      description: "You have already passed this test.",
      submittedAt: "",
      results: [],
    } as import("@/services/testService").TestSubmissionResponse;
    return (
      <>
        {breadcrumb}
        <TestResults
          lessonId={lessonId}
          testResult={minimalResult}
          onRetake={handleRetakeTest}
        />
      </>
    );
  }
  // Warning is only shown if completionStatus is false
  if (completionStatus === false) {
    return (
      <>
        {breadcrumb}
        <LessonCompletionWarning
          lessonId={lessonId}
          onStartLearning={handleStartLearning}
        />
      </>
    );
  }

  // Remove test selection screen, always go straight to test taking
  if (testState === "taking" && currentTest) {
    return (
      <>
        {breadcrumb}
        <TestTaking
          lessonId={lessonId}
          test={currentTest}
          currentQuestionIndex={currentQuestionIndex}
          answers={answers}
          completedQuestions={completedQuestionsCount}
          onAnswerSelect={handleAnswerSelect}
          onMultipleChoiceSelect={handleMultipleChoiceSelect}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onSubmit={handleSubmitTest}
          isSubmitting={isSubmitting}
        />
      </>
    );
  }

  // Test results screen
  if (testState === "completed" && testResult) {
    return (
      <>
        {breadcrumb}
        <TestResults
          lessonId={lessonId}
          testResult={testResult}
          onRetake={handleRetakeTest}
        />
      </>
    );
  }

  return (
    <>
      {breadcrumb}
      <ContentSlideIn
        keyValue={`${lessonId}-error`}
        isLoading={false}
        direction="bottom"
      >
        <p className="text-gray-500">Something went wrong.</p>
      </ContentSlideIn>
    </>
  );
}
