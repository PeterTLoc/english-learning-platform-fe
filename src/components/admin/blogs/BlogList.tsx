"use client";
import { useEffect, useState } from "react";
import BlogService from "@/services/blogService";
import { IBlog } from "@/types/models/IBlog";
import BlogListItem from "./BlogListItem";
import ServerPagination from "@/components/common/ServerPagination";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import CreateBlogModal from "./CreateBlogModal";
import { ObjectId } from "mongoose";
import BlogFilter from "./BlogFilter";
import DeleteConfirmModal from "./DeleteConfirmModal";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { BlogStatusEnum } from "@/enums/BlogStatusEnum";
import EditBlogModal from "./EditBlogModal";

const blogService = new BlogService();

export default function BlogList({
  page,
  size,
}: {
  page: number;
  size: number;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<string>("date");
  const [sortOrder, setSortOrder] = useState<string>("desc");
  const [editTarget, setEditTarget] = useState<IBlog | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<IBlog | null>(null);
  const [blogsData, setBlogsData] = useState<{
    data: IBlog[];
    totalPages: number;
  } | null>(null);

  const [createModalOpen, setCreateModalOpen] = useState(false);

  const handleSearch = () => {
    blogService
      .getBlogs(page, size, searchTerm, sortOrder, sortBy)
      .then(setBlogsData);
  };

  const handleReset = () => {
    setSearchTerm("");
    setSortBy("date");
    setSortOrder("desc");
    blogService.getBlogs(page, size).then(setBlogsData);
  };

  const handleUpdateBlog = async (
    id: string,
    title?: string,
    status?: BlogStatusEnum,
    file?: string | File
  ) => {
    try {
      const result = await blogService.updateBlog(id, title, status, file);

      setBlogsData((prev) =>
        prev
          ? {
              ...prev,
              data: prev.data.map((blog) =>
                blog._id ===
                (result as { blog: IBlog; message: string }).blog._id
                  ? result.blog
                  : blog
              ),
            }
          : prev
      );
      toast.success("Blog updated successfully");
      setEditTarget(null);
    } catch (err) {
      toast.error(
        err instanceof AxiosError
          ? err.response?.data.message
          : "Failed to update blog"
      );
    }
  };

  const handleDeleteBlog = async (id: string) => {
    try {
      await blogService.deleteBlog(id);
      setBlogsData((prev) =>
        prev
          ? {
              ...prev,
              data: prev.data.filter((blog) => blog._id !== id),
            }
          : prev
      );
      toast.success("Blog deleted successfully");
      setDeleteTarget(null);
    } catch (err) {
      toast.error(
        err instanceof AxiosError
          ? err.response?.data.message
          : "Failed to delete blog"
      );
    }
  };

  const handleCreateBlog = async (
    title: string,
    content: string,
    status: BlogStatusEnum,
    image: File | null,
    attachments: File[]
  ) => {
    try {
      const result = await blogService.createBlog(
        title,
        content,
        status,
        image as File,
        attachments
      );
      setBlogsData((prev) =>
        prev
          ? {
              ...prev,
              data: [result.blog, ...prev.data], // or refetch, or append as needed
            }
          : prev
      );
      toast.success("Blog created successfully");
      setCreateModalOpen(false);
    } catch (error) {
      toast.error(
        error instanceof AxiosError
          ? error.response?.data?.message
          : "An error occurred"
      );
    }
  };

  useEffect(() => {
    //had to call api here
    const fetchBlogs = async () => {
      const data = await blogService.getBlogs(page, size);
      setBlogsData(data);
    };
    fetchBlogs();
  }, [page, size]);

  if (!blogsData)
    return (
      <div>
        <LoadingSpinner></LoadingSpinner>
      </div>
    );

  return (
    <div className="flex flex-col w-full mx-2 rounded-md shadow-md">
      <div className="flex justify-center mb-4">
        <button
          className="bg-[#4CC2FF] text-black px-4 py-2 rounded-md"
          onClick={() => setCreateModalOpen(true)}
        >
          Create Blog
        </button>
      </div>
      <BlogFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        handleSearch={handleSearch}
        handleReset={handleReset}
      />
      <div className="overflow-x-auto">
        <table className="w-full text-md text-left text-[#CFCFCF]">
          <thead className="text-sm uppercase bg-[#373737] text-white">
            <tr>
              <th className="px-6 py-3 text-center">Image</th>
              <th className="px-6 py-3 text-center">Title</th>
              <th className="px-6 py-3 text-center">Author</th>
              <th className="px-6 py-3 text-center">Status</th>
              <th className="px-6 py-3 text-center">Created</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogsData.data.map((blog) => (
              <BlogListItem
                key={(blog._id as ObjectId).toString()}
                blog={blog}
                setEditTarget={setEditTarget}
                setDeleteTarget={setDeleteTarget}
              />
            ))}
          </tbody>
        </table>
      </div>
      <ServerPagination
        currentPage={page}
        totalPages={blogsData.totalPages}
        pageSize={size}
      />
      <CreateBlogModal
        isOpen={createModalOpen}
        toggleOpen={() => setCreateModalOpen(!createModalOpen)}
        onCreate={handleCreateBlog}
      />
      {editTarget && (
        <EditBlogModal
          blog={editTarget}
          isOpen={!!editTarget}
          onClose={() => setEditTarget(null)}
          onUpdated={handleUpdateBlog}
        />
      )}

      {deleteTarget && (
        <DeleteConfirmModal
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onDelete={() =>
            handleDeleteBlog((deleteTarget._id as ObjectId).toString())
          }
        />
      )}
    </div>
  );
}
