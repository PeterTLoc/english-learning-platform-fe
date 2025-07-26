import ServerPagination from "@/components/common/ServerPagination"
import BlogService from "@/services/blogService"
import BlogSearch from "@/components/blog/BlogSearch"
import BlogListWrapper from "@/components/blog/BlogListWrapper"

const blogService = new BlogService()
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; size?: string; search?: string }>
}) {
  const {
    page: pageParam,
    size: sizeParam,
    search: searchParam,
  } = await searchParams
  const page = Number(pageParam) || 1
  const size = Number(sizeParam) || 20
  const search = searchParam
  const fetchedData = await blogService.getBlogs(page, size, search)
  const blogs = fetchedData.data

  return (
    <div className="px-5 pt-5 flex justify-center">
      <div className="w-[1625px]">
        <h1 className="title">Blogs</h1>
        <BlogSearch search={searchParam || ""} />
        {blogs && <BlogListWrapper blogs={blogs} />}
        <ServerPagination
          pageSize={size}
          totalPages={fetchedData.totalPages}
          currentPage={fetchedData.page}
        />
      </div>
    </div>
  )
}
