"use client";

import { useState, useEffect } from "react";
import { IFlashcard } from "@/types/models/IFlashcard";
import FlashcardService from "@/services/flashcardService";
import FlashcardModal from "./FlashcardModal";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useToast } from "@/context/ToastContext";
import { useConfirmation } from "@/context/ConfirmationContext";
import { parseAxiosError } from "@/utils/apiErrors";

interface FlashcardListProps {
  flashcardSetId: string;
  isOpen: boolean;
  onClose: () => void;
  onFlashcardCountChange: () => void;
}

const flashcardService = new FlashcardService();

export default function FlashcardList({
  flashcardSetId,
  isOpen,
  onClose,
  onFlashcardCountChange,
}: FlashcardListProps) {
  const { showToast } = useToast();
  const { showConfirmation } = useConfirmation();

  const [flashcards, setFlashcards] = useState<IFlashcard[]>([]);
  const [loading, setLoading] = useState(false);
  const [isFlashcardModalOpen, setIsFlashcardModalOpen] = useState(false);
  const [selectedFlashcard, setSelectedFlashcard] = useState<IFlashcard | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");

  const fetchFlashcards = async () => {
    setLoading(true);
    try {
      const response = await flashcardService.getFlashcards(flashcardSetId);
      setFlashcards(response.data || []);
    } catch (error) {
      const parsedError = parseAxiosError(error);
      showToast(parsedError.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && flashcardSetId) {
      fetchFlashcards();
    }
  }, [isOpen, flashcardSetId]);

  const handleCreateFlashcard = async (data: { englishContent: string; vietnameseContent: string }) => {
    try {
      await flashcardService.createFlashcard(
        data.englishContent,
        data.vietnameseContent,
        flashcardSetId
      );
      showToast("Flashcard created successfully", "success");
      setIsFlashcardModalOpen(false);
      fetchFlashcards();
      onFlashcardCountChange();
    } catch (error) {
      const parsedError = parseAxiosError(error);
      showToast(parsedError.message, "error");
    }
  };

  const handleUpdateFlashcard = async (data: { englishContent: string; vietnameseContent: string }) => {
    if (!selectedFlashcard) return;
    
    try {
      await flashcardService.updateFlashcard(
        String(selectedFlashcard._id),
        data.englishContent,
        data.vietnameseContent
      );
      showToast("Flashcard updated successfully", "success");
      setIsFlashcardModalOpen(false);
      setSelectedFlashcard(null);
      fetchFlashcards();
    } catch (error) {
      const parsedError = parseAxiosError(error);
      showToast(parsedError.message, "error");
    }
  };

  const handleDeleteFlashcard = async (flashcardId: string) => {
    const confirmed = await showConfirmation({
      title: "Delete Flashcard",
      message: "Are you sure you want to delete this flashcard? This action cannot be undone.",
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "danger"
    });

    if (confirmed) {
      try {
        await flashcardService.deleteFlashcard(flashcardId);
        showToast("Flashcard deleted successfully", "success");
        fetchFlashcards();
        onFlashcardCountChange();
      } catch (error) {
        const parsedError = parseAxiosError(error);
        showToast(parsedError.message, "error");
      }
    }
  };

  const openCreateModal = () => {
    setModalMode("create");
    setSelectedFlashcard(null);
    setIsFlashcardModalOpen(true);
  };

  const openEditModal = (flashcard: IFlashcard) => {
    setModalMode("edit");
    setSelectedFlashcard(flashcard);
    setIsFlashcardModalOpen(true);
  };

  const closeFlashcardModal = () => {
    setIsFlashcardModalOpen(false);
    setSelectedFlashcard(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#202020] border border-[#1D1D1D] rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">
            Manage Flashcards
          </h2>
          <div className="flex gap-2">
            <button
              onClick={openCreateModal}
              className="px-4 py-2 bg-[#4CC2FF] text-black font-semibold rounded-md hover:bg-[#3AA0DB] transition-colors"
            >
              Add Flashcard
            </button>
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
        </div>

        {loading ? (
          <div className="flex flex-col items-center gap-4 justify-center py-20">
            <LoadingSpinner />
            <p className="ml-3 text-[#CFCFCF]">Loading flashcards...</p>
          </div>
        ) : flashcards.length > 0 ? (
          <div className="space-y-4">
            {flashcards.map((flashcard, index) => (
              <div
                key={String(flashcard._id)}
                className="bg-[#2D2D2D] border border-[#1D1D1D] rounded-lg p-4"
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="text-sm text-[#CFCFCF] font-medium">
                    Flashcard #{index + 1}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(flashcard)}
                      className="px-3 py-1 text-sm bg-[#4CC2FF] text-black rounded hover:bg-[#3AA0DB] transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteFlashcard(String(flashcard._id))}
                      className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#CFCFCF] mb-2">
                      English Content
                    </label>
                    <div className="bg-[#1D1D1D] p-3 rounded-md text-white min-h-[60px]">
                      {flashcard.englishContent}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#CFCFCF] mb-2">
                      Vietnamese Content
                    </label>
                    <div className="bg-[#1D1D1D] p-3 rounded-md text-white min-h-[60px]">
                      {flashcard.vietnameseContent}
                    </div>
                  </div>
                </div>

                <div className="mt-3 text-xs text-[#CFCFCF]">
                  Order: {flashcard.order || 0} | 
                  Created: {flashcard.createdAt ? new Date(flashcard.createdAt).toLocaleString() : "N/A"}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-[#CFCFCF] mb-4">No flashcards found in this set.</p>
            <button
              onClick={openCreateModal}
              className="px-4 py-2 bg-[#4CC2FF] text-black font-semibold rounded-md hover:bg-[#3AA0DB] transition-colors"
            >
              Create First Flashcard
            </button>
          </div>
        )}

        {/* Flashcard Modal */}
        {isFlashcardModalOpen && (
          <FlashcardModal
            mode={modalMode}
            flashcard={selectedFlashcard}
            flashcardSetId={flashcardSetId}
            isOpen={isFlashcardModalOpen}
            onClose={closeFlashcardModal}
            onSubmit={modalMode === "create" 
              ? handleCreateFlashcard 
              : handleUpdateFlashcard}
          />
        )}
      </div>
    </div>
  );
} 