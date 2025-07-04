"use client"

import { useEffect, useState } from "react"
import { Vocabulary } from "@/types/lesson/vocabulary"
import { getVocabulariesByLessonId } from "@/services/lessonService"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface VocabularyContentProps {
  lessonId: string
  itemsPerPage?: number
}

export default function VocabularyContent({
  lessonId,
  itemsPerPage = 1,
}: VocabularyContentProps) {
  const [vocabularies, setVocabularies] = useState<Vocabulary[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchVocabularies = async () => {
      setIsLoading(true)
      try {
        const data = await getVocabulariesByLessonId(
          lessonId,
          currentPage,
          itemsPerPage
        )
        setVocabularies(data.data)
        setTotalPages(data.totalPages)
      } catch (err) {
        console.error("Failed to fetch vocabularies:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchVocabularies()
  }, [lessonId, currentPage, itemsPerPage])

  const handlePrev = () => setCurrentPage((p) => Math.max(p - 1, 1))
  const handleNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages))

  return (
    <div>
      {isLoading ? (
        <p className="subtext text-sm">Loading vocabularies...</p>
      ) : vocabularies.length === 0 ? (
        <p>No vocabulary available.</p>
      ) : (
        <div className="flex flex-col items-center">
          <ul className="w-full">
            {vocabularies.map((vocab) => (
              <li key={vocab._id} className="flex flex-col items-center">
                {vocab.imageUrl && (
                  <img
                    src={vocab.imageUrl}
                    alt={vocab.englishContent}
                    className="mt-[6px] mb-[14px] max-w-[500px] aspect-[16/9] object-cover rounded-[5px]"
                  />
                )}

                {/* <div className="container flex flex-col gap-2">
                  <div className="text-center">
                    <div className="subtext text-sm uppercase">English</div>
                    <div className="text-lg">{vocab.englishContent}</div>
                  </div>

                  <div className="text-center">
                    <div className="subtext text-sm uppercase">Vietnamese</div>
                    <div className="text-lg">{vocab.vietnameseContent}</div>
                  </div>
                </div> */}

                <div className="container flex flex-col gap-2 text-[13px] text-center">
                  <div>
                    <div className="subtext">English</div>
                    <div className="text-lg">{vocab.englishContent}</div>
                  </div>

                  <div>
                    <div className="subtext">Vietnamese</div>
                    <div className="text-lg">{vocab.vietnameseContent}</div>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {totalPages > 1 && (
            <div className="flex gap-1 mt-8 text-sm">
              {/* Previous button */}
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

              {/* Page numbers */}
              <div className="flex gap-1">
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
              </div>

              {/* Next button */}
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
        </div>
      )}
    </div>
  )
}
