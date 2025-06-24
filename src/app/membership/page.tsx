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
  const { total, totalPages, page: currentPage } = fetchedData;

  return (
    <div>
      <h1 className="title text-center font-bold [text-shadow:2px_2px_5px_white] underline">
        MEMBERSHIPS
      </h1>
      <div className="flex justify-center items-center p-5 my-20">
        <MembershipList memberships={memberships} />
      </div>
      <div className="flex justify-center items-center">
        <ServerPagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={size}
        />
      </div>
    </div>
  );
}
