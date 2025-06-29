"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { parseAxiosError } from "@/utils/apiErrors";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ServerPagination from "@/components/common/ServerPagination";
import * as membershipService from "@/services/membershipService";
import { IMembership, PaginatedMemberships } from "@/types/membership/membership";
import { useToast } from "@/context/ToastContext";
import { useConfirmation } from "@/context/ConfirmationContext";
import MembershipModal from "@/components/admin/MembershipModal";

interface GetMembershipsParams {
  page: number;
  size: number;
  search?: string;
  price?: "asc" | "desc" | "";
  duration?: "asc" | "desc" | "";
  sortBy?: string;
  order?: string;
}

const MembershipManagementPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const { showConfirmation } = useConfirmation();
  
  const [memberships, setMemberships] = useState<PaginatedMemberships | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedMembership, setSelectedMembership] = useState<IMembership | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [priceFilter, setPriceFilter] = useState<"asc" | "desc" | "">("");
  const [durationFilter, setDurationFilter] = useState<"asc" | "desc" | "">("");
  const [sortBy, setSortBy] = useState<string>("date");
  const [sortOrder, setSortOrder] = useState<string>("desc");

  const page = parseInt(searchParams.get("page") || "1");
  const size = parseInt(searchParams.get("size") || "10");

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vn-VI', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const fetchMemberships = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const searchValue = searchParams.get("search") || "";
      const priceValue = searchParams.get("price") || "";
      const durationValue = searchParams.get("duration") || "";
      const sortByValue = searchParams.get("sortBy") || "date";
      const orderValue = searchParams.get("order") || "desc";
      
      // Set local state from URL params
      setSearchTerm(searchValue);
      setPriceFilter(priceValue as "asc" | "desc" | "");
      setDurationFilter(durationValue as "asc" | "desc" | "");
      setSortBy(sortByValue);
      setSortOrder(orderValue);
      
      const data = await membershipService.getAllMemberships({
        page,
        size,
        search: searchValue,
        price: priceValue as "asc" | "desc" | "",
        duration: durationValue as "asc" | "desc" | "",
        sortBy: sortByValue,
        order: orderValue
      });
      
      setMemberships(data);
    } catch (error) {
      const parsedError = parseAxiosError(error);
      setError(parsedError.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMembership = async (membershipId: string) => {
    const confirmed = await showConfirmation({
      title: "Delete Membership",
      message: "Are you sure you want to delete this membership? This action cannot be undone.",
      variant: "danger"
    });

    if (confirmed) {
      try {
        await membershipService.deleteMembership(membershipId);
        showToast("Membership has been deleted", "success");
        fetchMemberships();
      } catch (error) {
        const parsedError = parseAxiosError(error);
        setError(parsedError.message);
        showToast("Failed to delete membership", "error");
      }
    }
  };

  const handleCreateMembership = async (membershipData: Partial<IMembership>) => {
    try {
      await membershipService.createMembership(membershipData);
      showToast("Membership has been created", "success");
      setIsModalOpen(false);
      fetchMemberships();
    } catch (error) {
      const parsedError = parseAxiosError(error);
      setError(parsedError.message);
      showToast("Failed to create membership", "error");
    }
  };

  const handleUpdateMembership = async (membershipId: string, membershipData: Partial<IMembership>) => {
    try {
      await membershipService.updateMembership(membershipId, membershipData);
      showToast("Membership has been updated", "success");
      setIsModalOpen(false);
      fetchMemberships();
    } catch (error) {
      const parsedError = parseAxiosError(error);
      setError(parsedError.message);
      showToast("Failed to update membership", "error");
    }
  };

  const openCreateModal = () => {
    setModalMode("create");
    setSelectedMembership(null);
    setIsModalOpen(true);
  };

  const openEditModal = (membership: IMembership) => {
    setModalMode("edit");
    setSelectedMembership(membership);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMembership(null);
  };

  const handleSearch = () => {
    // Update URL with search parameters
    const params = new URLSearchParams();
    params.set("page", "1"); // Reset to first page on new search
    params.set("size", size.toString());
    if (searchTerm) params.set("search", searchTerm);
    if (priceFilter) params.set("price", priceFilter);
    if (durationFilter) params.set("duration", durationFilter);
    params.set("sortBy", sortBy);
    params.set("order", sortOrder);
    
    router.push(`/admin/memberships?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`/admin/memberships?${params.toString()}`);
  };

  const handleReset = () => {
    setSearchTerm("");
    setPriceFilter("");
    setDurationFilter("");
    setSortBy("date");
    setSortOrder("desc");
    router.push("/admin/memberships");
  };

  useEffect(() => {
    fetchMemberships();
  }, [page, size, searchParams]);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-white">Membership Management</h1>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-[#4CC2FF] text-black font-semibold rounded-md hover:bg-[#3AA0DB] transition-colors"
        >
          <span className="text-md">Create New Membership</span>
        </button>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-[#202020] border border-[#1D1D1D] rounded-lg p-4 mb-6">
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex flex-col justify-center flex-1 min-w-[200px]">
            <label className="block text-lg font-medium text-[#CFCFCF] mb-1">
              Search by Name
            </label>
            <input
              type="text"
              placeholder="Search memberships..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#2D2D2D] border border-[#1D1D1D] rounded-md p-2 text-white text-lg"
            />
          </div>
          
          <div className="w-48">
            <label className="block text-lg font-medium text-[#CFCFCF] mb-1">
              Price
            </label>
            <select
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value as "asc" | "desc" | "")}
              className="w-full bg-[#2D2D2D] border border-[#1D1D1D] rounded-md p-2 text-white"
            >
              <option value="">Sort by Price</option>
              <option value="asc">Low to High</option>
              <option value="desc">High to Low</option>
            </select>
          </div>
          
          <div className="w-48">
            <label className="block text-lg font-medium text-[#CFCFCF] mb-1">
              Duration
            </label>
            <select
              value={durationFilter}
              onChange={(e) => setDurationFilter(e.target.value as "asc" | "desc" | "")}
              className="w-full bg-[#2D2D2D] border border-[#1D1D1D] rounded-md p-2 text-white"
            >
              <option value="">Sort by Duration</option>
              <option value="asc">Short to Long</option>
              <option value="desc">Long to Short</option>
            </select>
          </div>
          
          <div className="w-40">
            <label className="block text-lg font-medium text-[#CFCFCF] mb-1">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-[#2D2D2D] border border-[#1D1D1D] rounded-md p-2 text-white"
            >
              <option value="date">Date</option>
              <option value="name">Name</option>
              <option value="price">Price</option>
              <option value="duration">Duration</option>
            </select>
          </div>
          
          <div className="w-40">
            <label className="block text-lg font-medium text-[#CFCFCF] mb-1">
              Order
            </label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full bg-[#2D2D2D] border border-[#1D1D1D] rounded-md p-2 text-white"
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

      {/* Error Message */}
      {error && (
        <div className="bg-red-600 text-white p-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col items-center gap-4 justify-center py-20">
          <LoadingSpinner />
          <p className="ml-3 text-[#CFCFCF]">Loading memberships...</p>
        </div>
      ) : memberships && memberships.data && memberships.data.length > 0 ? (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-md text-left text-[#CFCFCF]">
              <thead className="text-sm uppercase bg-[#373737] text-white">
                <tr>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Description</th>
                  <th className="px-6 py-3">Price</th>
                  <th className="px-6 py-3">Duration</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Created At</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {memberships.data.map((membership) => (
                  <tr
                    key={membership._id}
                    className={`border-b bg-[#202020] border-[#1D1D1D] ${
                      membership.isDeleted ? "opacity-50" : ""
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {membership.name}
                      </div>
                    </td>
                    <td className="px-6 py-4">{membership.description || 'No description'}</td>
                    <td className="px-6 py-4">
                      <span className="text-[#4CC2FF] font-medium">
                        {formatPrice(membership.price)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded text-sm bg-[#373737] text-[#4CC2FF]">
                        {membership.duration} days
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-sm ${
                        membership.isDeleted 
                          ? "bg-red-900 text-red-300"
                          : "bg-[#373737] text-[#4CC2FF]"
                      }`}>
                        {membership.isDeleted ? "Deleted" : "Active"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {membership.createdAt ? new Date(membership.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(membership)}
                          className="px-3 py-1 text-sm bg-[#4CC2FF] text-black rounded hover:bg-[#3AA0DB] transition-colors"
                        >
                          Edit
                        </button>
                        {!membership.isDeleted && (
                          <button
                            onClick={async () => {
                              const confirmed = await showConfirmation({
                                title: "Delete Membership",
                                message: `Are you sure you want to delete ${membership.name}? This action cannot be undone.`,
                                confirmText: "Delete",
                                cancelText: "Cancel",
                                variant: "danger"
                              });
                              
                              if (confirmed) {
                                handleDeleteMembership(membership._id);
                              }
                            }}
                            className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
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
              totalPages={memberships.totalPages}
              pageSize={size}
            />
          </div>
        </>
      ) : (
        <div className="bg-[#202020] border border-[#1D1D1D] p-10 text-center rounded-lg">
          <p className="text-[#CFCFCF]">No memberships found. Try adjusting your search criteria.</p>
        </div>
      )}

      {/* Membership Modal */}
      {isModalOpen && (
        <MembershipModal
          mode={modalMode}
          membership={selectedMembership}
          onClose={closeModal}
          onCreate={handleCreateMembership}
          onUpdate={handleUpdateMembership}
        />
      )}
    </div>
  );
};

export default MembershipManagementPage; 