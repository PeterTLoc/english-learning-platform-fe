"use client";

import React, { useState } from "react";
import { Search, Calendar, SortAsc, SortDesc, Filter } from "lucide-react";

export default function FilterBox({
  onSearch,
  placeholder,
  initialSort = "date",
  initialOrder = "desc",
}: {
  onSearch: (search: string, sort: string, order: string) => void;
  placeholder?: string;
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
    <div className="w-full mx-auto">
      <form onSubmit={handleSearch} className="w-full">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4 w-full">
          {/* Search Input - Increased width */}
          <div className="flex-1 w-full lg:w-2/5">
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={placeholder}
                className="w-full h-12 p-3 pl-10 pr-4 rounded-lg bg-slate-800/50 text-white border border-slate-600 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 placeholder-slate-400 transition-all duration-300 text-sm sm:text-base backdrop-blur-sm"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-5 h-15 text-slate-400" />
              </div>
            </div>
          </div>

          {/* Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-3/5">
            {/* Sort Select */}
            <div className="flex-1">
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="w-full p-3 pl-10 pr-4 rounded-lg bg-slate-800/50 text-white border border-slate-600 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all duration-300 text-sm sm:text-base cursor-pointer appearance-none backdrop-blur-sm"
                >
                  <option value="date">Sort by Date</option>
                  <option value="name">Sort by Name</option>
                </select>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            </div>

            {/* Order Select */}
            <div className="flex-1">
              <div className="relative">
                <select
                  value={order}
                  onChange={(e) => setOrder(e.target.value)}
                  className="w-full p-3 pl-10 pr-4 rounded-lg bg-slate-800/50 text-white border border-slate-600 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all duration-300 text-sm sm:text-base cursor-pointer appearance-none backdrop-blur-sm"
                >
                  <option value="desc">Descending</option>
                  <option value="asc">Ascending</option>
                </select>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {order === "desc" ? (
                    <SortDesc className="w-4 h-4 text-slate-400" />
                  ) : (
                    <SortAsc className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </div>
            </div>

            {/* Search Button */}
            <div className="w-full sm:w-auto">
              <button
                type="submit"
                className="h-12 px-4 flex items-center gap-2 bg-[#4CC2FF] text-black font-semibold rounded-md hover:bg-[#3AA0DB] transition-colors"
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Filter Tags - Centered */}
        <div className="mt-6 flex flex-col items-center">
          <div className="flex flex-wrap justify-center gap-3">
            <span className="text-sm text-slate-300 mb-2 w-full text-center">
              Quick filters:
            </span>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSort("date");
                setOrder("desc");
                onSearch("", "date", "desc");
              }}
              className="px-4 py-2 text-sm bg-slate-700/50 hover:bg-slate-600/50 text-slate-200 rounded-lg transition-colors duration-200 border border-slate-600"
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
              className="px-4 py-2 text-sm bg-slate-700/50 hover:bg-slate-600/50 text-slate-200 rounded-lg transition-colors duration-200 border border-slate-600"
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
              className="px-4 py-2 text-sm bg-slate-700/50 hover:bg-slate-600/50 text-slate-200 rounded-lg transition-colors duration-200 border border-slate-600"
            >
              Oldest
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
