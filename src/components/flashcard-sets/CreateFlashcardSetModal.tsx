"use client";
import React, { useState } from "react";
import { X, Plus, BookOpen } from "lucide-react";

export default function CreateFlashcardSetModal({
  isOpen,
  onClose,
  onCreate,
}: {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, description: string) => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#202020] border border-[#1D1D1D] rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Create Flashcard Set</h2>
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
        <form
          onSubmit={e => {
            e.preventDefault();
            onCreate(name, description);
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-[#CFCFCF] mb-2">
              Name *
            </label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              type="text"
              name="name"
              id="name"
              className="w-full p-3 bg-[#2D2D2D] border border-[#1D1D1D] rounded-md text-white placeholder-[#CFCFCF] focus:outline-none focus:border-[#4CC2FF]"
              placeholder="Enter flashcard set name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#CFCFCF] mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              className="w-full p-3 bg-[#2D2D2D] border border-[#1D1D1D] rounded-md text-white placeholder-[#CFCFCF] focus:outline-none focus:border-[#4CC2FF] resize-none"
              placeholder="Enter flashcard set description"
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
              className="flex-1 px-4 py-2 bg-[#4CC2FF] text-black font-semibold rounded-md hover:bg-[#3AA0DB] transition-colors flex items-center justify-center gap-2"
              disabled={!name.trim()}
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
