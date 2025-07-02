"use client";
import React, { useState } from "react";
import { IBlog } from "@/types/models/IBlog";
import Image from "next/image";
import BlogPreview from "./BlogPreview";
import { BlogStatusEnum } from "@/enums/BlogStatusEnum";

interface BlogListItemProps {
  blog: IBlog;
  setEditTarget: (editTarget: IBlog | null) => void;
  setDeleteTarget: (deletedBlog: IBlog | null) => void;
}

export default function BlogListItem({
  blog,
  setEditTarget,
  setDeleteTarget,
}: BlogListItemProps) {
  const [preview, setPreview] = useState(false);

  return (
    <tr className="border-b bg-[#202020] border-[#1D1D1D] hover:bg-[#2D2D2D] transition-colors">
      <td className="px-6 py-4 text-center">
        <div className="flex items-center justify-center">
          {blog.coverImage ? (
            <Image
              src={blog.coverImage}
              alt={blog.title}
              width={64}
              height={64}
              className="rounded object-cover w-16 h-16"
            />
          ) : (
            <div className="w-8 h-8 bg-[#373737] rounded flex items-center justify-center">
              {blog.title?.charAt(0)?.toUpperCase() || "B"}
            </div>
          )}
        </div>
      </td>
      <td className="px-6 py-4 text-center font-semibold text-white">
        {blog.title}
      </td>
      <td className="px-6 py-4 text-center">
        {blog.user?.username ? blog.user.username : "Unknown author"}
      </td>
      <td className="px-6 py-4 text-center">
        <span
          className={`px-2 py-1 rounded text-sm ${
            blog.status === BlogStatusEnum.ARCHIVED
              ? "bg-red-900 text-red-300"
              : blog.status === BlogStatusEnum.DRAFTING
              ? "bg-gray-900 text-gray-300"
              : "bg-[#373737] text-[#4CC2FF]"
          }`}
        >
          {blog.status}
        </span>
      </td>
      <td className="px-6 py-4 text-center">
        {blog.createdAt &&
          new Date(blog.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
      </td>
      <td className="px-6 py-4 text-center">
        <div className="flex gap-2 justify-center">
          <button
            className="px-3 py-1 text-sm bg-[#4CC2FF] text-black rounded hover:bg-[#3AA0DB] transition-colors"
            onClick={() => {
              setEditTarget(blog);
            }}
          >
            Edit Blog Info
          </button>
          <button
            onClick={() => {
              setDeleteTarget(blog);
            }}
            className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
          <button
            className="px-3 py-1 text-sm bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
            onClick={() => setPreview(true)}
          >
            Preview
          </button>
        </div>
        <BlogPreview
          blog={blog}
          isOpen={preview}
          onClose={() => setPreview(false)}
        />
      </td>
    </tr>
  );
}
