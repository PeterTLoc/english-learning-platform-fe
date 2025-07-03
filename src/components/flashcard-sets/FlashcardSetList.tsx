"use client";
import FlashcardSetService from "@/services/flashcardSetService";
import { IFlashcardSet } from "@/types/models/IFlashcardSet";
import React, { useEffect, useState } from "react";
import FlashcardSetCard from "./FlashcardSetCard";
import { ObjectId } from "mongoose";
import LoadingSpinner from "../ui/LoadingSpinner";
import ServerPagination from "../common/ServerPagination";
import CreateFlashcardSetModal from "./CreateFlashcardSetModal";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import FilterBox from "../common/FilterBox";

const flashcardSetService = new FlashcardSetService();

export default function FlashcardSetList({
  page,
  size,
  search,
  sort,
  order,
  userId,
}: {
  page: number;
  size: number;
  search: string;
  sort: string;
  order: string;
  userId: string;
}) {
  const router = useRouter();

  const [flashcardSets, setFlashcardSets] = useState<IFlashcardSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    const fetchFlashcardSets = async () => {
      const response = await flashcardSetService.getFlashcardSets(
        page,
        size,
        search,
        sort,
        order,
        userId
      );
      setFlashcardSets(response.data);
      setTotalPages(response.totalPages);
      setLoading(false);
    };

    fetchFlashcardSets();
  }, [page, size, search, sort, order, userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  const createFlashcardSet = async (name: string, description: string) => {
    try {
      const response = await flashcardSetService.createFlashcardSet(
        name,
        description
      );

      setFlashcardSets([...flashcardSets, response.flashcardSet]);
      setIsCreateModalOpen(false);
    } catch (error) {
      toast.error(
        error instanceof AxiosError
          ? error.response?.data.message
          : "Failed to create flashcard set"
      );
    }
  };

  const onSearch = (search: string, sort: string, order: string) => {
    router.push(`/flashcard-sets?search=${search}&sort=${sort}&order=${order}`);
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Filter Section */}
      <div className="mb-6 sm:mb-8">
        <div className="flex justify-center">
          <div className="w-full max-w-2xl">
            <FilterBox onSearch={onSearch} />
          </div>
        </div>
      </div>

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6 sm:mb-8">
        <div className="flex-1">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2">
            Flashcard Sets
          </h2>
          <p className="text-gray-400 text-sm sm:text-base">
            {flashcardSets.length} {flashcardSets.length === 1 ? "set" : "sets"}{" "}
            available
          </p>
        </div>

        <button
          className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-blue-500/25"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <span className="flex items-center justify-center gap-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span className="hidden sm:inline">Create Flashcard Set</span>
            <span className="sm:hidden">Create Set</span>
          </span>
        </button>
      </div>

      {/* Content Section */}
      <div className="mb-8 sm:mb-12">
        {flashcardSets.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {flashcardSets.map((flashcardSet) => (
              <FlashcardSetCard
                key={(flashcardSet._id as ObjectId).toString()}
                flashcardSet={flashcardSet}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 sm:py-16">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 mx-auto mb-4 bg-gray-700 rounded-full flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-300 mb-2">
                No flashcard sets found
              </h3>
              <p className="text-gray-500 text-sm sm:text-base mb-6">
                {search
                  ? `No results for "${search}"`
                  : "Be the first to create a flashcard set!"}
              </p>
              {!search && (
                <button
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 shadow-lg"
                  onClick={() => setIsCreateModalOpen(true)}
                >
                  Create Your First Set
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Pagination Section */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <ServerPagination
            currentPage={page}
            totalPages={totalPages}
            pageSize={size}
          />
        </div>
      )}

      {/* Modal */}
      <CreateFlashcardSetModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={createFlashcardSet}
      />
    </div>
  );
}
