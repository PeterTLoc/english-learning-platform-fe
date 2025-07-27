"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import FlashcardSetService from "@/services/flashcardSetService";
import { IFlashcardSet } from "@/types/models/IFlashcardSet";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { X, Save } from "lucide-react";
import { AxiosError } from "axios";

const flashcardSetService = new FlashcardSetService();

interface FlashcardSetEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  flashcardSet: IFlashcardSet | null;
  onUpdate: () => void;
}

export default function FlashcardSetEditModal({
  isOpen,
  onClose,
  flashcardSet,
  onUpdate,
}: FlashcardSetEditModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [originalData, setOriginalData] = useState({ name: "", description: "" });

  const { user } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    if (isOpen && flashcardSet) {
      setName(flashcardSet.name || "");
      setDescription(flashcardSet.description || "");
      setOriginalData({
        name: flashcardSet.name || "",
        description: flashcardSet.description || "",
      });
    }
  }, [isOpen, flashcardSet]);

  const handleUpdate = async () => {
    if (!flashcardSet) return;

    if (!name.trim()) {
      showToast("Please enter a name for your flashcard set", "error");
      return;
    }

    if (!user?._id) {
      showToast("You must be logged in to update a flashcard set", "error");
      return;
    }

    // Check if there are any changes
    if (name.trim() === originalData.name && description.trim() === originalData.description) {
      showToast("No changes detected", "error");
      return;
    }

    setSubmitting(true);
    try {
      await flashcardSetService.updateFlashcardSet(
        flashcardSet._id as string, 
        name.trim(), 
        description.trim()
      );
      showToast("Flashcard set updated successfully!", "success");
      onUpdate();
      onClose();
    } catch (error) {
      console.error("Error updating flashcard set:", error);
      const errorMessage = error instanceof AxiosError 
        ? error.response?.data?.message || "Failed to update flashcard set"
        : "Failed to update flashcard set";
      showToast(errorMessage, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    const hasChanges = name.trim() !== originalData.name || description.trim() !== originalData.description;
    
    if (hasChanges) {
      if (confirm("Are you sure you want to discard your changes?")) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  const hasChanges = () => {
    return name.trim() !== originalData.name || description.trim() !== originalData.description;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#202020] border border-[#1D1D1D] rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">
            Edit Flashcard Set
          </h2>
          <button
            onClick={handleCancel}
            className="text-[#CFCFCF] hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }} className="space-y-4">
          {/* Name Input */}
          <div>
            <label className="block text-sm font-medium text-[#CFCFCF] mb-2">
              Set Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 bg-[#2D2D2D] border border-[#1D1D1D] rounded-md text-white placeholder-[#CFCFCF] focus:outline-none focus:border-[#4CC2FF] transition-colors"
              placeholder="Enter flashcard set name"
              maxLength={100}
              required
            />
            <div className="flex justify-between items-center mt-1">
              <span className="text-xs text-[#CFCFCF]">
                Maximum 100 characters
              </span>
              <span className="text-xs text-[#CFCFCF]">
                {name.length}/100
              </span>
            </div>
          </div>

          {/* Description Input */}
          <div>
            <label className="block text-sm font-medium text-[#CFCFCF] mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 bg-[#2D2D2D] border border-[#1D1D1D] rounded-md text-white placeholder-[#CFCFCF] focus:outline-none focus:border-[#4CC2FF] transition-colors resize-none"
              placeholder="Enter a description for your flashcard set (optional)"
              rows={4}
              maxLength={500}
            />
            <div className="flex justify-between items-center mt-1">
              <span className="text-xs text-[#CFCFCF]">
                Maximum 500 characters
              </span>
              <span className="text-xs text-[#CFCFCF]">
                {description.length}/500
              </span>
            </div>
          </div>

          {/* Info Card */}
          <div className="bg-[#2D2D2D] border border-[#1D1D1D] rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#4CC2FF] flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white mb-1">
                  Edit Information
                </h3>
                <p className="text-sm text-[#CFCFCF]">
                  Update your flashcard set name and description. The changes will be saved immediately when you click "Update Set".
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 px-4 py-2 bg-[#2D2D2D] text-white border border-[#1D1D1D] rounded-lg hover:bg-[#373737] transition-colors font-semibold"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!hasChanges() || !name.trim() || submitting}
              className="flex-1 px-4 py-2 bg-[#4CC2FF] text-black rounded-lg font-semibold hover:bg-[#3AA0DB] transition-colors disabled:bg-[#666] disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <LoadingSpinner size="small" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Update Set
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 