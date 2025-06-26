import BlogContent from "@/components/blog/[id]/BlogContent";
import BlogService from "@/services/blogService";

const blogService = new BlogService();

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  const blog = await blogService.getBlog(id);
  return <BlogContent blog={blog.blog} />;
}
