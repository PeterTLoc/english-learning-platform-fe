"use client"

import { useEffect, useState } from "react"
import { Vocabulary } from "@/types/lesson/vocabulary"
import { getVocabulariesByLessonId, getLessonById } from "@/services/lessonService"
import ContentSlideIn from "@/components/ui/ContentSlideIn"
import Pagination from "@/components/ui/Pagination"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import LoadingSpinner from "@/components/ui/LoadingSpinner"
import { motion } from "framer-motion"

interface VocabularyContentProps {
  courseId: string
  lessonId: string
  itemsPerPage?: number
}

export default function VocabularyContent({
  courseId,
  lessonId,
  itemsPerPage = 1,
}: VocabularyContentProps) {
  const [vocabularies, setVocabularies] = useState<Vocabulary[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [lessonName, setLessonName] = useState<string>("")

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
    <>
      <div className="title flex items-center gap-5 mb-4">
        <Link href={`/courses/${courseId}/lessons/${lessonId}`} className="text-[#AAAAAA] transition-colors duration-200 hover:text-white">
          {lessonName}
        </Link>
        <ChevronRight size={20} strokeWidth={3} className="subtext"/>
        <span>Vocabulary</span>
      </div>
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {vocabularies.length === 0 ? (
          <p>No vocabulary available.</p>
        ) : (
          <div className="flex flex-col">
            <ul>
              {vocabularies.map((vocab) => (
                <li key={vocab._id} className="flex flex-col gap-[14px]">
                  {vocab.imageUrl && (
                    <img
                      src={vocab.imageUrl}
                      alt={vocab.englishContent}
                      className="w-[335px] h-[188px] object-cover rounded-[5px]"
                    />
                  )}

                  <div className="flex flex-col gap-1">
                    <div className="bg-[#2B2B2B] border border-[#1D1D1D] px-5 rounded-[5px] flex items-center gap-5 h-[69px]">
                      <img
                        src="https://flagcdn.com/gb.svg"
                        alt="UK Flag"
                        className="w-5 h-5"
                      />

                      <div>
                        <p className="text-sm">{vocab.englishContent}</p>
                        <p className="text-xs subtext">English</p>
                      </div>
                    </div>

                    <div className="bg-[#2B2B2B] border border-[#1D1D1D] p-5 rounded-[5px] flex gap-5 items-center h-[69px]">
                      <img
                        src="https://flagcdn.com/vn.svg"
                        alt="Vietnam Flag"
                        className="w-5 h-5"
                      />

                      <div>
                        <p className="text-sm">{vocab.vietnameseContent}</p>
                        <p className="text-xs subtext">Vietnamese</p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              className="mt-[35px] self-center"
            />
          </div>
        )}
      </motion.div>
    </>
  )
}
