import FlashcardList from "@/components/flashcard-sets/edit/FlashcardList";

export default async function Page({
  params,
}: {
  params: Promise<{
    id: string;
    page: string;
    size: string;
    order: string;
    sort: string;
    search: string;
  }>;
}) {
  const { id, page, size, order, sort, search } = await params;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Container with responsive padding and max-width */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8 lg:mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-4 tracking-tight">
                Flashcard Management
              </h1>
              <p className="text-gray-400 text-sm sm:text-base text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-4 tracking-tight">
                Manage and organize your flashcards
              </p>
            </div>

            {/* Breadcrumb or additional actions can go here */}
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span>Set ID: {id}</span>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="bg-[#232526] rounded-lg shadow-xl border border-gray-700 overflow-hidden">
          {/* Content wrapper with responsive padding */}
          <div className="p-4 sm:p-6 lg:p-8">
            <FlashcardList
              id={id}
              page={Number(page) || 1}
              size={Number(size) || 10}
              order={order || "desc"}
              sort={sort || "date"}
              search={search || ""}
            />
          </div>
        </div>

        {/* Optional: Mobile-specific floating action button */}
        <div className="fixed bottom-6 right-6 sm:hidden">
          <button
            type="button"
            className="bg-[#4CC2FF] hover:bg-[#38aee6] text-white p-3 rounded-full shadow-lg transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-[#4CC2FF]/40"
            aria-label="Quick actions"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
