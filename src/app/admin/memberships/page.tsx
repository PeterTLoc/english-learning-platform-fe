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
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedMembership, setSelectedMembership] = useState<IMembership | undefined>(undefined);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState<string>("");
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
    
    try {
      const searchValue = searchParams.get("search") || "";
      const sortByValue = searchParams.get("sortBy") || "date";
      const orderValue = searchParams.get("order") || "desc";
      
      // Set local state from URL params
      setSearchTerm(searchValue);
      setSortBy(sortByValue);
      setSortOrder(orderValue);
      
      const data = await membershipService.getAllMemberships({
        page,
        size,
        search: searchValue,
        sortBy: sortByValue,
        order: orderValue
      });
      
      setMemberships(data);
    } catch (error) {
      const parsedError = parseAxiosError(error);
      showToast(parsedError.message, "error");
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
        showToast(parsedError.message, "error");
      }
    }
  };

  const handleCreateMembership = async (formData: FormData) => {
    try {
      const membershipData = {
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        price: Number(formData.get('price')),
        duration: Number(formData.get('duration'))
      };
      await membershipService.createMembership(membershipData);
      showToast("Membership has been created", "success");
      setIsModalOpen(false);
      fetchMemberships();
    } catch (error) {
      const parsedError = parseAxiosError(error);
      showToast(parsedError.message, "error");
    }
  };

  const handleUpdateMembership = async (membershipId: string, formData: FormData) => {
    try {
      const membershipData = {
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        price: Number(formData.get('price')),
        duration: Number(formData.get('duration'))
      };
      await membershipService.updateMembership(membershipId, membershipData);
      showToast("Membership has been updated", "success");
      setIsModalOpen(false);
      fetchMemberships();
    } catch (error) {
      const parsedError = parseAxiosError(error);
      showToast(parsedError.message, "error");
    }
  };

  const openCreateModal = () => {
    setModalMode("create");
    setSelectedMembership(undefined);
    setIsModalOpen(true);
  };

  const openEditModal = (membership: IMembership) => {
    setModalMode("edit");
    setSelectedMembership(membership);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMembership(undefined);
  };

  const handleSearch = () => {
    // Update URL with search parameters
    const params = new URLSearchParams();
    params.set("page", "1"); // Reset to first page on new search
    params.set("size", size.toString());
    if (searchTerm) params.set("search", searchTerm);
    params.set("sortBy", sortBy);
    params.set("order", sortOrder);
    
    router.push(`/admin/memberships?${params.toString()}`);
  };

  const handleReset = () => {
    setSearchTerm("");
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
          Create New Membership
        </button>
      </div>

      {/* Filter and search section */}
      <div className="bg-[#202020] border border-[#1D1D1D] p-4 rounded-lg mb-6">
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex flex-col justify-center flex-1 min-w-[200px]">
            <label className="block text-lg font-medium text-[#CFCFCF] mb-1">
              Search by Name
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search memberships..."
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
            Apply Filters
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-[#2b2b2b] text-white font-semibold rounded-md hover:bg-[#373737] transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="flex flex-col items-center gap-4 justify-center py-20">
          <LoadingSpinner />
          <p className="ml-3 text-[#CFCFCF]">Loading memberships...</p>
        </div>
      ) : memberships && memberships.data && memberships.data.length > 0 ? (
        <>
          {/* Membership table */}
          <div className="overflow-x-auto">
            <table className="w-full text-md text-left text-[#CFCFCF]">
              <thead className="text-sm uppercase bg-[#373737] text-white">
                <tr>
                  <th className="px-6 py-3 text-center">Name</th>
                  <th className="px-6 py-3 text-center">Description</th>
                  <th className="px-6 py-3 text-center">Price</th>
                  <th className="px-6 py-3 text-center">Duration</th>
                  <th className="px-6 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {memberships?.data.map((membership) => (
                  <tr
                    key={membership._id}
                    className="border-b bg-[#202020] border-[#1D1D1D] hover:bg-[#2D2D2D]"
                  >
                    <td className="px-6 py-4 text-center">{membership.name}</td>
                    <td className="px-6 py-4 text-center text-[#CFCFCF] max-w-lg truncate">
                      {membership.description}
                    </td>
                    <td className="px-6 py-4 text-center text-[#4CC2FF]">
                      {formatPrice(membership.price)}
                    </td>
                    <td className="px-6 py-4 text-center text-[#CFCFCF]">
                      {membership.duration} days
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(membership)}
                          className="px-3 py-1 text-sm bg-[#4CC2FF] text-black rounded hover:bg-[#3AA0DB] transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteMembership(membership._id)}
                          className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {memberships && (
            <ServerPagination
              currentPage={memberships.page}
              totalPages={memberships.totalPages}
              pageSize={size}
            />
          )}
        </>
      ) : (
        <div className="bg-[#202020] border border-[#1D1D1D] p-10 text-center rounded-lg">
          <p className="text-[#CFCFCF]">No memberships found. Try adjusting your search criteria.</p>
        </div>
      )}

      {/* Membership Modal */}
      {isModalOpen && (
        <MembershipModal
          membership={selectedMembership}
          isOpen={isModalOpen}
          onClose={closeModal}
          onSubmit={modalMode === "create" 
            ? handleCreateMembership 
            : (formData: FormData) => handleUpdateMembership(selectedMembership?._id || '', formData)}
        />
      )}
    </div>
  );
};

export default MembershipManagementPage; 