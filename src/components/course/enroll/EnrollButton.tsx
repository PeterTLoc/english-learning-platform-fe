"use client"

import { useAuth } from "@/context/AuthContext"
import { enrollCourse } from "@/services/userCourseService"
import { useCourse } from "@/context/CourseContext"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { getAllLessonsByCourseId } from "@/services/lessonService"
import { useToast } from "@/context/ToastContext"
import LoadingSpinner from "@/components/ui/LoadingSpinner"
import { parseAxiosError } from "@/utils/apiErrors"
import { ArrowRight } from "lucide-react"

export default function EnrollButton({ courseId }: { courseId: string }) {
  const { user } = useAuth()
  const { userCourses, fetchAllCourses, setCourseStatus } = useCourse()
  const [loading, setLoading] = useState(false)
  const [checkingEnrollment, setCheckingEnrollment] = useState(true)
  const router = useRouter()
  const { showToast } = useToast()

  useEffect(() => {
    if (user && !userCourses[courseId]) {
      fetchAllCourses().finally(() => setCheckingEnrollment(false))
    } else {
      setCheckingEnrollment(false)
    }
  }, [user, courseId])

  const handleGoToCourse = async () => {
    try {
      const lessons = await getAllLessonsByCourseId(courseId)
      if (lessons && lessons.length > 0) {
        router.push(`/courses/${courseId}/lessons/${lessons[0]._id}`)
      } else {
        router.push(`/courses/${courseId}`)
      }
    } catch (err) {
      console.error("Failed to fetch lessons", err)
      router.push(`/courses/${courseId}`)
    }
  }

  const handleEnroll = async () => {
    if (!user?._id) return alert("You must be logged in to enroll.")
    setLoading(true)
    try {
      await enrollCourse(user._id, courseId)
      await fetchAllCourses()
      showToast("Enrollment success!", "success")
      handleGoToCourse()
    } catch (err) {
      const parsedError = parseAxiosError(err)
      showToast(parsedError.message || "Enrollment failed", "error")
    } finally {
      setLoading(false)
    }
  }

  const status = userCourses[courseId]?.status || ""
  const isEnrolled = ["ongoing", "completed"].includes(status)

  // Debug logs
  console.log("EnrollButton: userCourses", userCourses)
  console.log("EnrollButton: courseId", courseId, typeof courseId)
  console.log("EnrollButton: userCourses[courseId]", userCourses[courseId])

  if (checkingEnrollment) {
    return (
      <div className="flex justify-center items-center py-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#4CC2FF]"></div>
      </div>
    )
  }

  return isEnrolled ? (
    <button
      onClick={handleGoToCourse}
      className="button-shine relative w-[200px] h-[50px] rounded-[5px] font-bold flex items-center justify-center gap-2 text-black before:absolute before:inset-0 before:rounded-[5px] before:bg-[#4CC2FF] before:-z-10 bg-transparent border border-white/30 shadow-[0_4px_20px_rgba(76,194,255,0.3)]"
    >
      Go to Course
    </button>
  ) : (
    <button
      onClick={handleEnroll}
      disabled={loading}
      className={`button-shine relative w-[200px] h-[50px] rounded-[5px] font-bold flex items-center justify-center gap-2 before:absolute before:inset-0 before:rounded-[5px] before:bg-[#4CC2FF] before:-z-10
                ${
                  loading
                    ? "bg-transparent border border-gray-300/30 text-gray-200 cursor-not-allowed"
                    : "bg-transparent border border-white/30 text-white shadow-[0_4px_20px_rgba(76,194,255,0.3)]"
                }`}
    >
      {loading ? "Enrolling..." : "Enroll"}
    </button>
  )
}
