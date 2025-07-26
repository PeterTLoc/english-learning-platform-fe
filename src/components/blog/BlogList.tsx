"use client"

import { IBlog } from "@/types/models/IBlog"
import React from "react"
import BlogCard from "./BlogCard"
import { ObjectId } from "mongoose"
import { motion } from "framer-motion"

interface BlogListProps {
  blogs: IBlog[]
  direction?: "left" | "right" | "bottom"
  firstLoad?: boolean
}

const directionVariants = {
  left: { x: 40 },
  right: { x: -40 },
  bottom: { y: 40 },
}

export default function BlogList({
  blogs,
  direction = "bottom",
  firstLoad = false,
}: BlogListProps) {
  const initial = firstLoad
    ? { y: 40 }
    : directionVariants[direction] || {}

  return (
    <motion.div
      key={direction + (firstLoad ? "-first" : "")}
      initial={initial}
      animate={{ x: 0, y: 0 }}
      transition={{
        duration: 0.25,
        ease: [0.33, 1, 0.68, 1],
      }}
      className="grid md:grid-cols-2 lg:grid-cols-4 gap-3"
    >
      {blogs.map((blog) => (
        <BlogCard key={(blog._id as ObjectId).toString()} blog={blog} />
      ))}
    </motion.div>
  )
}
