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
  const size = parseInt(SizeParam || "8");
  const search = SearchParam || "";
  const sort = SortParam || "";
  const order = OrderParam || "";
  const userId = UserIdParam || "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Container with responsive padding */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Header Section */}
        <div className="mb-8 sm:mb-12 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-4 tracking-tight">
            Flashcard Sets
          </h1>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
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
  );
}
