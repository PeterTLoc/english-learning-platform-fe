"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { parseAxiosError } from "@/utils/apiErrors";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ServerPagination from "@/components/common/ServerPagination";
import * as userService from "@/services/userService";
import { PaginatedUsers, User } from "@/services/userService";
import { UserRole } from "@/components/guards";
import UserDetailsModal from "@/components/admin/UserDetailsModal";
import { useToast } from "@/context/ToastContext";
import { useConfirmation } from "@/context/ConfirmationContext";

const UserManagementPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const { showConfirmation } = useConfirmation();
  
  const [users, setUsers] = useState<PaginatedUsers | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Modal states
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("date");
  const [sortOrder, setSortOrder] = useState<string>("desc");

  const page = parseInt(searchParams.get("page") || "1");
  const size = parseInt(searchParams.get("size") || "10");

  const fetchUsers = async () => {
    setLoading(true);
    
    try {
      const searchValue = searchParams.get("search") || "";
      const roleValue = searchParams.get("role") || "";
      const sortByValue = searchParams.get("sortBy") || "date";
      const orderValue = searchParams.get("order") || "desc";
      
      // Set local state from URL params
      setSearchTerm(searchValue);
      setRoleFilter(roleValue);
      setSortBy(sortByValue);
      setSortOrder(orderValue);
      
      const data = await userService.getUsers({
        page,
        size,
        search: searchValue,
        role: roleValue,
        sortBy: sortByValue,
        order: orderValue
      });
      
      setUsers(data);
    } catch (error) {
      const parsedError = parseAxiosError(error);
      showToast(parsedError.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDisableUser = async (userId: string) => {
    try {
      await userService.disableUser(userId);
      showToast("User has been disabled", "success");
      // Refresh the user list after disabling
      fetchUsers();
    } catch (error) {
      const parsedError = parseAxiosError(error);
      showToast(parsedError.message, "error");
    }
  };

  const openUserModal = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeUserModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleSearch = () => {
    // Update URL with search parameters
    const params = new URLSearchParams();
    params.set("page", "1"); // Reset to first page on new search
    params.set("size", size.toString());
    if (searchTerm) params.set("search", searchTerm);
    if (roleFilter) params.set("role", roleFilter);
    params.set("sortBy", sortBy);
    params.set("order", sortOrder);
    
    router.push(`/admin/users?${params.toString()}`);
  };

  const handleReset = () => {
    setSearchTerm("");
    setRoleFilter("");
    setSortBy("date");
    setSortOrder("desc");
    router.push("/admin/users");
  };

  useEffect(() => {
    fetchUsers();
  }, [page, size, searchParams]);

  const getRoleName = (role: number) => {
    switch (role) {
      case UserRole.USER:
        return "User";
      case UserRole.ADMIN:
        return "Admin";
      case UserRole.GUEST:
        return "Guest";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold text-white mb-6">User Management</h1>

      {/* Filter and search section */}
      <div className="bg-[#202020] border border-[#1D1D1D] p-4 rounded-lg mb-6">
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex flex-col justify-center flex-1 min-w-[200px]">
            <label className="block text-lg font-medium text-[#CFCFCF] mb-1">
              Search by Username or Email
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search users..."
              className="input w-full p-4 text-lg text-white placeholder:text-lg"
            />
          </div>
          
          <div className="w-40">
            <label className="block text-lg font-medium text-[#CFCFCF] mb-1">
              Role
            </label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full bg-[#2D2D2D] border border-[#1D1D1D] rounded-md p-2"
            >
              <option value="">All Roles</option>
              <option value="0">User</option>
              <option value="1">Admin</option>
              <option value="-1">Guest</option>
            </select>
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
              <option value="email">Email</option>
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

      {/* User Details Modal */}
      <UserDetailsModal
        user={selectedUser}
        isOpen={isModalOpen}
        onClose={closeUserModal}
        onDisable={handleDisableUser}
      />

      {/* Users table */}
      {loading ? (
        <div className="flex flex-col items-center gap-4 justify-center py-20">
          <LoadingSpinner />
          <p className="ml-3 text-[#CFCFCF]">Loading users...</p>
        </div>
      ) : users && users.data && users.data.length > 0 ? (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-md text-left text-[#CFCFCF]">
              <thead className="text-sm uppercase bg-[#373737] text-white">
                <tr>
                  <th className="px-6 py-3 text-center">Username</th>
                  <th className="px-6 py-3 text-center">Email</th>
                  <th className="px-6 py-3 text-center">Role</th>
                  <th className="px-6 py-3 text-center">Points</th>
                  <th className="px-6 py-3 text-center">Status</th>
                  <th className="px-6 py-3 text-center">Created At</th>
                  <th className="px-6 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.data.map((user) => (
                  <tr
                    key={user._id}
                    className={`border-b bg-[#202020] border-[#1D1D1D] hover:bg-[#2D2D2D] transition-colors ${
                      user.isDeleted ? "opacity-50" : ""
                    }`}
                  >
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.username}
                            className="w-8 h-8 rounded-full mr-2"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-[#373737] rounded-full mr-2 flex items-center justify-center">
                            {user.username.charAt(0).toUpperCase()}
                          </div>
                        )}
                        {user.username}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">{user.email}</td>
                    <td className="px-6 py-4 text-center">
                      <span 
                        className={`px-2 py-1 rounded text-sm ${
                          user.role === 1 
                            ? "bg-[#373737] text-[#4CC2FF]" 
                            : user.role === 0
                            ? "bg-[#373737] text-white"
                            : "bg-[#373737] text-[#CFCFCF]"
                        }`}
                      >
                        {getRoleName(user.role)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">{user.points || 0}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-1 rounded text-sm ${
                        user.isDeleted 
                          ? "bg-red-900 text-red-300"
                          : "bg-[#373737] text-[#4CC2FF]"
                      }`}>
                        {user.isDeleted ? "Disabled" : "Active"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {new Date(user.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex gap-2">
                        <button
                          disabled={user.isDeleted}
                          onClick={() => openUserModal(user)}
                          className="px-3 py-1 text-sm bg-[#4CC2FF] text-black rounded hover:bg-[#3AA0DB] transition-colors"
                        >
                          View
                        </button>
                        {!user.isDeleted && (
                          <button
                            onClick={async () => {
                              const confirmed = await showConfirmation({
                                title: "Disable User",
                                message: `Are you sure you want to disable ${user.username}? This action cannot be undone.`,
                                confirmText: "Disable",
                                cancelText: "Cancel",
                                variant: "danger"
                              });
                              
                              if (confirmed) {
                                handleDisableUser(user._id);
                              }
                            }}
                            className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                          >
                            Disable
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
              totalPages={users.totalPages}
              pageSize={size}
            />
          </div>
        </>
      ) : (
        <div className="bg-[#202020] border border-[#1D1D1D] p-10 text-center rounded-lg">
          <p className="text-[#CFCFCF]">No users found. Try adjusting your search criteria.</p>
        </div>
      )}
    </div>
  );
};

export default UserManagementPage; 