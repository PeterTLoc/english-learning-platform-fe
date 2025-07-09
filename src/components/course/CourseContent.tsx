"use client"
import { useEffect, useState } from "react"
import {
  getLessonById,
  getAllExercisesByLessonId,
  getAllLessonsByCourseId,
} from "@/services/lessonService"
import { getUserExercisesByLessonId } from "@/services/userExerciseService"
import { getCourseById } from "@/services/courseService"
import Link from "next/link"
import LoadingSpinner from "@/components/ui/LoadingSpinner"
import { BookOpen, FileText, Dumbbell, ChevronRight, Info } from "lucide-react"
import { motion } from "framer-motion"
import { useAuth } from "@/context/AuthContext"
import CourseInfoModal from "@/components/course/CourseInfoModal"
import { toast } from "react-toastify"
import {
  getUserLessonByLessonId,
  updateUserLesson,
} from "@/services/userLessonService"
import { useSidebarRefresh } from "@/context/SidebarRefreshContext"
import { useCourse } from "@/context/CourseContext"
import { useRouter } from "next/navigation"


interface LessonOverviewProps {
  courseId: string
  lessonId: string
}

export default function LessonOverview({
  courseId,
  lessonId,
}: LessonOverviewProps) {
  const { userCourses } = useCourse()
  const router = useRouter()
  const [lesson, setLesson] = useState<{ name: string } | null>(null)
  const [isExerciseCompleted, setIsExerciseCompleted] = useState(false)
  const [exerciseLoading, setExerciseLoading] = useState(true)
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false)
  const [course, setCourse] = useState<any>(null)
  const [lessons, setLessons] = useState<any[]>([])
  const { user } = useAuth()
  const [isLessonCompleted, setIsLessonCompleted] = useState(false)
  const [marking, setMarking] = useState(false)
  const { refreshSidebar } = useSidebarRefresh()

  // Check if user is enrolled in this course
  useEffect(() => {
    if (userCourses && Object.keys(userCourses).length > 0) {
      const status = userCourses[courseId]?.status || ""
      const isEnrolled = ["ongoing", "completed"].includes(status)
      if (!isEnrolled) {
        router.push(`/courses/${courseId}/enroll`)
      }
    }
  }, [userCourses, courseId, router])

  useEffect(() => {
    getLessonById(lessonId).then(setLesson)
  }, [lessonId])

  useEffect(() => {
    async function checkCompleted() {
      setExerciseLoading(true)
      if (!user?._id) {
        setExerciseLoading(false)
        return
      }
      const allExercises = await getAllExercisesByLessonId(lessonId)
      const userExercises = await getUserExercisesByLessonId(user._id, lessonId)
      const completedIds = new Set(
        userExercises.filter((e) => e.completed).map((e) => e.exerciseId)
      )
      setIsExerciseCompleted(
        allExercises.length > 0 &&
          allExercises.every((e) => completedIds.has(e._id))
      )
      setExerciseLoading(false)
    }
    checkCompleted()
  }, [lessonId, user?._id])

  useEffect(() => {
    async function checkLessonCompleted() {
      if (!user?._id) return
      try {
        const res = await getUserLessonByLessonId(lessonId)
        setIsLessonCompleted(res.userLesson.status === "completed")
      } catch {
        setIsLessonCompleted(false)
      }
    }
    checkLessonCompleted()
  }, [lessonId, user?._id])

  const handleMarkAsCompleted = async () => {
    setMarking(true)
    try {
      const res = await getUserLessonByLessonId(lessonId)
      if (res.userLesson.status === "completed") {
        toast.info("Lesson already completed")
        setIsLessonCompleted(true)
        setMarking(false)
        return
      }
      await updateUserLesson(res.userLesson._id.toString(), "completed")
      toast.success("Lesson marked as completed")
      setIsLessonCompleted(true)
      refreshSidebar() // <-- trigger sidebar refresh
    } catch (error) {
      toast.error("Failed to mark lesson as completed")
    } finally {
      setMarking(false)
    }
  }

  useEffect(() => {
    async function fetchCourseAndLessons() {
      const [courseData, lessonsData] = await Promise.all([
        getCourseById(courseId),
        getAllLessonsByCourseId(courseId),
      ])
      setCourse(courseData)
      setLessons(lessonsData)
    }
    fetchCourseAndLessons()
  }, [courseId])

  //Loading spinner
  if (!lesson || exerciseLoading)
    return (
      <div className="mt-[74px]">
        <LoadingSpinner size="small" />
      </div>
    )

  //Content
  return (
    <>
      <h2 className="title">{lesson.name}</h2>
      <div className="flex justify-between items-center mb-[27px]">
        <button
          onClick={() => setIsInfoModalOpen(true)}
          className="flex gap-4 items-center hover:bg-[#2D2D2D] px-2 pt-[6px] pb-[7px] rounded-[5px]"
        >
          <Info size={20} className="text-[#4CC2FF]" />
          <div className="text-left">
            <p className="text-sm mb-[3px]">Info</p>
            <p className="text-xs subtext">Course information</p>
          </div>
        </button>
        <button
          className={`px-3 min-w-[130px] min-h-[32px] flex items-center justify-center rounded-[5px] text-sm
            ${
              !isLessonCompleted && !marking
                ? "text-black bg-[#4CC2FF] hover:bg-[#47B1E8] border border-[#5AC7FF]"
                : "text-[#AAAAAA] bg-[#373737] border border-[#3F3F3F]"
            }
          `}
          onClick={handleMarkAsCompleted}
          disabled={isLessonCompleted || marking}
        >
          {isLessonCompleted
            ? "Lesson already completed"
            : marking
            ? "Marking..."
            : "Mark as Completed"}
        </button>
      </div>
      <CourseInfoModal
        course={course}
        lessons={lessons}
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
      />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <ul className="flex flex-col gap-1">
          <li>
            <Link
              href={`/courses/${courseId}/lessons/${lessonId}/vocabulary`}
              className="container flex items-center h-[69px] px-5 justify-between hover:bg-[#323232] cursor-pointer"
            >
              <div className="flex items-center gap-5">
                <BookOpen size={20} />
                <div className="flex flex-col">
                  <span className="text-sm">Vocabulary</span>
                  <span className="text-xs subtext">
                    Practice and review key words for this lesson.
                  </span>
                </div>
              </div>
              <ChevronRight size={20} />
            </Link>
          </li>
          <li>
            <Link
              href={`/courses/${courseId}/lessons/${lessonId}/grammar`}
              className="container flex items-center h-[69px] px-5 justify-between hover:bg-[#323232] cursor-pointer"
            >
              <div className="flex items-center gap-5">
                <FileText size={20} />
                <div className="flex flex-col">
                  <span className="text-sm">Grammar</span>
                  <span className="text-xs subtext">
                    Learn the grammar rules for this lesson.
                  </span>
                </div>
              </div>
              <ChevronRight size={20} />
            </Link>
          </li>
          <li>
            <Link
              href={`/courses/${courseId}/lessons/${lessonId}/exercise`}
              className="container flex items-center h-[69px] px-5 justify-between hover:bg-[#323232] cursor-pointer"
            >
              <div className="flex items-center gap-5">
                <Dumbbell size={20} />
                <div className="flex flex-col">
                  <span className="text-sm">Exercise</span>
                  <span className="text-xs subtext">
                    Test your understanding with exercises.
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                  style={{
                    background: isExerciseCompleted
                      ? "rgba(34,197,94,0.12)"
                      : "rgba(170,170,170,0.12)",
                  }}
                >
                  <span
                    className={`inline-block w-2 h-2 rounded-full ${
                      isExerciseCompleted ? "bg-green-500" : "bg-[#AAAAAA]"
                    }`}
                  ></span>
                  {isExerciseCompleted ? "Completed" : "Ongoing"}
                </span>
                <ChevronRight size={20} />
              </div>
            </Link>
          </li>
        </ul>
      </motion.div>
    </>
  )
}
