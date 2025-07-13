import AchievementWrapper from "@/components/admin/achievements/AchievementWrapper";

export default async function Page({
  searchParams,
}: {
  searchParams: {
    page?: string;
    size?: string;
    order?: string;
    sortBy?: string;
    search?: string;
    type?: string;
  };
}) {
  const { page, size, order, sortBy, search, type } = await searchParams;
  return (
    <>
      <AchievementWrapper
        page={page ? Number(page) : 1}
        size={size ? Number(size) : 5}
        order={order}
        sortBy={sortBy}
        search={search}
        type={type}
      />
    </>
  );
}
