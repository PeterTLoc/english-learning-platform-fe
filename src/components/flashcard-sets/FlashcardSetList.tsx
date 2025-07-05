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
import { Plus, Search, Grid3X3 } from "lucide-react";

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
  const [total, setTotal] = useState(0);
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
      setTotal(response.total)
      setLoading(false);
    };

    fetchFlashcardSets();
  }, [page, size, search, sort, order, userId]);

  if (loading) {
    return (
      <div className="flex flex-col gap-4 justify-center items-center min-h-[400px]">
        <LoadingSpinner />
        <p className="text-white">Loading flashcard sets...</p>
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
      <div className="mb-8">
        <div className="flex justify-center">
          <div className="w-full">
            <FilterBox onSearch={onSearch} />
          </div>
        </div>
      </div>

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-8">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <Grid3X3 className="w-6 h-6 text-purple-400" />
            <h2 className="text-2xl lg:text-3xl font-bold text-white">
              Flashcard Sets
            </h2>
          </div>
          <p className="text-slate-300 text-sm sm:text-base">
            {total} {total === 1 ? "set" : "sets"}{" "}
            available
          </p>
        </div>

        <button
          className="px-4 py-2 bg-[#4CC2FF] text-black font-semibold rounded-md hover:bg-[#3AA0DB] transition-colors"
          onClick={() => setIsCreateModalOpen(true)}
        >
          Add Flashcard Set
        </button>
      </div>

      {/* Content Section */}
      <div className="mb-12">
        {flashcardSets.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {flashcardSets.map((flashcardSet) => (
              <FlashcardSetCard
                key={(flashcardSet._id as ObjectId).toString()}
                flashcardSet={flashcardSet}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-[#2b2b2b] rounded-lg">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 mx-auto mb-6 bg-slate-700 rounded-full flex items-center justify-center">
                <Search className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-200 mb-3">
                No flashcard sets found
              </h3>
              <p className="text-slate-400 text-base mb-8">
                {search
                  ? `No results for "${search}"`
                  : "Be the first to create a flashcard set!"}
              </p>
              {!search && (
                <button
                  className="px-4 py-2 bg-[#4CC2FF] text-black font-semibold rounded-md hover:bg-[#3AA0DB] transition-colors mx-auto"
                  onClick={() => setIsCreateModalOpen(true)}
                >
                  Add Flashcard Set
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Pagination Section */}
      {
        <div className="flex justify-center">
          <ServerPagination
            currentPage={page}
            totalPages={totalPages !== 0 ? totalPages : 1}
            pageSize={size}
          />
        </div>
      }

      {/* Modal */}
      <CreateFlashcardSetModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={createFlashcardSet}
      />
    </div>
  );
}
