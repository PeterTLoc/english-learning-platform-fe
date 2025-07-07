import React from "react";
import FlashcardSetList from "@/components/flashcard-sets/FlashcardSetList";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    size?: string;
    search?: string;
    sort?: string;
    order?: string;
    userId?: string;
  }>;
}) {
  const {
    page: PageParam,
    size: SizeParam,
    search: SearchParam,
    sort: SortParam,
    order: OrderParam,
    userId: UserIdParam,
  } = await searchParams;
  const page = parseInt(PageParam || "1");
  const size = parseInt(SizeParam || "12");
  const search = SearchParam || "";
  const sort = SortParam || "";
  const order = OrderParam || "";
  const userId = UserIdParam || "";

  return (
    <div className="min-h-screen w-full bg-[#202020] px-4">
      {/* Foreground Content */}
      <div className="relative z-10">
        <div className="py-6 sm:py-8 lg:py-12">
          {/* Header Section */}
          <div className="mb-8 sm:mb-12 text-center">
            <h1 className="font-medium text-3xl sm:text-4xl lg:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-4 tracking-tight">
              Collection of Flashcards by the community
            </h1>
            <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto">
              Discover and practice with flashcard sets created by the community
            </p>
          </div>

          {/* Main Content */}
          <div className="w-full">
            <FlashcardSetList
              page={page}
              size={size}
              search={search}
              sort={sort}
              order={order}
              userId={userId}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
