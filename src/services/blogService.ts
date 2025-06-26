import api from "@/lib/api";
import { GetBlogResponse, GetBlogsResponse } from "@/types/blog/blog";

class BlogService {
  async getBlogs(
    page?: number,
    size?: number,
    order?: string,
    sortBy?: string,
    search?: string
  ): Promise<GetBlogsResponse> {
    let query;
    if (page) {
      query = `page=${page}&`;
    }
    if (size) {
      query = query ? `${query}size=${size}&` : `size=${size}&`;
    }
    if (search) {
      query = query ? `${query}search=${search}&` : `search=${search}&`;
    }
    if (order) {
      query = query ? `${query}order=${order}&` : `order=${order}&`;
    }
    if (sortBy) {
      query = query ? `${query}sortBy=${sortBy}&` : `sortBy=${sortBy}&`;
    }
    const url = query ? `/api/blogs?${query}` : "/blogs";
    const response = await api.get(url);
    return response.data;
  }

  async getBlog(id: string): Promise<GetBlogResponse> {
    const response = await api.get(`/api/blogs/${id}`);
    return response.data;
  }
}

export default BlogService;
