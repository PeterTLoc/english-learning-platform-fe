import { BlogStatusEnum } from "@/enums/BlogStatusEnum";
import api from "@/lib/api";
import { GetBlogResponse, GetBlogsResponse } from "@/types/blog/blog";

class BlogService {
  async getBlogs(
    page?: number,
    size?: number,
    search?: string,
    order?: string,
    sortBy?: string
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

  async createBlog(
    title: string,
    content: string,
    status: BlogStatusEnum,
    blogCover: File,
    blogAttachments: File[]
  ) {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("status", status);
    formData.append("blogCover", blogCover);
    blogAttachments.forEach((attachment) => {
      formData.append("blogAttachments", attachment);
    });

    const response = await api.post("/api/blogs", formData);
    return response.data;
  }

  async updateBlog(
    id: string,
    title?: string,
    status?: BlogStatusEnum,
    blogCover?: File | string
  ) {
    const formData = new FormData();
    if (title) formData.append("title", title);
    if (status) formData.append("status", status);
    if (blogCover) formData.append("blogCover", blogCover);

    const response = await api.patch(`/api/blogs/${id}`, formData);
    return response.data;
  }

  async deleteBlog(id: string) {
    const response = await api.delete(`/api/blogs/${id}`);
    return response.data;
  }
}

export default BlogService;
