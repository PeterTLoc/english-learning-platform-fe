"use client"

import LessonContent from "@/components/lesson/LessonContent"
import LessonSidebar from "@/components/lesson/LessonSidebar"
import LessonOverview from "@/components/lesson/LessonOverview"
import CourseInfoModal from "@/components/course/CourseInfoModal"
import { useEffect, useState } from "react"
import { Course } from "@/types/course/course"
import { getAllLessonsByCourseId } from "@/services/lessonService"
import { parseAxiosError } from "@/utils/apiErrors"
import { Lesson } from "@/types/lesson/lesson"
import TestContent from "@/components/lesson-content/TestContent"
import { ChevronRight, Info } from "lucide-react"
import { useSearchParams } from "next/navigation"

interface CourseDetailProps {
  course: Course
}

// Define available lesson content types
const LESSON_CONTENT_TYPES = {
  OVERVIEW: "overview",
  VOCABULARY: "Vocabulary",
  GRAMMAR: "Grammar", 
  EXERCISE: "Exercise",
  TEST: "Test"
} as const

type ContentType = typeof LESSON_CONTENT_TYPES[keyof typeof LESSON_CONTENT_TYPES]

interface CurrentView {
  lessonId: string | null
  contentType: ContentType
}

export default function CourseDetail({ course }: CourseDetailProps) {
  const searchParams = useSearchParams()
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [currentView, setCurrentView] = useState<CurrentView>({
    lessonId: null,
    contentType: LESSON_CONTENT_TYPES.OVERVIEW
  })
  const [loading, setLoading] = useState(true)
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false)
  const [sidebarKey, setSidebarKey] = useState(0) // Force sidebar refresh
  const [sidebarRefreshKey, setSidebarRefreshKey] = useState(0)

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const data = await getAllLessonsByCourseId(course._id)
        setLessons(data)

        // Check URL parameters for initial view
        const lessonParam = searchParams.get('lesson')
        const testParam = searchParams.get('test')

        if (testParam === 'true') {
          // Navigate to test
          setCurrentView({
            lessonId: "test",
            contentType: LESSON_CONTENT_TYPES.TEST
          })
        } else if (lessonParam) {
          // Navigate to specific lesson
          const lessonExists = data.find(l => l._id === lessonParam)
          if (lessonExists) {
            setCurrentView({
              lessonId: lessonParam,
              contentType: LESSON_CONTENT_TYPES.OVERVIEW
            })
          } else if (data.length > 0) {
            // Fallback to first lesson if specified lesson doesn't exist
            setCurrentView({
              lessonId: data[0]._id,
              contentType: LESSON_CONTENT_TYPES.OVERVIEW
            })
          }
        } else if (data.length > 0 && !currentView.lessonId) {
          // Default to first lesson overview
          setCurrentView({
            lessonId: data[0]._id,
            contentType: LESSON_CONTENT_TYPES.OVERVIEW
          })
        }
      } catch (error) {
        const parsed = parseAxiosError(error)
        console.error("Failed to fetch lessons:", parsed.message)
        throw new Error(parsed.message)
      } finally {
        setLoading(false)
      }
    }

    fetchLessons()
  }, [course._id, searchParams])

  // Navigation handlers
  const navigateToLesson = (lessonId: string | null) => {
    if (lessonId) {
      setCurrentView({
        lessonId,
        contentType: LESSON_CONTENT_TYPES.OVERVIEW
      })
    }
  }

  const navigateToContent = (contentType: string) => {
    if (currentView.lessonId) {
      setCurrentView(prev => ({
        ...prev,
        contentType: contentType as ContentType
      }))
    }
  }

  const navigateToTest = () => {
    setCurrentView({
      lessonId: "test",
      contentType: LESSON_CONTENT_TYPES.TEST
    })
  }

  const handleTestCompleted = () => {
    // Force sidebar to refresh by changing its key
    setSidebarKey(prev => prev + 1)
  }

  // Get current lesson data
  const currentLesson = lessons.find(l => l._id === currentView.lessonId)

  // Render content based on current view
  const renderContent = () => {
    // Test view
    if (currentView.contentType === LESSON_CONTENT_TYPES.TEST) {
      return <TestContent 
        lessonId={lessons[0]?._id || ""} 
        allLessonIds={lessons.map(lesson => lesson._id)}
        onNavigateToLesson={navigateToLesson}
        onTestCompleted={handleTestCompleted}
      />
    }

    // Lesson overview
    if (currentLesson && currentView.contentType === LESSON_CONTENT_TYPES.OVERVIEW) {
      return (
        <LessonOverview
          key={currentView.lessonId + '-' + currentView.contentType}
          lesson={currentLesson}
          onNavigateToTab={navigateToContent}
        />
      )
    }

    // Specific lesson content
    if (currentLesson && currentView.contentType !== LESSON_CONTENT_TYPES.OVERVIEW) {
      return (
        <LessonContent 
          lesson={currentLesson} 
          tab={currentView.contentType} 
          setSidebarRefreshKey={setSidebarRefreshKey}
        />
      )
    }

    return <p className="text-gray-500">Select a lesson to get started.</p>
  }

  // Get breadcrumb title
  const getBreadcrumbTitle = () => {
    if (currentView.contentType === LESSON_CONTENT_TYPES.TEST) {
      return "Test"
    }

    if (currentLesson) {
      if (currentView.contentType === LESSON_CONTENT_TYPES.OVERVIEW) {
        return currentLesson.name
      }
      
      return (
        <div className="flex items-center gap-3">
          <span 
            className="subtext hover:text-white cursor-pointer transition-colors duration-150"
            onClick={() => navigateToContent(LESSON_CONTENT_TYPES.OVERVIEW)}
          >
            {currentLesson.name}
          </span>
          <ChevronRight size={20} strokeWidth={3} className="subtext"/>
          <span>{currentView.contentType}</span>
        </div>
      )
    }

    return null
  }

  return (
    <div className="mt-5 flex">
      <LessonSidebar
        key={sidebarKey}
        lessons={lessons}
        openLessonId={currentView.lessonId}
        onLessonClick={navigateToLesson}
        onTestClick={navigateToTest}
        isLoading={loading}
        refreshKey={sidebarRefreshKey}
      />

      <div className="px-5 flex-1 mt-5">
        <div className="max-w-[1000px] mx-auto">
          <div className="flex items-center justify-between mb-3">
            <h1 className="title">
              {getBreadcrumbTitle()}
            </h1>

            <button
              onClick={() => setIsInfoModalOpen(true)}
              className="flex gap-4 items-center hover:bg-[#2D2D2D] px-2 pt-[6px] pb-[7px] rounded-[5px]"
            >
              <Info size={20} className="text-[#4CC2FF]"/>
              <div className="text-left">
                <p className="text-sm mb-[3px]">Info</p>
                <p className="text-xs subtext">Course information</p>
              </div>
            </button>
          </div>

          {renderContent()}
        </div>
      </div>

      <CourseInfoModal
        course={course}
        lessons={lessons}
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
      />
    </div>
  )
}
