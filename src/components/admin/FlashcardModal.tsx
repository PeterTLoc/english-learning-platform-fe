"use client";

import { useState, useEffect } from "react";
import { IFlashcard } from "@/types/models/IFlashcard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface FlashcardModalProps {
  mode: "create" | "edit";
  flashcard: IFlashcard | null;
  flashcardSetId: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { englishContent: string; vietnameseContent: string }) => void;
}

export default function FlashcardModal({
  mode,
  flashcard,
  flashcardSetId,
  isOpen,
  onClose,
  onSubmit,
}: FlashcardModalProps) {
  const [englishContent, setEnglishContent] = useState("");
  const [vietnameseContent, setVietnameseContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && flashcard) {
        setEnglishContent(flashcard.englishContent || "");
        setVietnameseContent(flashcard.vietnameseContent || "");
      } else {
        setEnglishContent("");
        setVietnameseContent("");
      }
    }
  }, [isOpen, mode, flashcard]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!englishContent.trim()) {
      alert("English content is required");
      return;
    }

    if (!vietnameseContent.trim()) {
      alert("Vietnamese content is required");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({ 
        englishContent: englishContent.trim(), 
        vietnameseContent: vietnameseContent.trim() 
      });
    } catch (error) {
      console.error("Error submitting flashcard:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#202020] border border-[#1D1D1D] rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">
            {mode === "create" ? "Create Flashcard" : "Edit Flashcard"}
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#CFCFCF] mb-2">
              English Content *
            </label>
            <textarea
              value={englishContent}
              onChange={(e) => setEnglishContent(e.target.value)}
              rows={3}
              className="w-full p-3 bg-[#2D2D2D] border border-[#1D1D1D] rounded-md text-white placeholder-[#CFCFCF] focus:outline-none focus:border-[#4CC2FF] resize-none"
              placeholder="Enter English content"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#CFCFCF] mb-2">
              Vietnamese Content *
            </label>
            <textarea
              value={vietnameseContent}
              onChange={(e) => setVietnameseContent(e.target.value)}
              rows={3}
              className="w-full p-3 bg-[#2D2D2D] border border-[#1D1D1D] rounded-md text-white placeholder-[#CFCFCF] focus:outline-none focus:border-[#4CC2FF] resize-none"
              placeholder="Enter Vietnamese content"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-[#2b2b2b] text-white font-semibold rounded-md hover:bg-[#373737] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-[#4CC2FF] text-black font-semibold rounded-md hover:bg-[#3AA0DB] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner size="small" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{mode === "create" ? "Create" : "Update"}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 