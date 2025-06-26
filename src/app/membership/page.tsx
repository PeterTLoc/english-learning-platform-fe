import ServerPagination from "@/components/common/ServerPagination";
import MembershipList from "@/components/membership/MembershipList";
import MembershipService from "@/services/membershipService";

const membershipService = new MembershipService();

export default async function Page({
  searchParams,
}: {
  searchParams: {
    page?: string;
    size?: string;
  };
}) {
  const { page: pageParam, size: sizeParam } = await searchParams;
  const page = Number(pageParam) || 1;
  const size = Number(sizeParam) || 3;

  const fetchedData = await membershipService.getMemberships(page, size);

  const memberships = fetchedData.data || [];
  const { totalPages, page: currentPage } = fetchedData;

  return (
    <div className="w-[100%]">
      <h1 className="title text-center font-bold [text-shadow:2px_2px_5px_white] underline">
        MEMBERSHIPS
      </h1>
      <div className="flex justify-center items-center p-2 md:p-5 my-8 md:my-20">
        <MembershipList memberships={memberships} />
      </div>
      <div className="flex justify-center items-center px-2 md:px-0">
        <ServerPagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={size}
        />
      </div>
    </div>
  );
}
