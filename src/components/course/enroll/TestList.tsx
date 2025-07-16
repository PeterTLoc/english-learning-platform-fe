"use client"

import { useEffect, useState } from "react"
import { getAllLessonsByCourseId } from "@/services/lessonService"
import { getTestsByLessonId } from "@/services/testService"
import { getUserTests } from "@/services/userTestService"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { FileText, ChevronRight } from "lucide-react"
import LoadingSpinner from "@/components/ui/LoadingSpinner"

interface TestListProps {
  courseId: string
  tests: Test[]
  preloadedTestCompletion?: Record<string, boolean>
  loading?: boolean
}

interface Test {
  _id: string
  name: string
}

export default function TestList({
  courseId,
  tests,
  preloadedTestCompletion,
  loading = false,
}: TestListProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [testCompletion, setTestCompletion] = useState<Record<string, boolean>>(
    preloadedTestCompletion || {}
  )

  useEffect(() => {
    if (preloadedTestCompletion) {
      setTestCompletion(preloadedTestCompletion)
    }
  }, [preloadedTestCompletion])

  if (loading) return <LoadingSpinner size="small" />
  if (tests.length === 0)
    return (
      <p className="container text-md text-center subtext">
        No tests found for this course.
      </p>
    )

  return (
    <>
      <ul className="flex flex-col gap-1">
        {tests.map((test) => (
          <li
            key={test._id}
            className="px-5 h-[68px] bg-[#2B2B2B] border border-[#1D1D1D] rounded-[5px] flex items-center justify-between hover:bg-[#323232] cursor-pointer transition-colors duration-150"
            onClick={() =>
              router.push(`/courses/${courseId}/tests/${test._id}`)
            }
          >
            <div className="flex items-center gap-5">
              <FileText size={20} className="text-white" />
              <div>
                <h3 className="text-md">{test.name}</h3>
                <p className="text-sm subtext">
                  Final assessment for the course
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {testCompletion[test._id] && (
                <span
                  className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                  style={{ background: "rgba(34,197,94,0.12)" }}
                >
                  <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                  Completed
                </span>
              )}
              <ChevronRight size={20} />
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}
