"use client";
import { IBlog } from "@/types/models/IBlog";
import HtmlPreview from "@/utils/HtmlPreview";
import { ObjectId } from "mongoose";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function BlogCard({ blog }: { blog: IBlog }) {
  const { title, coverImage, content, createdAt, updatedAt } = blog;
  const date = updatedAt
    ? new Date(updatedAt).toLocaleDateString()
    : new Date(createdAt!).toLocaleDateString();

  return (
    <Link href={`/blog/${(blog._id as ObjectId).toString()}`}>
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md bg-gray-900 rounded-lg shadow-[0_4px_32px_0_rgba(0,0,0,0.8),0_0px_0px_2px_rgba(0,212,255,0.15)] overflow-hidden transition-all duration-300 hover:shadow-[0_8px_40px_0_rgba(0,212,255,0.25),0_0px_0px_2px_rgba(0,212,255,0.25)] hover:-translate-y-1 cursor-pointer">
        <div className="relative w-full h-48">
          <Image
            src={coverImage}
            alt={title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Content */}
        <div className="p-3 sm:p-4">
          <h3
            className="text-lg sm:text-xl font-bold text-white mb-2 line-clamp-2"
            style={{ lineHeight: "1.5rem" }}
          >
            {title}
          </h3>
          <span className="text-gray-300 text-xs sm:text-sm mb-2">
            <HtmlPreview htmlString={content} maxLength={30} />
          </span>
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-400">Date: {date}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
