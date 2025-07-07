"use client";
import React, { useEffect, useState } from "react";
import FlashcardService from "@/services/flashcardService";
import { IFlashcard } from "@/types/models/IFlashcard";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import CreateFlashcardModal from "./CreateFlashcardModal";
import ServerPagination from "@/components/common/ServerPagination";
import Breadcrumb from "@/components/common/Breadcrumb";
import DeleteConfirmModal from "@/components/admin/blogs/DeleteConfirmModal";

const flashcardService = new FlashcardService();

export default function FlashcardList({
  id,
  page,
  size,
  order,
  sort,
  search,
}: {
  id: string;
  page: number;
  size: number;
  order: string;
  sort: string;
  search: string;
}) {
  const [flashcards, setFlashcards] = useState<IFlashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(page);
  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const response = await flashcardService.getFlashcards(
          id,
          page,
          size,
          order,
          sort,
          search
        );
        // console.log(response);
        setFlashcards(response.data);
        setTotalPages(response.totalPages);
        setCurrentPage(response.page);
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
  }, [id, page, size, order, sort, search]);

  const handleCreateFlashcard = async (
    englishContent: string,
    vietnameseContent: string
  ) => {
    try {
      const response = await flashcardService.createFlashcard(
        englishContent,
        vietnameseContent,
        id
      );

      setFlashcards([...flashcards, response.flashcard]);
      setIsCreateModalOpen(false);
      toast.success("Flashcard created successfully");
    } catch (error) {
      toast.error(
        error instanceof AxiosError
          ? error.response?.data.message
          : "Failed to create flashcard"
      );
    }
  };

  const handleDeleteFlashcard = async (id: string) => {
    try {
      await flashcardService.deleteFlashcard(id);
      setFlashcards(flashcards.filter((card) => card._id !== id));
      setDeleteTarget(null);
      toast.success("Flashcard deleted successfully");
    } catch (error) {
      toast.error(
        error instanceof AxiosError
          ? error.response?.data.message
          : "Failed to delete flashcard"
      );
    }
  };

  const handleUpdateFlashcard = async (
    id: string,
    englishContent: string,
    vietnameseContent: string
  ) => {
    try {
      const response = await flashcardService.updateFlashcard(
        id,
        englishContent,
        vietnameseContent
      );
      setFlashcards(
        flashcards.map((card) => (card._id === id ? response.flashcard : card))
      );
      toast.success("Flashcard updated successfully");
    } catch (error) {
      toast.error(
        error instanceof AxiosError
          ? error.response?.data.message
          : "Failed to update flashcard"
      );
    }
  };
  if (loading)
    return (
      <div className="flex flex-col gap-4 justify-center items-center h-screen">
        <LoadingSpinner />
        <p className="text-slate-300 text-lg">Loading flashcards...</p>
      </div>
    );

  if (!flashcards.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] py-12">
        <div className="w-20 h-20 mb-6 bg-slate-700 rounded-full flex items-center justify-center">
          {/* Use a book or search icon from lucide-react or similar */}
          <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" /></svg>
        </div>
        <h3 className="text-xl font-semibold text-slate-200 mb-3">No flashcards found</h3>
        <p className="text-slate-400 text-base mb-8">Try creating your first flashcard for this set!</p>
        <button
          className="px-4 py-2 rounded-lg bg-slate-800/50 text-white border border-slate-600 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all duration-300 text-sm sm:text-base font-semibold hover:bg-slate-700"
          onClick={() => setIsCreateModalOpen(true)}
        >
          Add Flashcard
        </button>
      </div>
    );
  }

  return (
    <div className="w-full px-2 sm:px-0">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Flashcard Sets", href: "/flashcard-sets" },
          { label: "Edit", href: undefined },
          { label: "Flashcards" },
        ]}
      />
      <div className="flex flex-col sm:flex-row justify-between items-center my-5 gap-3">
        <h1 className="text-xl sm:text-2xl font-bold">Flashcard List</h1>
        <button
          className="px-4 py-2 rounded-lg bg-slate-800/50 text-white border border-slate-600 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all duration-300 text-sm sm:text-base font-semibold hover:bg-slate-700"
          onClick={() => setIsCreateModalOpen(true)}
        >
          Add Flashcard
        </button>
      </div>

      <div className="space-y-4 mb-8">
        {flashcards.map((card: IFlashcard, index: number) => (
          <div
            key={card._id?.toString()}
            className="bg-[#2D2D2D] border border-[#1D1D1D] rounded-lg p-4"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-[#CFCFCF] font-medium">Flashcard #{index + 1}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleUpdateFlashcard(card._id as string, card.englishContent, card.vietnameseContent)}
                  className="px-3 py-1 text-sm bg-[#4CC2FF] text-black rounded hover:bg-[#3AA0DB] transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => setDeleteTarget(card._id as string)}
                  className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-[#CFCFCF] text-xs mb-1">English</div>
                <div className="text-white text-lg">{card.englishContent}</div>
              </div>
              <div>
                <div className="text-[#CFCFCF] text-xs mb-1">Vietnamese</div>
                <div className="text-white text-lg">{card.vietnameseContent}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-4">
        <ServerPagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={size}
        />
      </div>
      <CreateFlashcardModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateFlashcard}
      />
      {deleteTarget && (
        <DeleteConfirmModal
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onDelete={() => handleDeleteFlashcard(deleteTarget)}
        />
      )}
    </div>
  );
}
