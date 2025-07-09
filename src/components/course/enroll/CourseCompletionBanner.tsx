"use client"

import { CheckCircle } from "lucide-react"

interface CourseCompletionStatusProps {
  isCompleted: boolean
  loading?: boolean
}

export default function CourseCompletionStatus({
  isCompleted,
  loading = false,
}: CourseCompletionStatusProps) {
  if (loading) {
    return (
      <div className="bg-[#2B2B2B] border border-[#1D1D1D] rounded-[5px] p-5 h-[69px] flex items-center gap-5 mt-5">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#4CC2FF]"></div>
        <div>
          <p className="text-sm text-white">Checking completion status...</p>
          <p className="text-xs subtext">Please wait</p>
        </div>
      </div>
    )
  }

  if (!isCompleted) {
    return null
  }

  return (
    <div className="container flex items-center gap-5 h-[69px]">
      <CheckCircle size={20} className="text-green-500" />

      <div className="flex flex-col">
        <span className="text-sm">Course Completed!</span>
        <span className="text-xs subtext">
          You have completed the course, go back and practice or try different
          courses.
        </span>
      </div>
    </div>
  )
}
