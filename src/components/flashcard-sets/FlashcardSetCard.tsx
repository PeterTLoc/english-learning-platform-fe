"use client";
import { IFlashcardSet } from "@/types/models/IFlashcardSet";
import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function FlashcardSetCard({
  flashcardSet,
}: {
  flashcardSet: IFlashcardSet;
}) {
  return (
    <>
      <div className="group relative flex flex-col h-full border border-gray-700 rounded-xl p-4 sm:p-5 bg-gradient-to-br from-[#232526] to-[#414345] shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-[#4CC2FF]/30 hover:border-[#4CC2FF]">
        {/* Name at top - responsive sizing */}
        <Link
          href={`/flashcard-sets/${flashcardSet._id}`}
          className="cursor-pointer"
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 line-clamp-2">
            {flashcardSet.name}
          </h2>

          {/* Description - responsive truncation */}
          <p className="text-xs sm:text-sm text-gray-300 mb-4 line-clamp-2 flex-grow">
            {flashcardSet.description.length > 60
              ? `${flashcardSet.description.slice(0, 60)}...`
              : flashcardSet.description}
          </p>
        </Link>

        {/* Bottom section with avatar, username, and term count */}
        <div className="flex items-center justify-between mt-auto gap-2">
          <Link
            href={`/flashcard-sets?userId=${flashcardSet.userId}`}
            className="cursor-pointer flex-shrink-0"
          >
            <div className="flex items-center gap-2">
              {flashcardSet.user?.avatar ? (
                <Image
                  src={flashcardSet.user.avatar}
                  alt={flashcardSet.user.username}
                  width={32}
                  height={32}
                  className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-[#4CC2FF] shadow"
                />
              ) : (
                <span className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-[#4CC2FF] shadow bg-[#4CC2FF] flex items-center justify-center">
                  <span className="text-white text-xs sm:text-sm font-medium">
                    {flashcardSet.user?.username?.charAt(0).toUpperCase()}
                  </span>
                </span>
              )}
              <span className="text-xs sm:text-sm text-[#4CC2FF] font-medium max-w-16 sm:max-w-24 truncate py-1">
                {flashcardSet.user?.username}
              </span>
            </div>
          </Link>
          <span className="text-xs sm:text-sm text-white font-medium bg-[#414a4c] px-2 py-1 rounded-md shadow-sm shadow-white/20 flex-shrink-0">
            {flashcardSet.flashcardCount} terms
          </span>
        </div>
      </div>
    </>
  );
}
