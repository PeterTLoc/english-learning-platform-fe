"use client";
import { IBlog } from "@/types/models/IBlog";
import React, { useState, useEffect } from "react";
import { BlogStatusEnum } from "@/enums/BlogStatusEnum";
import { ObjectId } from "mongoose";
import Image from "next/image";

export default function EditBlogModal({
  blog,
  isOpen,
  onClose,
  onUpdated,
}: {
  blog: IBlog;
  isOpen: boolean;
  onClose: () => void;
  onUpdated?: (
    id: string,
    title?: string,
    status?: BlogStatusEnum,
    file?: File | string
  ) => void;
}) {
  const [title, setTitle] = useState(blog.title);
  const [status, setStatus] = useState(blog.status);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(blog.coverImage);

  useEffect(() => {
    setTitle(blog.title);
    setStatus(blog.status);
    setImagePreview(blog.coverImage);
    setCoverImage(null);
  }, [blog]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-2 sm:px-4">
      <div className="bg-[#202020] rounded-lg shadow-2xl w-full max-w-xs sm:max-w-md p-4 sm:p-8 relative">
        <h2 className="text-2xl font-bold mb-6 text-start text-white">
          Edit Blog
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onUpdated?.(
              (blog._id as ObjectId).toString(),
              title,
              status as BlogStatusEnum,
              coverImage || undefined
            );
          }}
          className="space-y-5"
        >
          <div>
            <label className="block font-semibold mb-1 text-white text-start">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 sm:p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none text-black text-base sm:text-lg"
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-white text-start">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as BlogStatusEnum)}
              className="w-full border border-gray-300 rounded-lg p-2 sm:p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none text-black text-base sm:text-lg"
              required
            >
              {Object.values(BlogStatusEnum).map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-semibold mb-1 text-white text-start">
              Cover Image
            </label>
            {imagePreview && (
              <Image
                src={imagePreview}
                alt="Cover Preview"
                width={100}
                height={100}
                objectFit="cover"
                quality={100}
                className="w-full h-32 sm:h-40 object-cover rounded-lg border border-gray-200 mb-2"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full text-white text-sm sm:text-base"
            />
          </div>
          <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-gray-300 transition text-base sm:text-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50 text-base sm:text-lg"
            >
              Update Blog
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
