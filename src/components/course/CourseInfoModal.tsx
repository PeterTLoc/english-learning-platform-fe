import { Course } from "@/types/course/course"
import { Lesson } from "@/types/lesson/lesson"
import { Fragment } from "react"

interface CourseInfoModalProps {
  course: Course
  lessons: Lesson[]
  isOpen: boolean
  onClose: () => void
}

export default function CourseInfoModal({
  course,
  lessons,
  isOpen,
  onClose,
}: CourseInfoModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/50 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative w-full max-w-4xl rounded-lg bg-white p-6 shadow-xl">
          <div className="mb-4 flex items-start justify-between">
            <h2 className="text-2xl font-bold">{course.name}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Close</span>
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="mb-6">
            <p className="text-gray-600">{course.description}</p>
            <div className="mt-2 flex gap-4 text-sm text-gray-500">
              <span>Level: {course.level}</span>
              <span>•</span>
              <span>{course.totalLessons} lessons</span>
              <span>•</span>
              <span>{course.totalEnrolled} enrolled</span>
            </div>
          </div>

          <div className="max-h-[60vh] overflow-y-auto">
            <div className="space-y-6">
              {lessons.map((lesson, index) => (
                <Fragment key={lesson._id}>
                  <div className="rounded-lg border border-gray-200 p-4">
                    <h3 className="mb-2 text-lg font-semibold">
                      Lesson {index + 1}: {lesson.name}
                    </h3>
                    <p className="text-gray-600">{lesson.description}</p>
                    <div className="mt-2 text-sm text-gray-500">
                      Duration: {lesson.length} minutes
                    </div>
                  </div>
                </Fragment>
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
 