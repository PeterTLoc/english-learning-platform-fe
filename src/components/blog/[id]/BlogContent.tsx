"use client"

import { IBlog } from "@/types/models/IBlog"
import React from "react"
import { motion } from "framer-motion"
import Image from "next/image"

export default function BlogContent({ blog }: { blog: IBlog }) {
  const author = blog.user
  const authorName = author?.username || "Unknown Author"
  const authorAvatar =
    author?.avatar ||
    "https://ui-avatars.com/api/?background=random&name=" +
      encodeURIComponent(authorName)

  const formattedDate = new Date(blog.createdAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="relative min-h-screen bg-[#202020] text-white">
      {/* Full width cover image with heavy blur + gradient */}
      {blog.coverImage && (
        <div
          className="relative w-full h-[448px] overflow-hidden"
          style={{
            marginLeft: "calc(-50vw + 50%)",
            marginRight: "calc(-50vw + 50%)",
          }}
        >
          <Image
            src={blog.coverImage}
            alt={blog.title}
            fill
            className="object-cover"
            priority
          />

          {/* Heavy blur overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backdropFilter: "blur(30px)",
              WebkitBackdropFilter: "blur(30px)",
              background: "rgba(0,0,0,0.2)", // subtle tint
              pointerEvents: "none",
            }}
          />

          {/* Gradient overlay for better text contrast */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to bottom, rgba(32,32,32,0.4) 0%, rgba(32,32,32,0.75) 65%, #202020 100%)",
              pointerEvents: "none",
            }}
          />

          {/* Title + author/date overlay */}
          <div
            className="absolute w-full flex flex-col items-center text-center px-4"
            style={{
              top: "30%",
              transform: "translateY(-20%)",
            }}
          >
            <h1
              className="text-white font-semibold text-2xl md:text-3xl leading-snug max-w-[800px]"
              style={{
                textShadow: "0 3px 10px rgba(0,0,0,0.7)",
              }}
            >
              {blog.title}
            </h1>

            {/* Author + date line */}
            <div className="flex items-center gap-3 mt-3 text-sm text-gray-300">
              <Image
                src={authorAvatar}
                alt={authorName}
                width={32}
                height={32}
                className="rounded-full object-cover"
                style={{
                  width: "32px",
                  height: "32px",
                  minWidth: "32px",
                  minHeight: "32px",
                }}
              />
              <span>{authorName}</span>
              <span className="opacity-50">•</span>
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>
      )}

      {/* Content container */}
      <div className="max-w-[1000px] mx-auto p-5">
        <motion.article
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: 0.25,
            ease: [0.33, 1, 0.68, 1],
          }}
          className="prose prose-invert max-w-none"
        >
          <div dangerouslySetInnerHTML={{ __html: blog.content }} />
        </motion.article>
      </div>
    </div>
  )
}
