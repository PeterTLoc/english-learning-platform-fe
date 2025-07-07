"use client";
import { IFlashcardSet } from "@/types/models/IFlashcardSet";
import { IFlashcard } from "@/types/models/IFlashcard";
import React, { useEffect, useState } from "react";
import FlashcardSetService from "@/services/flashcardSetService";
import FlashcardService from "@/services/flashcardService";
import { useToast } from "@/context/ToastContext";
import { AxiosError } from "axios";
import LoadingSpinner from "../ui/LoadingSpinner";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useConfirmation } from "@/context/ConfirmationContext";
import { useRouter } from "next/navigation";
import {
  User,
  BookOpen,
  Calendar,
  ArrowLeft,
  ArrowRight,
  Volume2,
} from "lucide-react";
import Breadcrumb from "@/components/common/Breadcrumb";
import FlashcardManagementModal from "./FlashcardManagementModal";

const flashcardSetService = new FlashcardSetService();
const flashcardService = new FlashcardService();

function speak(text: string, lang: string) {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    const utterance = new window.SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    window.speechSynthesis.speak(utterance);
  }
}

export default function FlashcardSetDetail({ id }: { id: string }) {
  const [flashcardSet, setFlashcardSet] = useState<IFlashcardSet | null>(null);
  const [flashcards, setFlashcards] = useState<IFlashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  const { showConfirmation } = useConfirmation();
  const [isFlashcardModalOpen, setIsFlashcardModalOpen] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchFlashcardSet = async () => {
      try {
        const response = await flashcardSetService.getFlashcardSetById(id);
        setFlashcardSet(response.flashcardSet);
        
        // Fetch flashcards for this set
        const flashcardsResponse = await flashcardService.getFlashcards(id, 1, 100);
        setFlashcards(flashcardsResponse.data);
        setLoading(false);
      } catch (error) {
        showToast(
          error instanceof AxiosError
            ? error.response?.data.message
            : "Failed to fetch flashcard set",
          "error"
        );
        setLoading(false);
      }
    };
    fetchFlashcardSet();
  }, [id]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (e.code === "ArrowLeft" && currentCardIndex > 0) {
        setCurrentCardIndex(currentCardIndex - 1);
        setFlipped(false);
      } else if (e.code === "ArrowRight" && currentCardIndex < flashcards.length - 1) {
        setCurrentCardIndex(currentCardIndex + 1);
        setFlipped(false);
      } else if (e.code === "Space") {
        setFlipped((f) => !f);
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentCardIndex, flashcards.length]);

  const handleDeleteFlashcardSet = async (id: string) => {
    const confirmed = await showConfirmation({
      title: "Delete Flashcard Set",
      message:
        "Are you sure you want to delete this flashcard set? This action cannot be undone.",
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "danger",
    });
    if (!confirmed) return;
    try {
      await flashcardSetService.deleteFlashcardSet(id);
      showToast("Flashcard set deleted successfully", "success");
      router.push("/flashcard-sets");
    } catch (error) {
      showToast(
        error instanceof AxiosError
          ? error.response?.data.message
          : "Failed to delete flashcard set",
        "error"
      );
    }
  };

  const formatDate = (dateString: string | Date | undefined) => {
    if (!dateString) return "Unknown";
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch {
      return "Unknown";
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-4 justify-center items-center min-h-[100vh]">
        <LoadingSpinner />
        <p className="text-white">Loading flashcard set...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#202020] py-8 px-4">
      <div className="w-full max-w-4xl mx-auto">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Flashcard Sets", href: "/flashcard-sets" },
            { label: flashcardSet?.name || "Detail" },
          ]}
        />
        {flashcardSet && (
          <>
            {/* Section 1: Flashcard Set Details */}
            <div className="bg-[#2b2b2b] rounded-lg shadow-lg p-8 mt-4 mb-6">
              {/* Header with Edit/Delete Buttons */}
              <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-4">
                <div className="flex justify-between items-start flex-1">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold mb-4 break-words text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                      {flashcardSet.name}
                    </h1>

                    {/* Creation date */}
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                      <Calendar className="w-4 h-4" />
                      <span>Created at {formatDate(flashcardSet.createdAt)}</span>
                    </div>
                  </div>

                  {user?._id?.toString() === flashcardSet.userId?.toString() && (
                    <button
                      className="mt-2 px-4 py-2 rounded-lg bg-slate-800/50 text-white border border-slate-600 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all duration-300 text-sm sm:text-base font-semibold hover:bg-slate-700"
                      onClick={() => setIsFlashcardModalOpen(true)}
                    >
                      Manage Flashcards
                    </button>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <p className="text-gray-300 text-lg leading-relaxed">
                  {flashcardSet.description || (
                    <span className="italic text-gray-500">
                      No description provided.
                    </span>
                  )}
                </p>
              </div>

              {/* User Info */}
              <div className="mb-4">
                <Link
                  href={`/profile/${flashcardSet.userId}`}
                  className="inline-flex items-center gap-3 hover:opacity-80 transition-opacity"
                >
                  {flashcardSet.user?.avatar ? (
                                      <Image
                    src={flashcardSet.user.avatar}
                    alt={flashcardSet.user.username}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-lg border-2 border-white shadow"
                  />
                  ) : (
                                      <div className="w-12 h-12 rounded-lg border-2 border-white shadow bg-white flex items-center justify-center">
                    <User className="w-6 h-6 text-gray-800" />
                  </div>
                  )}
                  <div className="flex flex-col">
                    <span className="text-lg text-white font-semibold">
                      {flashcardSet.user?.username || "Unknown User"}
                    </span>
                    <span className="text-sm text-gray-400">Creator</span>
                  </div>
                </Link>
              </div>

              {/* Flashcard Count */}
              <div className="bg-[#414a4c] rounded-lg p-4 flex items-center justify-center gap-3">
                <BookOpen className="w-6 h-6 text-white" />
                <div className="font-bold text-xl">
                  {flashcards.length} {flashcards.length === 1 ? "flashcard" : "flashcards"}
                </div>
              </div>
            </div>

            {/* Section 2: Flashcard Practice Animation */}
            {flashcards.length > 0 && (
              <div className="bg-[#2b2b2b] rounded-lg shadow-lg p-8 mb-6">
                <h2 className="text-2xl font-bold text-white mb-6 text-center">Practice Flashcard</h2>
                
                {/* Interactive Flashcard */}
                <div className="flex flex-col items-center">
                  <div className="flex items-center justify-center gap-4 mb-4 w-[90%]">
                    <button
                      className={`w-12 h-12 flex items-center justify-center text-white bg-[#373737] rounded-lg shadow-md disabled:opacity-50 transition-all hover:bg-[#505050] ${
                        currentCardIndex <= 0 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                      }`}
                      onClick={() => {
                        setCurrentCardIndex(currentCardIndex - 1);
                        setFlipped(false);
                      }}
                      disabled={currentCardIndex <= 0}
                    >
                      <ArrowLeft className="w-6 h-6" />
                    </button>

                    <div
                      className="flashcard-flip w-full max-w-md min-w-[100%] h-[300px] cursor-pointer transition-all duration-300 hover:scale-[1.02]"
                      onClick={() => setFlipped((f) => !f)}
                      title="Click to flip"
                    >
                      <div
                        className={`flashcard-inner bg-gradient-to-br from-[#232526] to-[#414345] shadow-lg border border-gray-700 rounded-lg ${
                          flipped ? "flashcard-flipped" : ""
                        } h-full`}
                      >
                        <div className="flashcard-front text-3xl text-white font-extrabold select-none flex items-center justify-center h-full p-6 text-center relative">
                          <button
                            onClick={e => { e.stopPropagation(); speak(flashcards[currentCardIndex]?.englishContent || '', 'en-US'); }}
                            className="absolute top-3 right-3 p-1 rounded hover:bg-white/10 z-10"
                            title="Listen to English"
                            type="button"
                          >
                            <Volume2 className="w-5 h-5 text-white" />
                          </button>
                          <span className="text-3xl text-white font-extrabold select-none text-center">
                            {flashcards[currentCardIndex]?.englishContent}
                          </span>
                        </div>
                        <div className="flashcard-back text-3xl text-white font-extrabold select-none flex items-center justify-center h-full p-6 text-center relative">
                          <button
                            onClick={e => { e.stopPropagation(); speak(flashcards[currentCardIndex]?.vietnameseContent || '', 'vi-VN'); }}
                            className="absolute top-3 right-3 p-1 rounded hover:bg-white/10 z-10"
                            title="Listen to Vietnamese"
                            type="button"
                          >
                            <Volume2 className="w-5 h-5 text-white" />
                          </button>
                          <span className="text-3xl text-white font-extrabold select-none text-center">
                            {flashcards[currentCardIndex]?.vietnameseContent}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      className={`w-12 h-12 flex items-center justify-center text-white bg-[#373737] rounded-lg shadow-md disabled:opacity-50 transition-all hover:bg-[#505050] ${
                        currentCardIndex >= flashcards.length - 1 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                      }`}
                      onClick={() => {
                        setCurrentCardIndex(currentCardIndex + 1);
                        setFlipped(false);
                      }}
                      disabled={currentCardIndex >= flashcards.length - 1}
                    >
                      <ArrowRight className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Progress and Instructions */}
                  <div className="text-center">
                    <div className="text-gray-300 text-lg mb-2">
                      {currentCardIndex + 1} of {flashcards.length}
                    </div>
                    <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <kbd className="px-2 py-1 bg-gray-800 rounded text-xs">←</kbd>
                        <span>Previous</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <kbd className="px-2 py-1 bg-gray-800 rounded text-xs">→</kbd>
                        <span>Next</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <kbd className="px-2 py-1 bg-gray-800 rounded text-xs">Space</kbd>
                        <span>Flip</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Section 3: All Flashcards List */}
            <div className="bg-[#2b2b2b] rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-white mb-6">All Flashcards</h2>
              
              {flashcards.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400 text-lg">No flashcards in this set yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {flashcards.map((card, index) => (
                    <div
                      key={card._id?.toString()}
                      className={`bg-[#414a4c] rounded-lg p-6 border transition-all duration-200 ${
                        index === currentCardIndex ? "border-white shadow-lg" : "border-transparent"
                      }`}
                    >
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white mb-3">English</h3>
                          <div className="flex items-center gap-2">
                            <span className="text-white text-xl leading-relaxed">{card.englishContent}</span>
                            <button
                              onClick={() => speak(card.englishContent, 'en-US')}
                              className="p-1 rounded hover:bg-white/10"
                              title="Listen to English"
                              type="button"
                            >
                              <Volume2 className="w-4 h-4 text-white" />
                            </button>
                          </div>
                        </div>
                        <div className="hidden md:block w-px bg-white/30"></div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white mb-3">Vietnamese</h3>
                          <div className="flex items-center gap-2">
                            <span className="text-white text-xl leading-relaxed">{card.vietnameseContent}</span>
                            <button
                              onClick={() => speak(card.vietnameseContent, 'vi-VN')}
                              className="p-1 rounded hover:bg-white/10"
                              title="Listen to Vietnamese"
                              type="button"
                            >
                              <Volume2 className="w-4 h-4 text-white" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
      <FlashcardManagementModal
        isOpen={isFlashcardModalOpen}
        onClose={() => setIsFlashcardModalOpen(false)}
        setId={id}
      />
    </div>
  );
}
