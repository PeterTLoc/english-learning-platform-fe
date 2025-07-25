"use client"

import { IBlog } from "@/types/models/IBlog"
import BlogList from "./BlogList"
import { useEffect, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"
import { AnimatePresence } from "framer-motion"

export default function BlogListWrapper({ blogs }: { blogs: IBlog[] }) {
  const [direction, setDirection] = useState<"left" | "right" | "bottom">("bottom")
  const prevPage = useRef<number | null>(null)
  const searchParams = useSearchParams()
  const currentPage = Number(searchParams.get("page") || "1")

  const firstRender = useRef(true)

  useEffect(() => {
    if (firstRender.current) {
      setDirection("bottom") // Initial load animation
      firstRender.current = false
    } else {
      if (prevPage.current !== null) {
        if (currentPage > prevPage.current) {
          setDirection("left")
        } else if (currentPage < prevPage.current) {
          setDirection("right")
        }
      }
    }

    prevPage.current = currentPage
  }, [currentPage])

  return (
    <AnimatePresence mode="wait">
      <BlogList
        key={`page-${currentPage}`}
        blogs={blogs}
        direction={direction}
      />
    </AnimatePresence>
  )
}
