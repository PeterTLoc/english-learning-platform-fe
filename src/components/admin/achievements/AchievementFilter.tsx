import React from "react";
import { AchievementTypeEnum } from "../../../enums/AchievementTypeEnum";

export default function AchievementFilter({
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  type,
  setType,
  handleSearch,
  handleReset,
}: {
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  sortBy: string;
  setSortBy: (v: string) => void;
  sortOrder: string;
  setSortOrder: (v: string) => void;
  type: string;
  setType: (v: string) => void;
  handleSearch: () => void;
  handleReset: () => void;
}) {
  return (
    <div className="bg-[#202020] border border-[#1D1D1D] p-4 rounded-lg mb-6">
      <div className="flex flex-col md:flex-row flex-wrap gap-4 mb-4">
        <div className="flex flex-col justify-center flex-1 min-w-[180px]">
          <label className="block text-lg font-medium text-[#CFCFCF] mb-1">
            Search by Title
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search achievements by title..."
            className="input w-full p-4 text-lg text-white placeholder:text-lg"
          />
        </div>
        <div className="w-full md:w-40">
          <label className="block text-lg font-medium text-[#CFCFCF] mb-1">
            Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full bg-[#2D2D2D] border border-[#1D1D1D] rounded-md p-2"
          >
            <option value="">All Types</option>
            <option value={AchievementTypeEnum.LoginStreak}>
              Login Streak
            </option>
                          <option value={AchievementTypeEnum.CourseCompletion}>
                Course Completion
              </option>
            <option value={AchievementTypeEnum.LessonCompletion}>
              Lesson Completion
            </option>
          </select>
        </div>
        <div className="w-full md:w-40">
          <label className="block text-lg font-medium text-[#CFCFCF] mb-1">
            Sort By
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full bg-[#2D2D2D] border border-[#1D1D1D] rounded-md p-2"
          >
            <option value="date">Date</option>
            <option value="name">Title</option>
            <option value="type">Type</option>
          </select>
        </div>
        <div className="w-full md:w-40">
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
      <div className="flex flex-col sm:flex-row gap-2">
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
  );
}
