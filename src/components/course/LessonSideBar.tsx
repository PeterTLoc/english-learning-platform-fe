import { Lesson } from "@/types/lesson/lesson"
import { motion, AnimatePresence } from "framer-motion"
import { Check, CheckCircle, ChevronDown } from "lucide-react"

interface SidebarProps {
  lessons: Lesson[]
  openLessonId: string | null
  activeTabs: Record<string, string>
  setOpenLessonId: (_id: string | null) => void
  setActiveTabs: (tabs: Record<string, string>) => void
}

const tabs = ["Vocabulary", "Grammar", "Exercise"]

export default function LessonSidebar({
  lessons,
  openLessonId,
  activeTabs,
  setOpenLessonId,
  setActiveTabs,
}: SidebarProps) {
  const toggleLesson = (lessonId: string) => {
    setOpenLessonId(openLessonId === lessonId ? null : lessonId)
  }

  const setTabForLesson = (lessonId: string, tab: string) => {
    setActiveTabs({ ...activeTabs, [lessonId]: tab })
  }

  return (
    <div className="p-5">
      {lessons.map((lesson) => {
        const isOpen = openLessonId === lesson._id
        const activeTab = activeTabs[lesson._id] || "Vocabulary"

        return (
          <div key={lesson._id} className="mb-1">
            <button
              className="flex justify-between items-center mb-1 h-9 hover:bg-[#2D2D2D] rounded-[5px] pl-3 pr-2 text-[13px] text-left w-[280px]"
              onClick={() => toggleLesson(lesson._id)}
            >
              <p>{lesson.name}</p>
              <ChevronDown
                strokeWidth={2}
                size={16}
                className={`transition-transform duration-300 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  className="flex flex-col gap-1"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.1, ease: "easeInOut" }}
                >
                  {tabs.map((tab) => {
                    const isActive = activeTab === tab

                    return (
                      <button
                        key={tab}
                        className={`flex items-center gap-[10px] h-9 rounded-[5px] px-3 text-[13px] text-left w-[280px] ${
                          isActive
                            ? "bg-[#2D2D2D] text-white"
                            : "text-gray-300 hover:bg-[#2D2D2D]"
                        }`}
                        onClick={() => setTabForLesson(lesson._id, tab)}
                      >
                        <CheckCircle size={16} />
                        <span className="mt-[3px]">{tab}</span>
                      </button>
                    )
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
