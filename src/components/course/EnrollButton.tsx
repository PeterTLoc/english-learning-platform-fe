"use client"

import { useAuth } from "@/context/AuthContext"
import { enrollCourse } from "@/services/userCourseService"
import { useCourse } from "@/context/CourseContext"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function EnrollButton({ courseId }: { courseId: string }) {
  const { user } = useAuth()
  const { userCourses, fetchAllCourses, setCourseStatus } = useCourse()
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (user && !userCourses[courseId]) {
      fetchAllCourses()
    }
  }, [user, courseId])

  const handleEnroll = async () => {
    if (!user?._id) return alert("You must be logged in to enroll.")
    setLoading(true)
    try {
      const userCourse = await enrollCourse(user._id, courseId)
      setCourseStatus(courseId, userCourse.status)
      router.push(`/courses/${courseId}`)
    } catch (err) {
      console.error("Enrollment failed", err)
      alert("Enrollment failed")
    } finally {
      setLoading(false)
    }
  }

  const isEnrolled = userCourses[courseId]?.status === "ongoing"

  return isEnrolled ? (
    <Link
      href={`/courses/${courseId}`}
      className="button-blue font-bold flex justify-center items-center text-black"
    >
      Go to Course
    </Link>
  ) : (
    <button
      onClick={handleEnroll}
      disabled={loading}
      className="button-blue font-bold flex justify-center items-center text-black"
    >
      {loading ? "Enrolling..." : "Enroll"}
    </button>
  )
}
