"use client";
import React, { useEffect, useState } from "react";
import FlashcardService from "@/services/flashcardService";
import { IFlashcard } from "@/types/models/IFlashcard";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import CreateFlashcardModal from "./CreateFlashcardModal";
import ServerPagination from "@/components/common/ServerPagination";
import FlashcardRow from "./FlashcardRow";
import DeleteConfirmModal from "@/components/common/DeleteModal";

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
        setFlashcards(response.data);
        setTotalPages(response.totalPages);
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
  }, []);

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
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );

  return (
    <div className="w-full px-2 sm:px-0">
      {/* <div className="my-10 mx-auto w-1/2">
        <FilterBox
          onSearch={handleSearch}
          initialSort={sort}
          initialOrder={order}
        />
      </div> */}

      <div className="flex flex-col sm:flex-row justify-between items-center my-5 gap-3">
        <h1 className="text-xl sm:text-2xl font-bold">Flashcard List</h1>
        <button
          className="px-4 py-2 rounded-md text-white font-semibold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 hover:from-pink-400 hover:via-purple-400 hover:to-blue-400 transition-colors shadow"
          onClick={() => setIsCreateModalOpen(true)}
        >
          Create Flashcard
        </button>
      </div>

      <div className="overflow-x-auto w-full">
        <table className="min-w-[600px] w-full bg-[#232526] border border-gray-700 rounded-lg">
          <thead>
            <tr>
              <th className="px-2 sm:px-4 py-2 text-left text-white text-sm sm:text-base">
                English
              </th>
              <th className="px-2 sm:px-4 py-2 text-left text-white text-sm sm:text-base">
                Vietnamese
              </th>
              <th className="px-2 sm:px-4 py-2 text-left text-white text-sm sm:text-base">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {flashcards.map((card: IFlashcard) => (
              <FlashcardRow
                key={card._id?.toString()}
                card={card}
                onDelete={setDeleteTarget}
                onUpdate={handleUpdateFlashcard}
              />
            ))}
          </tbody>
        </table>
      </div>
      <ServerPagination
        currentPage={page}
        totalPages={totalPages}
        pageSize={size}
      />
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
