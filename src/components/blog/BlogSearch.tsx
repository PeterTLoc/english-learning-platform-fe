"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

interface BlogSearchProps {
  search: string;
}

export default function BlogSearch({ search }: BlogSearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [input, setInput] = useState(search);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (input) {
      params.set("search", input);
    } else {
      params.delete("search");
    }
    params.delete("page"); // Reset to first page on new search
    router.push(`?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="flex justify-center my-8">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Search blogs..."
        className=" text-black border rounded-l px-4 py-2 w-64"
      />
      <button
        type="submit"
        className="bg-cyan-600 text-white px-4 py-2 rounded-r"
      >
        Search
      </button>
    </form>
  );
}
