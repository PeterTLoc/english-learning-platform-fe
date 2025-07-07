"use client";

import { IFlashcardSet } from "@/types/models/IFlashcardSet";

interface FlashcardSetDetailsModalProps {
  flashcardSet: IFlashcardSet;
  isOpen: boolean;
  onClose: () => void;
}

export default function FlashcardSetDetailsModal({
  flashcardSet,
  isOpen,
  onClose,
}: FlashcardSetDetailsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#202020] border border-[#1D1D1D] rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">
            Flashcard Set Details
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

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#CFCFCF] mb-2">
              Name
            </label>
            <p className="text-white text-lg font-semibold">
              {flashcardSet.name || "Untitled Set"}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#CFCFCF] mb-2">
              Description
            </label>
            <p className="text-white">
              {flashcardSet.description || "No description provided"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#CFCFCF] mb-2">
                Owner
              </label>
              <p className="text-white">
                {flashcardSet.user?.username || "Unknown User"}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#CFCFCF] mb-2">
                Flashcard Count
              </label>
              <p className="text-white">
                {flashcardSet.flashcardCount || 0} flashcards
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#CFCFCF] mb-2">
                Status
              </label>
              <span
                className={`px-2 py-1 rounded text-sm ${
                  flashcardSet.isDeleted
                    ? "bg-red-900 text-red-300"
                    : "bg-[#373737] text-[#4CC2FF]"
                }`}
              >
                {flashcardSet.isDeleted ? "Deleted" : "Active"}
              </span>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#CFCFCF] mb-2">
                Created At
              </label>
              <p className="text-white">
                {flashcardSet.createdAt
                  ? new Date(flashcardSet.createdAt).toLocaleString()
                  : "N/A"}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#CFCFCF] mb-2">
                Last Updated
              </label>
              <p className="text-white">
                {flashcardSet.updatedAt
                  ? new Date(flashcardSet.updatedAt).toLocaleString()
                  : "N/A"}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#CFCFCF] mb-2">
                ID
              </label>
              <p className="text-white text-sm">
                {flashcardSet._id?.toString()}
              </p>
            </div>
          </div>

          {flashcardSet.user && (
            <div>
              <label className="block text-sm font-medium text-[#CFCFCF] mb-2">
                Owner Details
              </label>
              <div className="bg-[#2D2D2D] p-3 rounded-md">
                <p className="text-white">
                  <span className="text-[#CFCFCF]">Username:</span>{" "}
                  {flashcardSet.user.username}
                </p>
                <p className="text-white">
                  <span className="text-[#CFCFCF]">Email:</span>{" "}
                  {flashcardSet.user.email}
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-end pt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[#2b2b2b] text-white font-semibold rounded-md hover:bg-[#373737] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 