"use client"
import { useEffect, useState } from "react"
import BlogService from "@/services/blogService"
import { IBlog } from "@/types/models/IBlog"
import BlogListItem from "./BlogListItem"
import ServerPagination from "@/components/common/ServerPagination"
import LoadingSpinner from "@/components/ui/LoadingSpinner"
import CreateBlogModal from "./CreateBlogModal"
import { ObjectId } from "mongoose"
import BlogFilter from "./BlogFilter"
import { useToast } from "@/context/ToastContext"
import { useConfirmation } from "@/context/ConfirmationContext"
import { AxiosError } from "axios"
import { BlogStatusEnum } from "@/enums/BlogStatusEnum"
import EditBlogModal from "./EditBlogModal"

const blogService = new BlogService()

export default function BlogList({
  page,
  size,
}: {
  page: number
  size: number
}) {
  const { showToast } = useToast()
  const { showConfirmation } = useConfirmation()
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<string>("date")
  const [sortOrder, setSortOrder] = useState<string>("desc")
  const [editTarget, setEditTarget] = useState<IBlog | null>(null)
  const [blogsData, setBlogsData] = useState<{
    data: IBlog[]
    totalPages: number
  } | null>(null)

  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [createLoading, setCreateLoading] = useState(false)
  const [updateLoading, setUpdateLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)

  const handleSearch = () => {
    blogService
      .getBlogs(page, size, searchTerm, sortOrder, sortBy)
      .then(setBlogsData)
  }

  const handleReset = () => {
    setSearchTerm("")
    setSortBy("date")
    setSortOrder("desc")
    blogService.getBlogs(page, size).then(setBlogsData)
  }

  const handleUpdateBlog = async (
    id: string,
    title?: string,
    status?: BlogStatusEnum,
    file?: string | File
  ) => {
    try {
      setUpdateLoading(true)
      const result = await blogService.updateBlog(id, title, status, file)

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
      )
      showToast("Blog updated successfully", "success")
      setEditTarget(null)
    } catch (err) {
      showToast(
        err instanceof AxiosError
          ? err.response?.data.message
          : "Failed to update blog",
        "error"
      )
    } finally {
      setUpdateLoading(false)
    }
  }

  const handleDeleteBlog = async (id: string) => {
    try {
      setDeleteLoading(id)
      await blogService.deleteBlog(id)
      setBlogsData((prev) =>
        prev
          ? {
              ...prev,
              data: prev.data.filter((blog) => blog._id !== id),
            }
          : prev
      )
      showToast("Blog deleted successfully", "success")
    } catch (err) {
      showToast(
        err instanceof AxiosError
          ? err.response?.data.message
          : "Failed to delete blog",
        "error"
      )
    } finally {
      setDeleteLoading(null)
    }
  }

  const handleDeleteBlogWithConfirmation = async (blog: IBlog) => {
    const confirmed = await showConfirmation({
      title: "Delete Blog",
      message: `Are you sure you want to delete "${blog.title}"? This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "danger",
    })

    if (confirmed) {
      await handleDeleteBlog((blog._id as ObjectId).toString())
    }
  }

  const handleCreateBlog = async (
    title: string,
    content: string,
    status: BlogStatusEnum,
    image: File | null,
    attachments: File[]
  ) => {
    try {
      setCreateLoading(true)
      const result = await blogService.createBlog(
        title,
        content,
        status,
        image as File,
        attachments
      )
      setBlogsData((prev) =>
        prev
          ? {
              ...prev,
              data: [result.blog, ...prev.data], // or refetch, or append as needed
            }
          : prev
      )
      showToast("Blog created successfully", "success")
      setCreateModalOpen(false)
    } catch (error) {
      showToast(
        error instanceof AxiosError
          ? error.response?.data?.message
          : "An error occurred",
        "error"
      )
    } finally {
      setCreateLoading(false)
    }
  }

  useEffect(() => {
    //had to call api here
    const fetchBlogs = async () => {
      const data = await blogService.getBlogs(page, size)
      setBlogsData(data)
    }
    fetchBlogs()
  }, [page, size])

  if (!blogsData)
    return (
      <div>
        <LoadingSpinner></LoadingSpinner>
      </div>
    )

  return (
    <div className="flex flex-col w-full mx-auto rounded-md py-2">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-white">Blog Management</h1>
        <button
          className="bg-[#4CC2FF] text-black px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => setCreateModalOpen(true)}
          disabled={createLoading}
        >
          {createLoading ? "Creating..." : "Create Blog"}
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
      <div className="overflow-x-auto rounded-md">
        <table className="min-w-[600px] w-full text-md text-left text-[#CFCFCF]">
          <thead className="text-sm uppercase bg-[#373737] text-white">
            <tr>
              <th className="px-6 py-3 text-center">Image</th>
              <th className="px-6 py-3 text-center">Title</th>
              <th className="px-6 py-3 text-center">Author</th>
              <th className="px-6 py-3 text-center">Status</th>
              <th className="px-6 py-3 text-center">Created At</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogsData.data.map((blog) => (
              <BlogListItem
                key={(blog._id as ObjectId).toString()}
                blog={blog}
                setEditTarget={setEditTarget}
                setDeleteTarget={handleDeleteBlogWithConfirmation}
                isDeleting={deleteLoading === (blog._id as ObjectId).toString()}
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
        loading={createLoading}
      />
      {editTarget && (
        <EditBlogModal
          blog={editTarget}
          isOpen={!!editTarget}
          onClose={() => setEditTarget(null)}
          onUpdated={handleUpdateBlog}
          loading={updateLoading}
        />
      )}
    </div>
  )
}
