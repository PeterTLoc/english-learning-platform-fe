"use client";

import { useSearchParams } from "next/navigation";
import BlogList from "@/components/admin/blogs/BlogList";

export default function BlogManagementPage() {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");
  const size = parseInt(searchParams.get("size") || "10");
  return (
    <div className="p-4">
      <BlogList page={page} size={size} />
    </div>
  );
}
