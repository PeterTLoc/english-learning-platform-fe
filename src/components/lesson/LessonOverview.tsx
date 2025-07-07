"use client"

import { Lesson } from "@/types/lesson/lesson"
import { BookOpen, PenTool, ClipboardCheck, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"
import { useEffect, useState, useRef } from "react"
import { useAuth } from "@/context/AuthContext"
import { getUserExercisesByLessonId } from "@/services/userExerciseService"
import { getAllExercisesByLessonId } from "@/services/lessonService"

interface LessonOverviewProps {
  lesson: Lesson
  onNavigateToTab: (tab: string) => void
}

// Tab configuration for lesson overview
const TAB_CONFIG = {
  Vocabulary: {
    icon: BookOpen,
    description: "Learn new words and phrases",
    color: "bg-transparent border border-white",
    size: 20,
    hasBackground: false
  },
  Grammar: {
    icon: PenTool,
    description: "Study language structure and rules",
    color: "bg-transparent border border-white",
    size: 20,
    hasBackground: false
  },
  Exercise: {
    icon: ClipboardCheck,
    description: "Practice what you've learned",
    color: "bg-[#666666]",
    size: 16,
    hasBackground: true
  }
} as const

export default function LessonOverview({
  lesson,
  onNavigateToTab,
}: LessonOverviewProps) {
  const { user } = useAuth()
  const [isExerciseCompleted, setIsExerciseCompleted] = useState(false)
  const [loading, setLoading] = useState(true)

  // Check if all exercises are completed for this lesson
  useEffect(() => {
    const checkExerciseCompletion = async () => {
      setLoading(true)

      if (!user?._id) {
        setLoading(false)
        return
      }

      try {
        // Get all exercises for this lesson
        const allExercises = await getAllExercisesByLessonId(lesson._id)

        if (allExercises.length === 0) {
          setIsExerciseCompleted(false)
          setLoading(false)
          return
        }

        // Get user exercises for this lesson
        const userExercises = await getUserExercisesByLessonId(
          user._id,
          lesson._id
        )

        // Check if all exercises are completed
        const completedExercises = userExercises.filter(
          (userExercise: any) => userExercise.completed
        )

        setIsExerciseCompleted(
          completedExercises.length === allExercises.length
        )
      } catch (error) {
        console.error("Failed to check exercise completion:", error)
        setIsExerciseCompleted(false)
      } finally {
        setLoading(false)
      }
    }

    checkExerciseCompletion()
  }, [user?._id, lesson._id])

  const getTabConfig = (tab: string) => {
    const config = TAB_CONFIG[tab as keyof typeof TAB_CONFIG]
    if (!config) return null
    
    // Handle Exercise completion state
    if (tab === "Exercise") {
      return {
        ...config,
        color: isExerciseCompleted ? "bg-green-500" : config.color
      }
    }
    
    return config
  }

  const getTabIconContainer = (tab: string) => {
    const config = getTabConfig(tab)
    if (!config) return "flex items-center justify-center"
    
    if (config.hasBackground) {
      return `w-6 h-6 rounded-full flex items-center justify-center ${config.color}`
    }
    
    return "flex items-center justify-center"
  }

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#4CC2FF]"></div>
        </div>
      ) : (
        <motion.div
          key={lesson._id}
          className="max-w-[1000px] mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.3,
            ease: "easeOut",
          }}
        >
          <div className="flex flex-col gap-1">
            {/* Knowledge subtitle above Vocabulary and Grammar */}
            <div className="subtitle-top">Knowledge</div>
            {Object.entries(TAB_CONFIG).map(([tab, baseConfig], idx) => {
              // Insert Practice subtitle before Exercise
              if (tab === "Exercise") {
                return (
                  <>
                    <div className="subtitle">Practice</div>
                    <li key={tab} className="flex flex-col gap-1">
                      <button
                        onClick={() => onNavigateToTab(tab)}
                        className="bg-[#2B2B2B] border border-[#1D1D1D] p-5 rounded-[5px] flex items-center gap-5 h-[69px] w-full hover:bg-[#3B3B3B] transition-colors duration-150 group"
                      >
                        <div className={getTabIconContainer(tab)}>
                          <baseConfig.icon size={getTabConfig(tab)?.size} className="text-white" />
                        </div>
                        <div className="text-left">
                          <p className="text-sm text-white">{tab}</p>
                          <p className="text-xs subtext">{baseConfig.description}</p>
                        </div>
                        <div className="ml-auto flex items-center gap-3">
                          <ChevronRight size={20} />
                        </div>
                      </button>
                    </li>
                  </>
                )
              }
              // Render Vocabulary and Grammar as usual
              return (
                <li key={tab} className="flex flex-col gap-1">
                  <button
                    onClick={() => onNavigateToTab(tab)}
                    className="bg-[#2B2B2B] border border-[#1D1D1D] p-5 rounded-[5px] flex items-center gap-5 h-[69px] w-full hover:bg-[#3B3B3B] transition-colors duration-150 group"
                  >
                    <div className={getTabIconContainer(tab)}>
                      <baseConfig.icon size={getTabConfig(tab)?.size} className="text-white" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm text-white">{tab}</p>
                      <p className="text-xs subtext">{baseConfig.description}</p>
                    </div>
                    <div className="ml-auto flex items-center gap-3">
                      <ChevronRight size={20} />
                    </div>
                  </button>
                </li>
              )
            })}
          </div>
        </motion.div>
      )}
    </>
  )
}
