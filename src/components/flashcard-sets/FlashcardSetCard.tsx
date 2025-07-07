"use client";
import { IFlashcardSet } from "@/types/models/IFlashcardSet";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, User, BookOpen, Clock } from "lucide-react";

export default function FlashcardSetCard({
  flashcardSet,
}: {
  flashcardSet: IFlashcardSet;
}) {
  return (
    <Link
      href={`/flashcard-sets/${flashcardSet._id}`}
      className="group relative flex flex-col h-72 rounded-lg p-5 bg-[#2b2b2b] shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer"
    >
      {/* Header with title and creation date */}
      <div className="flex-1">
        <div className="block">
          <h2 className="text-lg font-bold text-white mb-3 line-clamp-2 leading-tight">
            {flashcardSet.name}
          </h2>

          {/* Description */}
          <p className="text-sm text-slate-300 mb-4 flex-grow leading-relaxed overflow-hidden text-ellipsis whitespace-nowrap">
            {flashcardSet.description || "No description available"}
          </p>
        </div>

        {/* Creation date */}
        <div className="flex items-center gap-2 text-sm text-slate-400 mb-4">
          <Clock className="w-3 h-3" />
          <span>Created {flashcardSet.createdAt ? new Date(flashcardSet.createdAt).toLocaleString() : "Unknown"}</span>
        </div>
      </div>

      {/* Bottom section with user info and flashcard count */}
      <div className="mt-auto">
        <div className="flex items-center justify-between gap-3">
          {/* User info */}
          <div
            className="flex-shrink-0 group/user"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              window.location.href = `/profile/${flashcardSet.userId}`;
            }}
          >
            <div className="flex items-center gap-2 group-hover/user:text-purple-400 transition-colors cursor-pointer">
              {flashcardSet.user?.avatar ? (
                <Image
                  src={flashcardSet.user.avatar}
                  alt={flashcardSet.user.username}
                  width={32}
                  height={32}
                  className="w-7 h-7 rounded-full border-2 border-purple-400 shadow"
                />
              ) : (
                <div className="w-7 h-7 rounded-full border-2 border-purple-400 shadow bg-purple-500 flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
              <div className="flex flex-col">
                <span className="text-sm text-purple-400 font-medium truncate max-w-20">
                  {flashcardSet.user?.username || "Unknown User"}
                </span>
              </div>
            </div>
          </div>

          {/* Flashcard count */}
          <div className="flex items-center gap-1 text-sm text-white font-medium bg-slate-700/50 px-2 py-1 rounded-md shadow-sm border border-slate-600">
            <BookOpen className="w-3 h-3" />
            <span>{flashcardSet.flashcardCount || 0} card{flashcardSet.flashcardCount === 1 ? "" : "s"}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
