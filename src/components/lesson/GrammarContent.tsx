"use client"

import { useEffect, useState } from "react"
import { Grammar } from "@/types/lesson/grammar"
import { getGrammarsByLessonId, getLessonById } from "@/services/lessonService"
import { PenTool, ChevronRight } from "lucide-react"
import ContentSlideIn from "@/components/ui/ContentSlideIn"
import Pagination from "@/components/ui/Pagination"
import Link from "next/link"
import LoadingSpinner from "@/components/ui/LoadingSpinner"
import { motion } from "framer-motion"

interface GrammarContentProps {
  courseId: string
  lessonId: string
  itemsPerPage?: number
}

export default function GrammarContent({
  courseId,
  lessonId,
  itemsPerPage = 1,
}: GrammarContentProps) {
  const [grammars, setGrammars] = useState<Grammar[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [lessonName, setLessonName] = useState<string>("")

  useEffect(() => {
    const fetchGrammars = async () => {
      setIsLoading(true)
      try {
        const data = await getGrammarsByLessonId(
          lessonId,
          currentPage,
          itemsPerPage
        )
        setGrammars(data.data)
        setTotalPages(data.totalPages)
      } catch (err) {
        console.error("Failed to fetch grammars:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchGrammars()
  }, [lessonId, currentPage, itemsPerPage])

  useEffect(() => {
    getLessonById(lessonId).then((lesson) => setLessonName(lesson?.name || ""))
  }, [lessonId])

  if (isLoading || !lessonName) {
    return (
      <div className="mt-[74px]">
        <LoadingSpinner size="small" />
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-235px)] flex flex-col">
      <div className="title flex items-center gap-5 mb-4">
        <Link href={`/courses/${courseId}/lessons/${lessonId}`} className="text-[#AAAAAA] transition-colors duration-200 hover:text-white">
          {lessonName}
        </Link>
        <ChevronRight size={20} strokeWidth={3} className="subtext" />
        <span>Grammar</span>
      </div>
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="flex-1 overflow-y-auto"
      >
        {grammars.length === 0 ? (
          <p>No grammar available.</p>
        ) : (
          <>
            {grammars.map((grammar, index) => (
              <div key={grammar._id} className="flex flex-col">
                <div className="bg-[#2B2B2B] border border-[#1D1D1D] rounded-t-[5px] flex items-center gap-5 px-5 h-[69px]">
                  <PenTool size={20} className="text-white" />
                  <div>
                    <p className="text-sm text-white">{grammar.title}</p>
                    <p className="text-xs subtext">Grammar</p>
                  </div>
                </div>

                <div className="bg-[#2B2B2B] border border-[#1D1D1D] border-t-[#2B2B2B] rounded-b-[5px] p-5 grid grid-cols-[138px_1fr] gap-[5px] text-sm">
                  <div className="text-white pl-[40px]">Structure</div>
                  <div className="subtext">{grammar.structure}</div>

                  {grammar.explanation && (
                    <>
                      <div className="text-white pl-[40px]">Explanation</div>
                      <div className="subtext">{grammar.explanation}</div>
                    </>
                  )}

                  {grammar.example && (
                    <>
                      <div className="text-white pl-[40px]">Example</div>
                      <div className="subtext">{grammar.example}</div>
                    </>
                  )}
                </div>
              </div>
            ))}

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              className="flex justify-center mt-[35px] mb-5"
            />
          </>
        )}
      </motion.div>
    </div>
  )
}
