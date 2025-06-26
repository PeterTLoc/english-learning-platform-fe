import BlogList from "@/components/blog/BlogList";
import ServerPagination from "@/components/common/ServerPagination";
import BlogService from "@/services/blogService";
import BlogSearch from "@/components/blog/BlogSearch";

const blogService = new BlogService();
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; size?: string; search?: string }>;
}) {
  const {
    page: pageParam,
    size: sizeParam,
    search: searchParam,
  } = await searchParams;
  const page = Number(pageParam) || 1;
  const size = Number(sizeParam) || 3;
  const search = searchParam;
  const fetchedData = await blogService.getBlogs(page, size, search);
  const blogs = fetchedData.data;

  return (
    <div>
      <BlogSearch search={searchParam || ""} />
      <div className="flex justify-center items-center p-5 my-20">
        {blogs && <BlogList blogs={blogs}></BlogList>}
      </div>
      <ServerPagination
        pageSize={size}
        totalPages={fetchedData.totalPages}
        currentPage={fetchedData.page}
      />
    </div>
  );
}
