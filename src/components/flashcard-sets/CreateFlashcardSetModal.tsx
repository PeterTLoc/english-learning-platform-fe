"use client";
import React, { useState } from "react";

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
    <div
      id="crud-modal"
      tabIndex={-1}
      aria-hidden="true"
      className="fixed inset-0 z-50 flex justify-center items-center overflow-y-auto overflow-x-hidden bg-black bg-opacity-50 p-4"
    >
      <div className="relative w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl max-h-full">
        <div className="relative bg-[#232526] rounded-lg shadow-lg border border-gray-700">
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-5 md:p-6 border-b rounded-t border-gray-700">
            <h3 className="text-lg sm:text-xl font-semibold text-white">
              Create New Flashcard Set
            </h3>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-[#414345] hover:text-white rounded-lg text-sm w-8 h-8 sm:w-10 sm:h-10 ms-auto inline-flex justify-center items-center transition-colors duration-200"
              data-modal-toggle="crud-modal"
              onClick={onClose}
            >
              <svg
                className="w-3 h-3 sm:w-4 sm:h-4"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>

          {/* Body */}
          <div className="p-4 sm:p-5 md:p-6">
            <div className="space-y-4 sm:space-y-5 mb-4 sm:mb-6">
              {/* Name Input */}
              <div>
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm sm:text-base font-medium text-white"
                >
                  Name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  name="name"
                  id="name"
                  className="bg-[#414345] border border-gray-700 text-white text-sm sm:text-base rounded-lg focus:ring-[#4CC2FF] focus:border-[#4CC2FF] block w-full p-2.5 sm:p-3 placeholder-gray-400 transition-colors duration-200"
                  placeholder="Type flashcard set name"
                  required
                />
              </div>

              {/* Description Input */}
              <div>
                <label
                  htmlFor="description"
                  className="block mb-2 text-sm sm:text-base font-medium text-white"
                >
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  id="description"
                  rows={4}
                  className="block p-2.5 sm:p-3 w-full text-sm sm:text-base text-white bg-[#414345] rounded-lg border border-gray-700 focus:ring-[#4CC2FF] focus:border-[#4CC2FF] placeholder-gray-400 resize-none transition-colors duration-200"
                  placeholder="Write flashcard set description here"
                ></textarea>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-end">
              {/* Cancel Button (visible on mobile) */}
              <button
                className="sm:hidden text-gray-400 hover:text-white border border-gray-700 hover:bg-[#414345] focus:ring-4 focus:outline-none focus:ring-gray-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-colors duration-200"
                onClick={onClose}
              >
                Cancel
              </button>

              {/* Create Button */}
              <button
                className="text-white inline-flex items-center justify-center bg-[#4CC2FF] hover:bg-[#38aee6] focus:ring-4 focus:outline-none focus:ring-[#4CC2FF]/40 font-medium rounded-lg text-sm sm:text-base px-5 py-2.5 sm:px-6 sm:py-3 text-center shadow-md shadow-[#4CC2FF]/20 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => onCreate(name, description)}
                disabled={!name.trim()}
              >
                <svg
                  className="me-2 -ms-1 w-4 h-4 sm:w-5 sm:h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                Create Flashcard Set
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
