"use client"

import { useEffect, useState } from "react"
import { Grammar } from "@/types/lesson/grammar"
import { getGrammarsByLessonId } from "@/services/lessonService"
import { PenTool } from "lucide-react"
import ContentSlideIn from "@/components/ui/ContentSlideIn"
import Pagination from "@/components/ui/Pagination"

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

  return (
    <div className="h-[calc(100vh-235px)] flex flex-col">
      {/* Scrollable grammar content */}
      <div className="flex-1 overflow-y-auto">
        <ContentSlideIn
          keyValue={`${lessonId}-${currentPage}`}
          isLoading={isLoading}
          loadingComponent={
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#4CC2FF]"></div>
            </div>
          }
        >
          {grammars.length === 0 ? (
            <p>No grammar available.</p>
          ) : (
            <>
              {grammars.map((grammar, index) => (
                <div key={grammar._id} className="flex flex-col">
                  <div className="bg-[#2B2B2B] border border-[#1D1D1D] p-5 rounded-t-[5px] flex items-center gap-5 h-[69px]">
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
                className="flex justify-center mt-5 mb-5"
              />
            </>
          )}
        </ContentSlideIn>
      </div>
    </div>
  )
}
