"use client";
import ServerPagination from "@/components/common/ServerPagination";
import { AchievementType } from "@/enums/AchievementTypeEnum";
import AchievementService from "@/services/achievementService";
import { IAchievement } from "@/types/models/IAchievement";
import { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import { useToast } from "@/context/ToastContext";
import { useConfirmation } from "@/context/ConfirmationContext";
import AchievementList from "./AchievementList";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import AchievementModal from "./AchievementModal";
import AchievementFilter from "./AchievementFilter";
import { ObjectId } from "mongoose";
import { useRouter, useSearchParams } from "next/navigation";

const achievementService = new AchievementService();
export default function AchievementWrapper({
  page,
  size,
  order,
  sortBy,
  search,
  type,
}: {
  page?: number;
  size?: number;
  order?: string;
  sortBy?: string;
  search?: string;
  type?: AchievementType;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const { showConfirmation } = useConfirmation();

  const [loading, setLoading] = useState<boolean>(false);
  const [createLoading, setCreateLoading] = useState<boolean>(false);
  const [updateLoading, setUpdateLoading] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  //data
  const [achievements, setAchievements] = useState<IAchievement[]>([]);

  //pagination
  const [totalPages, setTotalPages] = useState<number>(1);

  //modal
  const [isCreate, setIsCreate] = useState<boolean>(false);
  const [editTarget, setEditTarget] = useState<IAchievement | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  //filter - use URL params
  const [filterSearch, setFilterSearch] = useState<string>(search || "");
  const [filterOrder, setFilterOrder] = useState<string>(order || "desc");
  const [filterSortBy, setFilterSortBy] = useState<string>(sortBy || "date");
  const [filterType, setFilterType] = useState<string>(type || "");

  const updateURLParams = (params: Record<string, string>) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());

    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newSearchParams.set(key, value);
      } else {
        newSearchParams.delete(key);
      }
    });

    router.push(`?${newSearchParams.toString()}`);
  };

  const fetchAchievements = async (
    page?: number,
    size?: number,
    order?: string,
    sortBy?: string,
    search?: string,
    type?: AchievementType
  ) => {
    try {
      setLoading(true);
      const response = await achievementService.getAchievements(
        page,
        size,
        order,
        sortBy,
        search,
        type
      );

      setAchievements(response.data);
      setTotalPages(response.totalPages);
      setLoading(false);
    } catch (error) {
      showToast(
        error instanceof AxiosError
          ? error?.response?.data?.message
          : "Failed to fetch achievements",
        "error"
      );
      setLoading(false);
    }
  };

  const createAchievement = async (
    name: string,
    description: string,
    type: AchievementType,
    goal: number
  ) => {
    try {
      setCreateLoading(true);
      if (!name || !description || !type || !goal) {
        showToast("All fields are required", "warning");
        return;
      }
      const response = await achievementService.createAchievement(
        name,
        description,
        type,
        goal
      );

      if (achievements.length < (size as number)) {
        setAchievements([
          ...achievements,
          response.achievement as IAchievement,
        ]);
      }

      showToast("Achievement created successfully", "success");
    } catch (error) {
      showToast(
        error instanceof AxiosError
          ? error?.response?.data?.message
          : "Failed to create achievements",
        "error"
      );
    } finally {
      setCreateLoading(false);
    }
  };

  const updateAchievement = async (
    id: string,
    name?: string,
    description?: string,
    type?: AchievementType,
    goal?: number
  ) => {
    try {
      setUpdateLoading(true);
      const response = await achievementService.updateAchievement(
        id,
        name,
        description,
        type,
        goal
      );

      const updatedAchievement = response.achievement;
      if (updatedAchievement) {
        setAchievements((achievements) =>
          achievements.map((a) =>
            a._id === updatedAchievement._id ? updatedAchievement : a
          )
        );
      }

      showToast("Achievement updated successfully", "success");
    } catch (error) {
      showToast(
        error instanceof AxiosError
          ? error?.response?.data?.message
          : "Failed to update achievements",
        "error"
      );
    } finally {
      setUpdateLoading(false);
    }
  };

  const deleteAchievement = async (id: string) => {
    try {
      setDeleteLoading(id);
      const response = await achievementService.deleteAchievement(id);
      console.log(response);

      //filter from state based on response
      const deleted = response.achievement;
      if (deleted) {
        setAchievements((achievements) =>
          achievements.filter((a) => a._id !== deleted._id)
        );
      }
      showToast("Achievement deleted successfully", "success");
    } catch (error) {
      showToast(
        error instanceof AxiosError
          ? error?.response?.data?.message
          : "Failed to delete achievements",
        "error"
      );
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleDeleteAchievement = async (id: string) => {
    const confirmed = await showConfirmation({
      title: "Delete Achievement",
      message: "Are you sure you want to delete this achievement? This action cannot be undone.",
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "danger"
    });
    
    if (confirmed) {
      await deleteAchievement(id);
    }
  };

  const handleSearch = () => {
    updateURLParams({
      search: filterSearch,
      sortBy: filterSortBy,
      order: filterOrder,
      type: filterType,
      page: "1",
    });
  };

  const handleReset = () => {
    setFilterSearch("");
    setFilterOrder("desc");
    setFilterSortBy("date");
    setFilterType("");
    updateURLParams({
      search: "",
      sortBy: "date",
      order: "desc",
      type: "",
      page: "1",
    });
  };

  useEffect(() => {
    fetchAchievements(page, size, order, sortBy, search, type);
  }, [page, size, order, sortBy, search, type]);

  if (loading) return <LoadingSpinner />;

  const handleCreate = async (data: {
    name: string;
    description: string;
    type: AchievementType;
    goal: number;
  }) => {
    await createAchievement(data.name, data.description, data.type, data.goal);
    setIsCreate(false);
  };

  const handleUpdate = async (data: {
    name: string;
    description: string;
    type: AchievementType;
    goal: number;
  }) => {
    if (editTarget) {
      await updateAchievement(
        (editTarget._id as ObjectId).toString(),
        data.name,
        data.description,
        data.type,
        data.goal
      );
    }
    setEditTarget(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-white">
          Achievements Management
        </h1>
        <button
          className="bg-[#4CC2FF] text-black px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => setIsCreate(true)}
          disabled={createLoading}
        >
          {createLoading ? "Creating..." : "Create Achievement"}
        </button>
      </div>

      <AchievementFilter
        searchTerm={filterSearch}
        setSearchTerm={setFilterSearch}
        sortBy={filterSortBy}
        setSortBy={setFilterSortBy}
        sortOrder={filterOrder}
        setSortOrder={setFilterOrder}
        type={filterType}
        setType={setFilterType}
        handleSearch={handleSearch}
        handleReset={handleReset}
      />

      <AchievementList
        achievements={achievements}
        onEdit={setEditTarget}
        onDelete={handleDeleteAchievement}
        deleteLoading={deleteLoading}
      />
      <AchievementModal
        isOpen={!!editTarget || isCreate}
        onClose={() => {
          setEditTarget(null);
          setIsCreate(false);
        }}
        onSubmit={isCreate ? handleCreate : handleUpdate}
        initialValues={isCreate ? {} : editTarget || {}}
        mode={isCreate ? "create" : "update"}
        loading={createLoading || updateLoading}
      />
      <ServerPagination
        pageSize={size || 5}
        currentPage={page || 1}
        totalPages={totalPages}
      />
    </div>
  );
}
