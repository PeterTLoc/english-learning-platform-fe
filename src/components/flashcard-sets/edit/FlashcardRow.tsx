"use client";
import { IFlashcard } from "@/types/models/IFlashcard";
import React, { useState } from "react";

export default function FlashcardRow({
  card,
  onDelete,
  onUpdate,
}: {
  card: IFlashcard;
  onDelete: (id: string) => void;
  onUpdate: (
    id: string,
    englishContent: string,
    vietnameseContent: string
  ) => void;
}) {
  const [englishContent, setEnglishContent] = useState(card.englishContent);
  const [vietnameseContent, setVietnameseContent] = useState(
    card.vietnameseContent
  );
  const [isEditing, setIsEditing] = useState(false);

  return (
    <tr className="border-b border-gray-700 hover:bg-gray-700">
      {/* English content */}
      <td className="px-4 py-3 w-[40%]">
        {isEditing ? (
          <input
            type="text"
            value={englishContent}
            className="w-full p-2 border text-2xl border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-gray-700 text-white text-sm w-[40%]"
            onChange={(e) => setEnglishContent(e.target.value)}
          />
        ) : (
          <h3 className="text-white w-[40%] text-2xl">{englishContent}</h3>
        )}
      </td>

      {/* Vietnamese content */}
      <td className="px-4 py-3 w-[40%]">
        {isEditing ? (
          <input
            type="text"
            value={vietnameseContent}
            className="w-full p-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-gray-700 text-white text-sm w-[40%] text-2xl"
            onChange={(e) => setVietnameseContent(e.target.value)}
          />
        ) : (
          <h3 className="text-white text-2xl w-[40%]">{vietnameseContent}</h3>
        )}
      </td>

      {/* Action buttons */}
      <td className="px-4 py-3">
        <div className="flex gap-2">
          {!isEditing ? (
            <button
              className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
          ) : (
            <button
              className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors text-sm"
              onClick={() => {
                onUpdate(
                  card._id?.toString() as string,
                  englishContent,
                  vietnameseContent
                );
                setIsEditing(false);
              }}
            >
              Update
            </button>
          )}

          <button
            className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors text-sm"
            onClick={() => onDelete(card._id?.toString() as string)}
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}
