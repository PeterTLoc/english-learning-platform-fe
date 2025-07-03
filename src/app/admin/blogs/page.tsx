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
    <div className="px-2 py-4 sm:px-4 md:px-8 max-w-5xl mx-auto w-full">
      <BlogList page={page} size={size} />
    </div>
  );
}
