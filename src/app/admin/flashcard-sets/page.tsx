"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { parseAxiosError } from "@/utils/apiErrors";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ServerPagination from "@/components/common/ServerPagination";
import FlashcardSetService from "@/services/flashcardSetService";
import { IFlashcardSet } from "@/types/models/IFlashcardSet";
import { useToast } from "@/context/ToastContext";
import { useConfirmation } from "@/context/ConfirmationContext";
import FlashcardSetModal from "@/components/admin/FlashcardSetModal";
import FlashcardSetDetailsModal from "@/components/admin/FlashcardSetDetailsModal";
import FlashcardList from "@/components/admin/FlashcardList";

interface PaginatedFlashcardSets {
  data: IFlashcardSet[];
  totalPages: number;
  totalItems: number;
  currentPage: number;
  pageSize: number;
}

const flashcardSetService = new FlashcardSetService();

const FlashcardSetManagementPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const { showConfirmation } = useConfirmation();

  const [flashcardSets, setFlashcardSets] = useState<PaginatedFlashcardSets | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedFlashcardSet, setSelectedFlashcardSet] = useState<IFlashcardSet | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState<boolean>(false);
  const [selectedFlashcardSetForDetails, setSelectedFlashcardSetForDetails] = useState<IFlashcardSet | null>(null);

  // Flashcard management states
  const [isFlashcardListOpen, setIsFlashcardListOpen] = useState<boolean>(false);
  const [selectedFlashcardSetForFlashcards, setSelectedFlashcardSetForFlashcards] = useState<IFlashcardSet | null>(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("date");
  const [sortOrder, setSortOrder] = useState<string>("desc");

  const page = parseInt(searchParams.get("page") || "1");
  const size = parseInt(searchParams.get("size") || "10");

  const fetchFlashcardSets = async () => {
    setLoading(true);

    try {
      const searchValue = searchParams.get("search") || "";
      const sortByValue = searchParams.get("sortBy") || "date";
      const orderValue = searchParams.get("order") || "desc";

      // Set local state from URL params
      setSearchTerm(searchValue);
      setSortBy(sortByValue);
      setSortOrder(orderValue);

      const data = await flashcardSetService.getAllFlashcardSets({
        page,
        size,
        search: searchValue,
        sortBy: sortByValue,
        order: orderValue,
      });

      setFlashcardSets(data);
    } catch (error) {
      const parsedError = parseAxiosError(error);
      showToast(parsedError.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFlashcardSet = async (flashcardSetId: string) => {
    try {
      await flashcardSetService.deleteFlashcardSet(flashcardSetId);
      showToast("Flashcard set has been deleted", "success");
      fetchFlashcardSets();
    } catch (error) {
      const parsedError = parseAxiosError(error);
      showToast(parsedError.message, "error");
    }
  };

  const handleCreateFlashcardSet = async (flashcardSetData: { name: string; description: string }) => {
    try {
      await flashcardSetService.createFlashcardSet(flashcardSetData.name, flashcardSetData.description);
      showToast("Flashcard set has been created", "success");
      setIsModalOpen(false);
      fetchFlashcardSets();
    } catch (error) {
      const parsedError = parseAxiosError(error);
      showToast(parsedError.message, "error");
    }
  };

  const handleUpdateFlashcardSet = async (flashcardSetId: string, flashcardSetData: { name: string; description: string }) => {
    try {
      await flashcardSetService.updateFlashcardSet(flashcardSetId, flashcardSetData.name, flashcardSetData.description);
      showToast("Flashcard set has been updated", "success");
      setIsModalOpen(false);
      fetchFlashcardSets();
    } catch (error) {
      const parsedError = parseAxiosError(error);
      showToast(parsedError.message, "error");
    }
  };

  const openCreateModal = () => {
    setModalMode("create");
    setSelectedFlashcardSet(null);
    setIsModalOpen(true);
  };

  const openEditModal = (flashcardSet: IFlashcardSet) => {
    setModalMode("edit");
    setSelectedFlashcardSet(flashcardSet);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFlashcardSet(null);
  };

  const openDetailsModal = (flashcardSet: IFlashcardSet) => {
    setSelectedFlashcardSetForDetails(flashcardSet);
    setIsDetailsModalOpen(true);
  };

  const closeDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedFlashcardSetForDetails(null);
  };

  const openFlashcardList = (flashcardSet: IFlashcardSet) => {
    setSelectedFlashcardSetForFlashcards(flashcardSet);
    setIsFlashcardListOpen(true);
  };

  const closeFlashcardList = () => {
    setIsFlashcardListOpen(false);
    setSelectedFlashcardSetForFlashcards(null);
  };

  const handleFlashcardCountChange = () => {
    // Refresh the flashcard sets to update the flashcard count
    fetchFlashcardSets();
  };

  const handleSearch = () => {
    // Update URL with search parameters
    const params = new URLSearchParams();
    params.set("page", "1"); // Reset to first page on new search
    params.set("size", size.toString());
    if (searchTerm) params.set("search", searchTerm);
    params.set("sortBy", sortBy);
    params.set("order", sortOrder);

    router.push(`/admin/flashcard-sets?${params.toString()}`);
  };

  const handleReset = () => {
    setSearchTerm("");
    setSortBy("date");
    setSortOrder("desc");
    router.push("/admin/flashcard-sets");
  };

  const handleConfirmDelete = async (flashcardSetId: string) => {
    const confirmed = await showConfirmation({
      title: "Delete Flashcard Set",
      message: "Are you sure you want to delete this flashcard set? This action cannot be undone.",
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "danger"
    });

    if (confirmed) {
      handleDeleteFlashcardSet(flashcardSetId);
    }
  };

  useEffect(() => {
    fetchFlashcardSets();
  }, [page, size, searchParams]);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-white">Flashcard Set Management</h1>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-[#4CC2FF] text-black font-semibold rounded-md hover:bg-[#3AA0DB] transition-colors"
        >
          <span className="text-md">Create New Flashcard Set</span>
        </button>
      </div>

      {/* Filter and search section */}
      <div className="bg-[#202020] border border-[#1D1D1D] p-4 rounded-lg mb-6">
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex flex-col justify-center flex-1 min-w-[200px]">
            <label className="block text-lg font-medium text-[#CFCFCF] mb-1">
              Search by Name or Description
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search flashcard sets..."
              className="input w-full p-4 text-lg text-white placeholder:text-lg"
            />
          </div>

          <div className="w-40">
            <label className="block text-lg font-medium text-[#CFCFCF] mb-1">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-[#2D2D2D] border border-[#1D1D1D] rounded-md p-2"
            >
              <option value="date">Date</option>
              <option value="name">Name</option>
              <option value="flashcardCount">Flashcard Count</option>
            </select>
          </div>

          <div className="w-40">
            <label className="block text-lg font-medium text-[#CFCFCF] mb-1">
              Order
            </label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full bg-[#2D2D2D] border border-[#1D1D1D] rounded-md p-2"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-[#4CC2FF] text-black font-semibold rounded-md hover:bg-[#3AA0DB] transition-colors"
          >
            <span className="text-md">Apply Filters</span>
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-[#2b2b2b] text-white font-semibold rounded-md hover:bg-[#373737] transition-colors"
          >
            <span className="text-md">Reset</span>
          </button>
        </div>
      </div>

      {/* Flashcard Set table */}
      {loading ? (
        <div className="flex flex-col items-center gap-4 justify-center py-20">
          <LoadingSpinner />
          <p className="ml-3 text-[#CFCFCF]">Loading flashcard sets...</p>
        </div>
      ) : flashcardSets && flashcardSets.data && flashcardSets.data.length > 0 ? (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-md text-left text-[#CFCFCF]">
              <thead className="text-sm uppercase bg-[#373737] text-white">
                <tr>
                  <th className="px-6 py-3 text-center">Name</th>
                  <th className="px-6 py-3 text-center">Description</th>
                  <th className="px-6 py-3 text-center">Owner</th>
                  <th className="px-6 py-3 text-center">Flashcard Count</th>
                  <th className="px-6 py-3 text-center">Status</th>
                  <th className="px-6 py-3 text-center">Created At</th>
                  <th className="px-6 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {flashcardSets.data.map((flashcardSet) => (
                  <tr
                    key={String(flashcardSet._id)}
                    className="border-b bg-[#202020] border-[#1D1D1D] hover:bg-[#2D2D2D] transition-colors"
                  >
                    <td className="px-6 py-4 text-center font-semibold text-white">
                      {flashcardSet.name || "Untitled Set"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {flashcardSet.description || "No description"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {flashcardSet.user?.username || "Unknown User"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {flashcardSet.flashcardCount || 0}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-2 py-1 rounded text-sm ${
                          flashcardSet.isDeleted
                            ? "bg-red-900 text-red-300"
                            : "bg-[#373737] text-[#4CC2FF]"
                        }`}
                      >
                        {flashcardSet.isDeleted ? "Deleted" : "Active"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {flashcardSet.createdAt
                        ? new Date(flashcardSet.createdAt).toLocaleString()
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-2 flex-wrap">
                        <button
                          onClick={() => openDetailsModal(flashcardSet)}
                          className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => openFlashcardList(flashcardSet)}
                          className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                        >
                          Manage Flashcards
                        </button>
                        <button
                          onClick={() => openEditModal(flashcardSet)}
                          className="px-3 py-1 text-sm bg-[#4CC2FF] text-black rounded hover:bg-[#3AA0DB] transition-colors"
                        >
                          Edit
                        </button>
                        {!flashcardSet.isDeleted && (
                                                  <button
                          onClick={() => handleConfirmDelete(String(flashcardSet._id))}
                          className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          Delete
                        </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-6">
            <ServerPagination
              currentPage={page}
              totalPages={flashcardSets.totalPages}
              pageSize={size}
            />
          </div>
        </>
      ) : (
        <div className="bg-[#202020] border border-[#1D1D1D] p-10 text-center rounded-lg">
          <p className="text-[#CFCFCF]">
            No flashcard sets found. Try adjusting your search criteria.
          </p>
        </div>
      )}

      {/* Flashcard Set Modal */}
      {isModalOpen && (
        <FlashcardSetModal
          mode={modalMode}
          flashcardSet={selectedFlashcardSet}
          isOpen={isModalOpen}
          onClose={closeModal}
          onSubmit={modalMode === "create" 
            ? handleCreateFlashcardSet 
            : (data: { name: string; description: string }) => handleUpdateFlashcardSet(String(selectedFlashcardSet?._id || ''), data)}
        />
      )}

      {/* Flashcard Set Details Modal */}
      {selectedFlashcardSetForDetails && (
        <FlashcardSetDetailsModal
          flashcardSet={selectedFlashcardSetForDetails}
          isOpen={isDetailsModalOpen}
          onClose={closeDetailsModal}
        />
      )}

      {/* Flashcard List Modal */}
      {selectedFlashcardSetForFlashcards && (
        <FlashcardList
          flashcardSetId={String(selectedFlashcardSetForFlashcards._id)}
          isOpen={isFlashcardListOpen}
          onClose={closeFlashcardList}
          onFlashcardCountChange={handleFlashcardCountChange}
        />
      )}
    </div>
  );
};

export default FlashcardSetManagementPage; 