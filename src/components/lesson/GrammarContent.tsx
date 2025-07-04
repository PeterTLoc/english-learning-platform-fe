"use client"

import { useEffect, useState } from "react"
import { Grammar } from "@/types/lesson/grammar"
import { getGrammarsByLessonId } from "@/services/lessonService"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface GrammarContentProps {
  lessonId: string
  itemsPerPage?: number
}

export default function GrammarContent({
  lessonId,
  itemsPerPage = 1,
}: GrammarContentProps) {
  const [grammars, setGrammars] = useState<Grammar[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

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

  const handlePrev = () => setCurrentPage((p) => Math.max(p - 1, 1))
  const handleNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages))

  return (
    <div>
      {isLoading ? (
        <p className="subtext text-sm">Loading grammars...</p>
      ) : grammars.length === 0 ? (
        <p>No grammar available.</p>
      ) : (
        <>
          {grammars.map((grammar) => (
            <div
              key={grammar._id}
              className="container flex flex-col gap-2"
            >
              <h2 className="text-lg font-bold text-white">{grammar.title}</h2>
              <p className="text-sm text-blue-400">
                <strong>Structure:</strong> {grammar.structure}
              </p>
              {grammar.explanation && (
                <p className="text-sm text-gray-300 mt-1">
                  <strong>Explanation:</strong> {grammar.explanation}
                </p>
              )}
              {grammar.example && (
                <p className="text-sm text-green-300 mt-1">
                  <strong>Example:</strong> {grammar.example}
                </p>
              )}
            </div>
          ))}

          {totalPages > 1 && (
            <div className="flex justify-center gap-1 mt-8 text-sm">
              <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className={`w-8 h-8 flex items-center justify-center rounded border ${
                  currentPage === 1
                    ? "subtext cursor-not-allowed border-transparent"
                    : "border-transparent hover:bg-[#2A2A2A] hover:border-[#303030]"
                }`}
              >
                <ChevronLeft size={16} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 flex items-center justify-center rounded-[5px] border ${
                      currentPage === page
                        ? "bg-[#2A2A2A] text-white border-[#303030]"
                        : "bg-transparent text-gray-400 border-transparent hover:bg-[#2A2A2A] hover:border-[#303030]"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className={`w-8 h-8 flex items-center justify-center rounded border ${
                  currentPage === totalPages
                    ? "subtext cursor-not-allowed border-transparent"
                    : "border-transparent hover:bg-[#2A2A2A] hover:border-[#303030]"
                }`}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
