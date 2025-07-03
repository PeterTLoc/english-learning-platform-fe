"use client";
import { IFlashcard } from "@/types/models/IFlashcard";
import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import FlashcardService from "@/services/flashcardService";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useRouter } from "next/navigation";
import FlashcardSetService from "@/services/flashcardSetService";
import Image from "next/image";
import { IFlashcardSet } from "@/types/models/IFlashcardSet";
import Link from "next/link";

const flashcardService = new FlashcardService();
const flashcardSetService = new FlashcardSetService();

export default function FlashcardSetPractice({
  id,
  size,
  page,
}: {
  id: string;
  size: number;
  page: number;
}) {
  const router = useRouter();
  const [totalPages, setTotalPages] = useState(1);
  const [flashcards, setFlashcards] = useState<IFlashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [flipped, setFlipped] = useState(false);
  const [cardVisible, setCardVisible] = useState(true);
  const [flashcardSet, setFlashcardSet] = useState<IFlashcardSet | null>(null);

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const response = await flashcardService.getFlashcards(id, page, size);
        setFlashcards(response.data);
        setTotalPages(response.totalPages);
        setLoading(false);
      } catch (error) {
        toast.error(
          error instanceof AxiosError
            ? error.response?.data.message
            : "Failed to fetch flashcards"
        );
        setLoading(false);
      }
    };
    fetchFlashcards();
  }, [page, size, id]);

  const goToPage = (newPage: number) => {
    router.push(`/flashcard-sets/${id}/practice?page=${newPage}`);
  };

  const handleGoToPage = useCallback(
    (newPage: number) => {
      setCardVisible(false);
      setFlipped(false);
      setTimeout(() => {
        goToPage(newPage);
        setCardVisible(true);
      }, 300);
    },
    [goToPage]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (e.code === "ArrowLeft" && page > 1) {
        handleGoToPage(page - 1);
      } else if (e.code === "ArrowRight" && page < totalPages) {
        handleGoToPage(page + 1);
      } else if (e.code === "Space") {
        setFlipped((f) => !f);
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [page, totalPages, handleGoToPage]);

  useEffect(() => {
    const fetchFlashcardSet = async () => {
      const response = await flashcardSetService.getFlashcardSetById(id);
      setFlashcardSet(response.flashcardSet);
    };
    fetchFlashcardSet();
  }, [id]);

  if (loading) {
    return <LoadingSpinner />;
  }

  const currentCard = flashcards[0];

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="relative w-full mb-6 sm:mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-[#232526]/60 via-[#373737]/40 to-[#232526]/60 rounded-xl blur-sm pointer-events-none" />

        <div className="relative px-4 sm:px-8 py-6 sm:py-10 text-center">
          <div className="max-w-3xl mx-auto">
            <Link href={`/flashcard-sets/${id}`}>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 hover:from-pink-400 hover:via-purple-400 hover:to-blue-400 transition-all duration-500 drop-shadow-lg">
                {flashcardSet?.name}
              </h1>
            </Link>
            <div className="w-16 sm:w-24 h-1 mx-auto bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full mb-4" />
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mt-4">
              <span className="text-gray-400 text-base sm:text-lg font-medium">
                Created by
              </span>
              <Link href={`/flashcard-sets?userId=${flashcardSet?.userId}`}>
                <div className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-[#232526]/70 border border-blue-400/30 shadow hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <Image
                    src={flashcardSet?.user?.avatar || ""}
                    alt="avatar"
                    width={32}
                    height={32}
                    className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border border-blue-400/50 shadow"
                    unoptimized
                  />
                  <span className="text-blue-300 font-semibold text-sm sm:text-lg hover:text-pink-300 transition-colors">
                    {flashcardSet?.user?.username}
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Practice Section */}
      <div className="flex flex-col items-center justify-start my-6 sm:my-10">
        <div className="flex flex-col items-center w-full">
          {/* Navigation and Card */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 w-full">
            <button
              className={`order-2 sm:order-1 text-base sm:text-lg w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-white bg-[#373737] rounded-full shadow-md disabled:opacity-50 transition-all hover:bg-[#505050] ${
                page <= 1 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
              }`}
              onClick={() => handleGoToPage(page - 1)}
              disabled={page <= 1}
              aria-label="Previous card"
            >
              &lt;
            </button>

            {/* Flashcard */}
            {currentCard && (
              <div
                className={`order-1 sm:order-2 flashcard-flip w-full max-w-lg sm:max-w-xl lg:w-[600px] h-64 sm:h-80 lg:h-[400px] cursor-pointer transition-opacity duration-300 ${
                  cardVisible ? "opacity-100" : "opacity-0"
                }`}
                onClick={() => setFlipped((f) => !f)}
                title="Click to flip"
              >
                <div
                  className={`flashcard-inner bg-gradient-to-br from-[#232526] to-[#414345] shadow-2xl border border-gray-700 rounded-2xl sm:rounded-3xl ${
                    flipped ? "flashcard-flipped" : ""
                  } h-full`}
                >
                  <div className="flashcard-front text-2xl sm:text-4xl lg:text-6xl text-white font-extrabold select-none flex items-center justify-center h-full p-4 sm:p-6 lg:p-8 text-center">
                    {currentCard.englishContent}
                  </div>
                  <div className="flashcard-back text-2xl sm:text-4xl lg:text-6xl text-white font-extrabold select-none flex items-center justify-center h-full p-4 sm:p-6 lg:p-8 text-center">
                    {currentCard.vietnameseContent}
                  </div>
                </div>
              </div>
            )}

            <button
              className="order-3 text-base sm:text-lg w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-white bg-[#373737] rounded-full shadow-md disabled:opacity-50 transition-all hover:bg-[#505050]"
              onClick={() => handleGoToPage(page + 1)}
              disabled={page >= totalPages}
              aria-label="Next card"
            >
              &gt;
            </button>
          </div>

          {/* Keyboard Shortcuts */}
          <div className="mt-6 sm:mt-8 text-center">
            <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-6 text-xs sm:text-sm text-gray-500">
              <div className="flex items-center gap-1 sm:gap-2">
                <kbd className="px-2 py-1 bg-gray-800 rounded text-xs">←</kbd>
                <span>Previous</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <kbd className="px-2 py-1 bg-gray-800 rounded text-xs">→</kbd>
                <span>Next</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <kbd className="px-2 py-1 bg-gray-800 rounded text-xs">
                  Space
                </kbd>
                <span>Flip</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-8 sm:mt-12 text-center">
            <div className="inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-4 px-4 sm:px-6 py-3 bg-gray-800/50 backdrop-blur-sm rounded-full border border-gray-700/50">
              <div className="text-gray-300 text-base sm:text-lg font-medium">
                {`${page} of ${totalPages}`}
              </div>
              <div className="w-24 sm:w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 transition-all duration-300 rounded-full"
                  style={{ width: `${(page / totalPages) * 100}%` }}
                ></div>
              </div>
              <div className="text-gray-400 text-sm">
                {Math.round((page / totalPages) * 100)}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
