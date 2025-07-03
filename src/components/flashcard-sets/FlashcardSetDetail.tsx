"use client";
import { IFlashcardSet } from "@/types/models/IFlashcardSet";
import React, { useEffect, useState } from "react";
import FlashcardSetService from "@/services/flashcardSetService";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import LoadingSpinner from "../ui/LoadingSpinner";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import DeleteConfirmModal from "../common/DeleteModal";
import { useRouter } from "next/navigation";
const flashcardSetService = new FlashcardSetService();
export default function FlashcardSetDetail({ id }: { id: string }) {
  const [flashcardSet, setFlashcardSet] = useState<IFlashcardSet | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const router = useRouter();
  useEffect(() => {
    const fetchFlashcardSet = async () => {
      try {
        const response = await flashcardSetService.getFlashcardSetById(id);
        setFlashcardSet(response.flashcardSet);
        setLoading(false);
      } catch (error) {
        toast.error(
          error instanceof AxiosError
            ? error.response?.data.message
            : "Failed to fetch flashcard set"
        );
        setLoading(false);
      }
    };
    fetchFlashcardSet();
  }, [id]);

  const handleDeleteFlashcardSet = async (id: string) => {
    try {
      await flashcardSetService.deleteFlashcardSet(id);
      toast.success("Flashcard set deleted successfully");
    } catch (error) {
      toast.error(
        error instanceof AxiosError
          ? error.response?.data.message
          : "Failed to delete flashcard set"
      );
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex flex-col items-center min-h-[60vh] py-6 sm:py-8 px-2 sm:px-4">
      {flashcardSet && (
        <div className="relative w-full max-w-md sm:max-w-lg md:max-w-xl bg-gradient-to-br from-[#232526] to-[#414345] rounded-2xl shadow-2xl border border-gray-700 p-4 sm:p-6 md:p-8 flex flex-col gap-4 sm:gap-6">
          {/* Edit/Delete Buttons */}
          {user?._id?.toString() === flashcardSet.userId?.toString() && (
            <div className="absolute top-2 right-2 sm:top-4 sm:right-4 flex gap-2">
              <Link href={`/flashcard-sets/${flashcardSet._id}/edit`}>
                <button className="bg-[#4CC2FF] hover:bg-[#38aee6] text-white px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-semibold shadow">
                  Edit
                </button>
              </Link>
              <button
                className="bg-red-600 hover:bg-red-700 text-white px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-semibold shadow"
                onClick={() =>
                  setDeleteTarget(flashcardSet._id?.toString() || "")
                }
              >
                Delete
              </button>
            </div>
          )}

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-2 break-words text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
            {flashcardSet.name}
          </h1>

          {/* Description */}
          <p className="text-gray-300 text-base sm:text-lg mb-2 sm:mb-4 min-h-[2rem]">
            {flashcardSet.description || (
              <span className="italic text-gray-500">
                No description provided.
              </span>
            )}
          </p>

          {/* User Info */}
          <Link
            href={`/flashcard-sets?userId=${flashcardSet.userId}`}
            className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-4 hover:opacity-80 transition"
          >
            {flashcardSet.user?.avatar ? (
              <Image
                src={flashcardSet.user.avatar}
                alt={flashcardSet.user.username}
                width={36}
                height={36}
                className="w-9 h-9 sm:w-11 sm:h-11 rounded-full border-2 border-[#4CC2FF] shadow"
              />
            ) : (
              <span className="w-9 h-9 sm:w-11 sm:h-11 rounded-full border-2 border-[#4CC2FF] shadow bg-[#4CC2FF] flex items-center justify-center">
                <span className="text-white text-base sm:text-lg font-medium">
                  {flashcardSet.user?.username?.charAt(0).toUpperCase()}
                </span>
              </span>
            )}
            <span className="text-base sm:text-lg text-[#4CC2FF] font-semibold max-w-20 sm:max-w-32 truncate">
              {flashcardSet.user?.username}
            </span>
          </Link>

          {/* Terms and Start Practicing */}
          <div className="flex flex-col sm:flex-row items-center justify-between mt-2 gap-2 sm:gap-0">
            <span className="px-4 sm:px-6 py-2 rounded-lg text-base sm:text-lg font-bold bg-[#414a4c] text-white flex items-center justify-center h-[40px] sm:h-[48px] shadow">
              {flashcardSet.flashcardCount ?? 0}{" "}
              {(flashcardSet.flashcardCount ?? 0) === 1 ? "term" : "terms"}
            </span>
            <button
              className={`px-4 sm:px-6 py-2 rounded-lg text-base sm:text-lg font-bold transition shadow-md ${
                (flashcardSet.flashcardCount ?? 0) > 0
                  ? "bg-[#4CC2FF] text-white hover:bg-[#38aee6] cursor-pointer"
                  : "bg-gray-600 text-gray-300 cursor-not-allowed"
              }`}
              disabled={(flashcardSet.flashcardCount ?? 0) === 0}
              onClick={() =>
                router.push(`/flashcard-sets/${flashcardSet._id}/practice`)
              }
            >
              Start Practicing
            </button>
          </div>
          {(flashcardSet.flashcardCount ?? 0) === 0 && (
            <h5 className="text-xs text-red-400 text-right mt-2">
              This flashcard set does not have any flashcards.
            </h5>
          )}
        </div>
      )}
      {deleteTarget && (
        <DeleteConfirmModal
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onDelete={() => {
            handleDeleteFlashcardSet(deleteTarget);
            setDeleteTarget(null);
          }}
        />
      )}
    </div>
  );
}
