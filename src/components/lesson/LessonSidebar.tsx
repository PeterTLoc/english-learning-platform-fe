import { Lesson } from "@/types/lesson/lesson"
import { motion } from "framer-motion"
import { GraduationCap, PenTool, BookOpen, ClipboardCheck, FileCheck } from "lucide-react"
import { useEffect, useState, useMemo } from "react"
import { useAuth } from "@/context/AuthContext"
import { getUserExercisesByLessonId } from "@/services/userExerciseService"
import { getAllExercisesByLessonId } from "@/services/lessonService"
import { getUserTests } from "@/services/userTestService"
import { getTestsByLessonId } from "@/services/testService"

interface SidebarProps {
  lessons: Lesson[]
  openLessonId: string | null
  onLessonClick: (lessonId: string) => void
  onTestClick: () => void
  isLoading?: boolean
  refreshKey?: number
}

// Icon mapping for each tab
const getTabIcon = (tab: string, isActive: boolean = false) => {
  const iconClass = isActive ? "text-white" : "text-gray-400"
  
  switch (tab) {
    case "Vocabulary":
      return <BookOpen size={20} className={iconClass} />
    case "Grammar":
      return <PenTool size={20} className={iconClass} />
    case "Exercise":
      return <ClipboardCheck size={20} className={iconClass} />
    case "Test":
      return <FileCheck size={20} className={iconClass} />
    default:
      return <GraduationCap size={20} className={iconClass} />
  }
}

export default function LessonSidebar({
  lessons,
  openLessonId,
  onLessonClick,
  onTestClick,
  isLoading = false,
  refreshKey,
}: SidebarProps) {
  const { user } = useAuth()
  const [lessonCompletion, setLessonCompletion] = useState<Record<string, boolean>>({})
  const [testCompleted, setTestCompleted] = useState(false)
  const [completionLoading, setCompletionLoading] = useState(true)

  // Memoize lessons to prevent unnecessary re-renders
  const memoizedLessons = useMemo(() => lessons, [lessons.map(l => l._id).join(',')])

  // Check completion status for all lessons and tests
  useEffect(() => {
    let isMounted = true

    const checkAllCompletion = async () => {
      // Don't start completion check until parent loading is done
      if (isLoading) {
        return
      }

      if (!user?._id || memoizedLessons.length === 0) {
        if (isMounted) {
          setCompletionLoading(false)
        }
        return
      }

      const completionStatus: Record<string, boolean> = {}

      try {
        // Check lesson completion
        for (const lesson of memoizedLessons) {
          // Get all exercises for this lesson
          const allExercises = await getAllExercisesByLessonId(lesson._id)

          if (allExercises.length === 0) {
            completionStatus[lesson._id] = false
            continue
          }

          // Get user exercises for this lesson
          const userExercises = await getUserExercisesByLessonId(user._id, lesson._id)

          // Check if all exercises are completed
          const completedExercises = userExercises.filter(
            (userExercise: any) => userExercise.completed
          )

          completionStatus[lesson._id] = completedExercises.length === allExercises.length
        }

        // Check test completion - need ALL tests to be passed
        let allTestsPassed = false
        
        try {
          // First, get all available tests for the first lesson
          const availableTests = await getTestsByLessonId(memoizedLessons[0]?._id || '')
          
          if (availableTests.length === 0) {
            // No tests available, so nothing to pass
            allTestsPassed = false
          } else {
            // Get user's test attempts
            const response = await getUserTests(user._id)
            const userTests = response.data || []
            
            // Create a map of test IDs that have been passed
            const passedTestIds = new Set()
            userTests.forEach((userTest: any) => {
              if (userTest.status === 'passed') {
                passedTestIds.add(userTest.testId)
              }
            })
            
            // Check if ALL available tests have been passed
            const allAvailableTestIds = availableTests.map((test: any) => test._id)
            allTestsPassed = allAvailableTestIds.every(testId => passedTestIds.has(testId))
          }
        } catch (error) {
          console.error('Failed to check test completion in sidebar:', error)
          allTestsPassed = false
        }

        if (isMounted) {
          setLessonCompletion(completionStatus)
          setTestCompleted(allTestsPassed)
        }
      } catch (error) {
        console.error("Failed to check completion:", error)
      } finally {
        if (isMounted) {
          setCompletionLoading(false)
        }
      }
    }

    checkAllCompletion()

    return () => {
      isMounted = false
    }
  }, [user?._id, memoizedLessons, isLoading, refreshKey])

  const getLessonIconContainer = (lessonId: string) => {
    const isCompleted = lessonCompletion[lessonId]
    
    if (isCompleted) {
      return "w-5 h-5 rounded-full flex items-center justify-center bg-green-500"
    }
    
    return "w-5 h-5 rounded-full flex items-center justify-center bg-[#666666]"
  }

  // Show loading spinner when parent is loading or completion check is running
  if (isLoading || completionLoading) {
    return (
      <div className="px-5 mt-5">
        <div className="w-[280px] flex flex-col gap-5">
          <div className="flex justify-center items-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4CC2FF] mx-auto mb-3"></div>
              <p className="text-gray-400 text-xs">
                {isLoading ? "Loading lessons..." : "Checking progress..."}
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="px-5 mt-5">
      <div className="w-[280px] flex flex-col gap-5">
      <div>
        {/* Lesson Tabs */}
        {lessons.map((lesson) => {
          const isActive = openLessonId === lesson._id

          return (
            <div key={lesson._id} className="mb-1">
              <div className="relative">
                {/* Animated active bar for lesson tab */}
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute left-0 top-0 h-full w-[3px] bg-[#4CC2FF]"
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30,
                    }}
                  />
                )}

                {/* Lesson tab button */}
                <button
                  className={`flex items-center gap-4 h-9 rounded-[5px] px-3 pl-3 text-[13px] text-left w-full ${
                    isActive
                      ? "bg-[#3A3A3A] text-white"
                      : "text-gray-300 hover:bg-[#2D2D2D]"
                  }`}
                  onClick={() => onLessonClick(lesson._id)}
                >
                  <div className={getLessonIconContainer(lesson._id)}>
                    <GraduationCap size={14} className="text-white" />
                  </div>
                  <span className="mt-[3px]">{lesson.name}</span>
                </button>
              </div>
            </div>
          )
        })}

        {/* Test Section - Single tab for all lessons */}
        <div className="mb-1">
          <div className="relative">
            {/* Animated active bar for test tab */}
            {openLessonId === "test" && (
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute left-0 top-0 h-full w-[3px] bg-[#4CC2FF]"
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                }}
              />
            )}

            <button
              className={`flex items-center gap-4 h-9 rounded-[5px] px-3 pl-3 text-[13px] text-left w-full ${
                openLessonId === "test"
                  ? "bg-[#3A3A3A] text-white"
                  : "text-gray-300 hover:bg-[#2D2D2D]"
              }`}
              onClick={onTestClick}
            >
              <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                testCompleted ? "bg-green-500" : "bg-[#666666]"
              }`}>
                <FileCheck size={14} className="text-white" />
              </div>
              <span className="mt-[3px]">Test</span>
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}
