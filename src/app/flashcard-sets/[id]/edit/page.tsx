"use client";
import { useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import FlashcardList from "@/components/flashcard-sets/edit/FlashcardList";
import CreateFlashcardModal from "@/components/flashcard-sets/edit/CreateFlashcardModal";
import { Plus } from "lucide-react";

export default function Page() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const page = Number(searchParams.get("page")) || 1;
  const size = Number(searchParams.get("size")) || 10;
  const order = searchParams.get("order") || "desc";
  const sort = searchParams.get("sort") || "date";
  const search = searchParams.get("search") || "";
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div className="min-h-screen w-full bg-[#202020]">
      {/* Container with responsive padding and max-width */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 overflow-hidden">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8 lg:mb-10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                Flashcard Management
              </h1>
              <p className="text-slate-300 text-sm sm:text-base tracking-tight">
                Manage and organize your flashcards
              </p>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
          <div className="p-4 sm:p-6 lg:p-8">
            <FlashcardList
              id={id}
              page={page}
              size={size}
              order={order}
              sort={sort}
              search={search}
            />
        </div>

        {/* Create Modal */}
        <CreateFlashcardModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={() => {}}
        />
        </div>
    </div>
  );
}
