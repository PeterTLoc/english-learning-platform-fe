import React, { useEffect, useState } from "react";
import FlashcardService from "@/services/flashcardService";
import { IFlashcard } from "@/types/models/IFlashcard";
import { AxiosError } from "axios";
import { useToast } from "@/context/ToastContext";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import CreateFlashcardModal from "./edit/CreateFlashcardModal";
import ConfirmationModal from "@/components/ui/ConfirmationModal";

const flashcardService = new FlashcardService();

export default function FlashcardManagementModal({
  isOpen,
  onClose,
  setId,
}: {
  isOpen: boolean;
  onClose: () => void;
  setId: string;
}) {
  const [flashcards, setFlashcards] = useState<IFlashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { showToast } = useToast();
  const [editingFlashcard, setEditingFlashcard] = useState<IFlashcard | null>(
    null
  );
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    const fetchFlashcards = async () => {
      try {
        const response = await flashcardService.getFlashcards(
          setId,
          1,
          100,
          "desc",
          "date",
          ""
        );
        setFlashcards(response.data);
        setLoading(false);
      } catch (error) {
        showToast(
          error instanceof AxiosError
            ? error.response?.data.message
            : "Failed to fetch flashcards",
          "error"
        );
        setLoading(false);
      }
    };
    fetchFlashcards();
  }, [isOpen, setId]);

  const handleCreateFlashcard = async (
    englishContent: string,
    vietnameseContent: string
  ) => {
    try {
      const response = await flashcardService.createFlashcard({
        englishContent,
        vietnameseContent,
        flashcardSetId: setId,
      });
      showToast("Flashcard created successfully", "success");
      setFlashcards([...flashcards, response.flashcard]);
      setIsCreateModalOpen(false);
    } catch (error) {
      showToast(
        error instanceof AxiosError
          ? error.response?.data.message
          : "Failed to create flashcard",
        "error"
      );
    }
  };

  const handleDeleteFlashcard = async (id: string) => {
    try {
      await flashcardService.deleteFlashcard(id);
      setFlashcards(flashcards.filter((card) => card._id !== id));
      showToast("Flashcard deleted successfully", "success");
    } catch (error) {
      showToast(
        error instanceof AxiosError
          ? error.response?.data.message
          : "Failed to delete flashcard",
        "error"
      );
    }
  };

  const handleEditClick = (card: IFlashcard) => {
    setEditingFlashcard(card);
  };

  const handleUpdateFlashcardModal = async (
    englishContent: string,
    vietnameseContent: string
  ) => {
    if (!editingFlashcard) return;
    try {
      const response = await flashcardService.updateFlashcard(
        editingFlashcard._id as string,
        { englishContent, vietnameseContent }
      );
      setFlashcards(
        flashcards.map((card) =>
          card._id === editingFlashcard._id ? response.flashcard : card
        )
      );
      setEditingFlashcard(null);
      showToast("Flashcard updated successfully", "success");
    } catch (error) {
      showToast(
        error instanceof AxiosError
          ? error.response?.data.message
          : "Failed to update flashcard",
        "error"
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#202020] border border-[#1D1D1D] rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">
            Manage Flashcards
          </h2>
          <button
            onClick={onClose}
            className="text-[#CFCFCF] hover:text-white transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <button
          className="mb-4 px-4 py-2 rounded-lg bg-slate-800/50 text-white border border-slate-600 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all duration-300 text-sm sm:text-base font-semibold hover:bg-slate-700"
          onClick={() => setIsCreateModalOpen(true)}
        >
          Add Flashcard
        </button>
        {loading ? (
          <div className="flex flex-col gap-4 justify-center items-center min-h-[200px]">
            <LoadingSpinner />
            <p className="text-slate-300 text-lg">Loading flashcards...</p>
          </div>
        ) : !flashcards.length ? (
          <div className="flex flex-col items-center justify-center min-h-[200px] py-8">
            <div className="w-20 h-20 mb-6 bg-slate-700 rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 text-slate-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-200 mb-3">
              No flashcards found
            </h3>
            <p className="text-slate-400 text-base mb-8">
              Try creating your first flashcard for this set!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {flashcards.map((card: IFlashcard, index: number) => (
              <div
                key={card._id?.toString()}
                className="bg-[#2D2D2D] border border-[#1D1D1D] rounded-lg p-4"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-[#CFCFCF] font-medium">
                    Flashcard #{index + 1}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditClick(card)}
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
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="text-[#CFCFCF] text-xs mb-1">English</div>
                    <div className="text-white text-lg">
                      {card.englishContent}
                    </div>
                  </div>
                  <div className="hidden md:block w-px bg-white/30"></div>
                  <div className="flex-1">
                    <div className="text-[#CFCFCF] text-xs mb-1">
                      Vietnamese
                    </div>
                    <div className="text-white text-lg">
                      {card.vietnameseContent}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <CreateFlashcardModal
          isOpen={!!editingFlashcard}
          onClose={() => setEditingFlashcard(null)}
          onCreate={handleUpdateFlashcardModal}
          initialEnglish={editingFlashcard?.englishContent || ""}
          initialVietnamese={editingFlashcard?.vietnameseContent || ""}
          mode="edit"
        />
        <CreateFlashcardModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreateFlashcard}
          mode="create"
        />
      </div>
      <ConfirmationModal
        isOpen={!!deleteTarget}
        title="Delete Flashcard"
        message="Are you sure you want to delete this flashcard? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        onConfirm={async () => {
          if (deleteTarget) {
            await handleDeleteFlashcard(deleteTarget);
            setDeleteTarget(null);
          }
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
