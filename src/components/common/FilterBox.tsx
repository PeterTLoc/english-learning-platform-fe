"use client";

import React, { useState } from "react";

export default function FilterBox({
  onSearch,
  initialSort = "date",
  initialOrder = "desc",
}: {
  onSearch: (search: string, sort: string, order: string) => void;
  initialSort?: string;
  initialOrder?: string;
}) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState(initialSort);
  const [order, setOrder] = useState(initialOrder);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(search, sort, order);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSearch} className="w-full">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 lg:gap-4 w-full">
          {/* Search Input */}
          <div className="flex-1 w-full">
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search flashcard sets..."
                className="w-full p-3 pl-10 pr-4 rounded-lg bg-[#232526] text-white border border-gray-700 focus:ring-2 focus:ring-[#4CC2FF] focus:border-[#4CC2FF] placeholder-gray-400 transition-all duration-300 text-sm sm:text-base"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-3 lg:gap-2 w-full lg:w-auto">
            {/* Sort Select */}
            <div className="flex-1 sm:flex-none">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full sm:w-auto p-3 rounded-lg bg-[#232526] text-white border border-gray-700 focus:ring-2 focus:ring-[#4CC2FF] focus:border-[#4CC2FF] transition-all duration-300 text-sm sm:text-base cursor-pointer"
              >
                <option value="date">📅 Sort by Date</option>
                <option value="name">🔤 Sort by Name</option>
              </select>
            </div>

            {/* Order Select */}
            <div className="flex-1 sm:flex-none">
              <select
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                className="w-full sm:w-auto p-3 rounded-lg bg-[#232526] text-white border border-gray-700 focus:ring-2 focus:ring-[#4CC2FF] focus:border-[#4CC2FF] transition-all duration-300 text-sm sm:text-base cursor-pointer"
              >
                <option value="desc">⬇️ Descending</option>
                <option value="asc">⬆️ Ascending</option>
              </select>
            </div>
          </div>

          {/* Search Button */}
          <div className="w-full sm:w-auto lg:w-auto">
            <button
              type="submit"
              className="w-full sm:w-auto bg-[#4CC2FF] hover:bg-[#38aee6] text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-[#4CC2FF]/25 transition-all duration-300 hover:scale-105 text-sm sm:text-base flex items-center justify-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <span>Search</span>
            </button>
          </div>
        </div>

        {/* Quick Filter Tags (Optional Enhancement) */}
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-xs text-gray-400 mr-2">Quick filters:</span>
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setSort("date");
              setOrder("desc");
              onSearch("", "date", "desc");
            }}
            className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-full transition-colors duration-200"
          >
            Recent
          </button>
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setSort("name");
              setOrder("asc");
              onSearch("", "name", "asc");
            }}
            className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-full transition-colors duration-200"
          >
            A-Z
          </button>
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setSort("date");
              setOrder("asc");
              onSearch("", "date", "asc");
            }}
            className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-full transition-colors duration-200"
          >
            Oldest
          </button>
        </div>
      </form>
    </div>
  );
}
