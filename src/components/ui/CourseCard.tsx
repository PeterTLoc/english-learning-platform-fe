"use client"

import Link from "next/link"

export interface CourseCardProps {
  id: string | number
  title: string
  description?: string
  href: string
  imageUrl: string
  ctaLabel?: string
}

export default function CourseCard({
  id,
  title,
  description,
  href,
  imageUrl,
  ctaLabel = "Learn",
}: CourseCardProps) {
  return (
    <Link href={href}>
      <div className="relative border-[#232323] h-[250px] mt-1 rounded-[5px] overflow-hidden shadow-md group transform transition duration-300 ease-in-out hover:-translate-y-1 cursor-pointer">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5 flex justify-between items-end">
          <div className="w-[70%]">
            <h3 className="text-white text-lg font-bold truncate">{title}</h3>
            <p className="text-sm text-gray-300 truncate">{description}</p>
          </div>
          <div className="whitespace-nowrap px-3 py-1 bg-white/10 text-white rounded hover:bg-white/20 transition text-xs">
            {ctaLabel}
          </div>
        </div>
      </div>
    </Link>
  )
}
