import { IBlog } from "@/types/models/IBlog";
import Image from "next/image";
import React from "react";

export default function BlogContent({ blog }: { blog: IBlog }) {
  return (
    <div className="min-h-screen bg-gray-950 py-12 sm:py-16 px-2">
      <article className="max-w-3xl mx-auto bg-gray-900 rounded-lg shadow-2xl overflow-hidden">
        <div className="relative h-64 sm:h-80 md:h-[28rem]">
          <Image
            src={blog.coverImage}
            alt={blog.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <h1 className="absolute bottom-6 left-6 right-6 text-3xl sm:text-4xl md:text-5xl font-extrabold text-white drop-shadow-[0_4px_24px_rgba(0,212,255,0.8)] bg-black/40 rounded-lg px-4 py-2 border-l-4 border-cyan-400">
            {blog.title}
          </h1>
        </div>
        <div className="prose prose-invert prose-lg max-w-none p-6 sm:p-10 md:p-12 text-gray-100">
          {/* If your HTML is trusted */}
          <div dangerouslySetInnerHTML={{ __html: blog.content }} />
        </div>
      </article>
    </div>
  );
}
