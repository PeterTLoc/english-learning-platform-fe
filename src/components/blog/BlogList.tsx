import { IBlog } from "@/types/models/IBlog";
import React from "react";
import BlogCard from "./BlogCard";
import { ObjectId } from "mongoose";

export default function BlogList({ blogs }: { blogs: IBlog[] }) {
  return (
    <div className="grid justify-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-7xl mx-auto px-2">
      {blogs &&
        blogs.map((blog) => (
          <BlogCard
            key={(blog._id as ObjectId).toString()}
            blog={blog}
          ></BlogCard>
        ))}
    </div>
  );
}
