import { Course } from "@/types/course/course"
import { Lesson } from "@/types/lesson/lesson"
import { Fragment } from "react"
import { GraduationCap } from "lucide-react"

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
        <div className="relative w-full max-w-4xl rounded-[5px] bg-[#202020] border border-[#1D1D1D] p-6 shadow-xl">
          <div className="mb-4 flex items-start justify-between">
            <h2 className="text-2xl font-bold text-white">{course.name}</h2>
            <button
              onClick={onClose}
              className="text-[#CFCFCF] hover:text-white transition-colors duration-150"
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
            <p className="text-[#CFCFCF]">{course.description}</p>
            <div className="mt-2 flex gap-[10px] text-sm text-[#9A9A9A]">
              <span>Level {course.level}</span>
              <span>|</span>
              <span>
                {course.totalLessons} lesson{course.totalLessons > 1 ? "s" : ""}
              </span>
              <span>|</span>
              <span>{course.totalEnrolled} enrolled</span>
            </div>
          </div>

          <div className="max-h-[60vh] overflow-y-auto">
            <div className="space-y-1">
              {lessons.map((lesson, index) => (
                <Fragment key={lesson._id}>
                  <div className="flex flex-col">
                    <div className="bg-[#2B2B2B] border border-[#1D1D1D] p-5 rounded-t-[5px] flex items-center gap-5 h-[69px]">
                      <GraduationCap size={20} className="text-white" />
                      <div>
                        <p className="text-sm text-white">
                          Lesson {index + 1}: {lesson.name}
                        </p>
                        <p className="text-xs subtext">Lesson</p>
                      </div>
                    </div>

                    <div className="bg-[#2B2B2B] border border-[#1D1D1D] border-t-[#2B2B2B] rounded-b-[5px] p-5 grid grid-cols-[138px_1fr] gap-[5px] text-sm">
                      <div className="text-white pl-[40px]">Description</div>
                      <div className="subtext">{lesson.description}</div>

                      <div className="text-white pl-[40px]">Materials</div>
                      <div className="subtext flex flex-col gap-[5px]">
                        {lesson.length
                          .map(
                            (item) =>
                              `${item.amount} ${item.for}${
                                item.amount > 1 ? "s" : ""
                              }`
                          )
                          .map((item, index) => (
                            <div key={index}>{item}</div>
                          ))}
                      </div>
                    </div>
                  </div>
                </Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
