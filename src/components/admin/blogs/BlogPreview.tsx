import React from "react";
import { IBlog } from "@/types/models/IBlog";
import Image from "next/image";

interface BlogPreviewProps {
  blog: IBlog;
  isOpen: boolean;
  onClose: () => void;
}

export default function BlogPreview({
  blog,
  isOpen,
  onClose,
}: BlogPreviewProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-70 transition-opacity"
        onClick={onClose}
      />
      {/* Modal content */}
      <div className="relative z-10 max-w-2xl w-full mx-auto bg-gray-900 text-white shadow-lg rounded-xl overflow-hidden flex flex-col max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          type="button"
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl font-bold focus:outline-none"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <div className="w-full flex-shrink-0">
          <div className="relative h-64 sm:h-80 md:h-[22rem] w-full">
            <Image
              src={blog.coverImage}
              alt={blog.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white drop-shadow-[0_4px_24px_rgba(0,212,255,0.8)] bg-black/40 rounded-lg px-4 py-2 border-l-4 border-cyan-400 mt-4 mx-6">
            {blog.title}
          </h1>
        </div>
        <div className="prose prose-invert prose-lg max-w-none p-6 sm:p-8 text-gray-100 flex-1 text-left">
          <div dangerouslySetInnerHTML={{ __html: blog.content }} />
        </div>
      </div>
    </div>
  );
}
