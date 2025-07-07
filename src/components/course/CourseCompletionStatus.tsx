"use client"

import { CheckCircle } from "lucide-react"

interface CourseCompletionStatusProps {
  isCompleted: boolean
  loading?: boolean
}

export default function CourseCompletionStatus({ 
  isCompleted, 
  loading = false 
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
    <div className="bg-green-900/20 border border-green-500/30 rounded-[5px] p-5 h-[69px] flex items-center gap-5 mt-5">
      <div className="w-6 h-6 rounded-full flex items-center justify-center bg-green-500">
        <CheckCircle size={16} className="text-white" />
      </div>
      <div>
        <p className="text-sm text-green-400 font-semibold">Course Completed!</p>
        <p className="text-xs subtext">Congratulations! You have successfully completed all lessons and tests in this course.</p>
      </div>
    </div>
  )
} 