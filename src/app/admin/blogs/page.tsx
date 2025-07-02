import BlogList from "@/components/admin/blogs/BlogList";

export default async function Page({
  searchParams,
}: {
  searchParams: { page: string; size: string };
}) {
  const { page: PageParam, size: SizeParam } = await searchParams;
  const page = parseInt(PageParam || "1");
  const size = parseInt(SizeParam || "10");
  return (
    <div className="p-4">
      <BlogList page={page} size={size} />
    </div>
  );
}
