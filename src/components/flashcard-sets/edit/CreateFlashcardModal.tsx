"use client";
import React, { useState } from "react";

export default function CreateFlashcardModal({
  isOpen,
  onClose,
  onCreate,
}: {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (englishContent: string, vietnameseContent: string) => void;
}) {
  const [englishContent, setEnglishContent] = useState("");
  const [vietnameseContent, setVietnameseContent] = useState("");

  if (!isOpen) return null;

  return (
    <div
      id="crud-modal"
      tabIndex={-1}
      aria-hidden="true"
      className="fixed inset-0 z-50 flex justify-center items-center overflow-y-auto overflow-x-hidden"
    >
      <div className="relative p-4 w-full max-w-md max-h-full">
        <div className="relative bg-[#232526] rounded-lg shadow-lg border border-gray-700">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-700">
            <h3 className="text-lg font-semibold text-white">
              Create New Flashcard
            </h3>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-[#414345] hover:text-white rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
              data-modal-toggle="crud-modal"
              onClick={onClose}
            >
              <svg
                className="w-3 h-3"
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

          <div className="p-4 md:p-5">
            <div className="grid gap-4 mb-4 grid-cols-2">
              <div className="col-span-2">
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  English
                </label>
                <input
                  value={englishContent}
                  onChange={(e) => setEnglishContent(e.target.value)}
                  type="text"
                  name="name"
                  id="name"
                  className="bg-[#414345] border border-gray-700 text-white text-sm rounded-lg focus:ring-[#4CC2FF] focus:border-[#4CC2FF] block w-full p-2.5 placeholder-gray-400"
                  placeholder="Type flashcard english content"
                  required
                />
              </div>

              <div className="col-span-2">
                <label
                  htmlFor="description"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  Vietnamese
                </label>
                <textarea
                  value={vietnameseContent}
                  onChange={(e) => setVietnameseContent(e.target.value)}
                  id="description"
                  rows={4}
                  className="block p-2.5 w-full text-sm text-white bg-[#414345] rounded-lg border border-gray-700 focus:ring-[#4CC2FF] focus:border-[#4CC2FF] placeholder-gray-400"
                  placeholder="Write flashcard vietnamese content here"
                ></textarea>
              </div>
            </div>
            <button
              className="text-white inline-flex items-center bg-[#4CC2FF] hover:bg-[#38aee6] focus:ring-4 focus:outline-none focus:ring-[#4CC2FF]/40 font-medium rounded-lg text-sm px-5 py-2.5 text-center shadow-md shadow-[#4CC2FF]/20"
              onClick={() => onCreate(englishContent, vietnameseContent)}
            >
              <svg
                className="me-1 -ms-1 w-5 h-5"
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
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
