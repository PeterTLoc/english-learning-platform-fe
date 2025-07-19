"use client";

import { useEffect, useState } from "react";
import { Vocabulary } from "@/types/lesson/vocabulary";
import {
  getVocabulariesByLessonId,
  getLessonById,
} from "@/services/lessonService";
import ContentSlideIn from "@/components/ui/ContentSlideIn";
import Pagination from "@/components/ui/Pagination";
import Link from "next/link";
import { ChevronRight, Volume1Icon, Volume2, VolumeIcon } from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { motion } from "framer-motion";
import { useSpeechSynthesis } from "../../utils/Speech";
interface VocabularyContentProps {
  courseId: string;
  lessonId: string;
  itemsPerPage?: number;
}

export default function VocabularyContent({
  courseId,
  lessonId,
  itemsPerPage = 1,
}: VocabularyContentProps) {
  const [vocabularies, setVocabularies] = useState<Vocabulary[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [lessonName, setLessonName] = useState<string>("");
  const { speak, stop } = useSpeechSynthesis();
  useEffect(() => {
    const fetchVocabularies = async () => {
      setIsLoading(true);
      try {
        const data = await getVocabulariesByLessonId(
          lessonId,
          currentPage,
          itemsPerPage
        );
        setVocabularies(data.data);
        setTotalPages(data.totalPages);
      } catch (err) {
        console.error("Failed to fetch vocabularies:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVocabularies();
  }, [lessonId, currentPage, itemsPerPage]);

  useEffect(() => {
    getLessonById(lessonId).then((lesson) => setLessonName(lesson?.name || ""));
  }, [lessonId]);

  if (isLoading || !lessonName) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 h-full">
        <LoadingSpinner size="medium" />
        <p className="text-lg">Loading vocabulary content...</p>
      </div>
    );
  }

  return (
    <>
      <div className="title flex items-center gap-5 mb-4">
        <Link
          href={`/courses/${courseId}/lessons/${lessonId}`}
          className="text-[#AAAAAA] transition-colors duration-200 hover:text-white"
        >
          {lessonName}
        </Link>
        <ChevronRight size={20} strokeWidth={3} className="subtext" />
        <span>Vocabulary</span>
      </div>
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {vocabularies.length === 0 ? (
          <div className="flex flex-col bg-[#2B2B2B] border border-[#1D1D1D] rounded-lg p-5">
            <p className="text-lg">No vocabulary available.</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <ul className="w-full flex flex-col items-center">
              {vocabularies.map((vocab) => (
                <li
                  key={vocab._id}
                  className="flex flex-col gap-4 items-center w-full"
                >
                  {vocab.imageUrl && (
                    <div className="flex justify-center w-full">
                      <img
                        src={vocab.imageUrl}
                        alt={vocab.englishContent}
                        className="w-[750px] h-[400px] object-contain rounded-2xl bg-[#222] max-w-full shadow-lg border border-[#1D1D1D]"
                      />
                    </div>
                  )}
                  <div className="flex flex-col gap-2 items-center w-full">
                    <div className="bg-[#2B2B2B] border border-[#1D1D1D] px-8 rounded-[10px] flex justify-between items-center gap-5 h-[80px] w-full max-w-[600px]">
                      <div className=" flex items-center gap-5">
                        <img
                          src="https://flagcdn.com/gb.svg"
                          alt="UK Flag"
                          className="w-10 h-10"
                        />
                        <div>
                          <p className="text-sm">{vocab.englishContent}</p>
                          <p className="text-xs subtext">English</p>
                        </div>
                      </div>
                      <div className="bg-gray-800 rounded-full p-1 flex">
                        <button
                          onClick={() => speak(vocab.englishContent)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-blue-500 text-white text-xs font-medium transition-all duration-200"
                        >
                          <Volume2 className="w-3 h-3" />
                          1x
                        </button>
                        <button
                          onClick={() =>
                            speak(vocab.englishContent, "en-US", 0.5)
                          }
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-gray-400 hover:text-white hover:bg-green-500 text-xs font-medium transition-all duration-200"
                        >
                          <Volume2 className="w-3 h-3" />
                          0.5x
                        </button>
                      </div>
                    </div>

                    <div className="bg-[#2B2B2B] border border-[#1D1D1D] px-8 rounded-[10px] flex justify-between gap-5 items-center h-[80px] w-full max-w-[600px]">
                      <div className=" flex gap-5 items-center ">
                        <img
                          src="https://flagcdn.com/vn.svg"
                          alt="Vietnam Flag"
                          className="w-10 h-10"
                        />

                        <div>
                          <p className="text-sm">{vocab.vietnameseContent}</p>
                          <p className="text-xs subtext">Vietnamese</p>
                        </div>
                      </div>
                      <div className="bg-gray-800 rounded-full p-1 flex">
                        <button
                          onClick={() =>
                            speak(vocab.vietnameseContent, "vi-VN", 1)
                          }
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-blue-500 text-white text-xs font-medium transition-all duration-200"
                        >
                          <Volume2 className="w-3 h-3" />
                          1x
                        </button>
                        <button
                          onClick={() =>
                            speak(vocab.vietnameseContent, "vi-VN", 0.5)
                          }
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-gray-400 hover:text-white hover:bg-green-500 text-xs font-medium transition-all duration-200"
                        >
                          <Volume2 className="w-3 h-3" />
                          0.5x
                        </button>
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
              className="mt-10 self-center"
            />
          </div>
        )}
      </motion.div>
    </>
  );
}
