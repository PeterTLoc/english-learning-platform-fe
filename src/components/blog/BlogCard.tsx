"use client"
import { IBlog } from "@/types/models/IBlog"
import { getRelativeTime } from "@/utils/getRelativeTime"
import HtmlPreview from "@/utils/HtmlPreview"
import { ObjectId } from "mongoose"
import Image from "next/image"
import Link from "next/link"
import React from "react"

export default function BlogCard({ blog }: { blog: IBlog }) {
  const { title, coverImage, content, createdAt, updatedAt } = blog
  const date = getRelativeTime(updatedAt || createdAt)

  return (
    <div className="w-full max-w-xs sm:max-w-sm md:max-w-md">
      {/* Clickable Part (Image + Title) */}
      <Link href={`/blog/${(blog._id as ObjectId).toString()}`}>
        <div className="cursor-pointer">
          {/* Shine Effect Wrapper */}
          <div className="blog-shine rounded-lg">
            <figure className="relative w-full h-[230px]">
              <Image
                src={coverImage}
                alt={title}
                fill
                className="object-cover rounded-lg"
                priority
              />
            </figure>
          </div>
          <h3
            className="font-bold text-white mt-2 line-clamp-2 hover:underline"
            style={{ lineHeight: "1.5rem" }}
          >
            {title}
          </h3>
        </div>
      </Link>

      {/* Non-clickable Content */}
      <div className="px-1 mt-1">
        <span className="subtext text-sm text-gray-400">
          <HtmlPreview htmlString={content} lines={1} />
        </span>
        <div className="flex justify-between items-center text-sm mt-1 text-gray-500">
          <span className="subtext">{date}</span>
        </div>
      </div>
    </div>
  )
}
