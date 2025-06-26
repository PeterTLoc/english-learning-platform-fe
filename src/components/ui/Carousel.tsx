"use client"

import React, { useEffect, useState } from "react"
import { ChevronRight } from "lucide-react"

export interface CarouselProps<T> {
  items: T[]
  renderItem: (item: T) => React.ReactNode
  title?: string
  itemKey?: (item: T) => string | number
}

export default function Carousel<T>({
  items,
  renderItem,
  title = "Items",
  itemKey = (item) => (item as any).id,
}: CarouselProps<T>) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [visibleCount, setVisibleCount] = useState(4)
  const safeItems = items ?? []

  useEffect(() => {
    const updateVisibleCount = () => {
      const width = window.innerWidth

      if (width < 640) setVisibleCount(1)
      else if (width < 1024) setVisibleCount(2)
      else setVisibleCount(4)
    }

    updateVisibleCount()
    window.addEventListener("resize", updateVisibleCount)
    return () => window.removeEventListener("resize", updateVisibleCount)
  }, [])

  const maxIndex = Math.max(safeItems.length - visibleCount, 0)

  const handleNext = () =>
    setCurrentIndex((prev) => Math.min(prev + visibleCount, maxIndex))

  const handlePrev = () =>
    setCurrentIndex((prev) => Math.max(prev - visibleCount, 0))

  if (safeItems.length === 0) return null

  return (
    <section
      className="relative w-full mx-auto px-9 pt-10 max-w-[1625px]"
    >
      {/* Header */}
      <header className="flex justify-between items-center px-2">
        <div className="px-2 pt-1 pb-2 rounded-[5px] flex items-center gap-1 group cursor-pointer hover:text-[#4CC2FF] hover:bg-[#373737] transition-all">
          <h2 className="text-xl font-bold">{title}</h2>
          <ChevronRight
            size={18}
            strokeWidth={3}
            className="mt-[5px] text-[#4CC2FF] group-hover:translate-x-1 transition-transform"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="w-8 h-8 rounded-full bg-[#2B2B2B] text-white flex items-center justify-center disabled:opacity-50 hover:bg-[#3B3B3B] transition"
            aria-label="Previous"
          >
            ◀
          </button>
          <button
            onClick={handleNext}
            disabled={currentIndex >= maxIndex}
            className="w-8 h-8 rounded-full bg-[#2B2B2B] text-white flex items-center justify-center disabled:opacity-50 hover:bg-[#3B3B3B] transition"
            aria-label="Next"
          >
            ▶
          </button>
        </div>
      </header>
      
      {/* Carousel items */}
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${(100 / visibleCount) * currentIndex}%)`,
          }}
        >
          {safeItems.map((item) => (
            <div
              key={itemKey(item)}
              className="px-2"
              style={{ flex: `0 0 ${100 / visibleCount}%` }}
            >
              {renderItem(item)}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
