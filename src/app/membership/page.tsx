import ServerPagination from "@/components/common/ServerPagination";
import MembershipList from "@/components/membership/MembershipList";
import MembershipService from "@/services/membershipService";
import { IMembership } from "@/types/membership/membership";

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

  const memberships: IMembership[] = fetchedData.data || [];
  const { totalPages, page: currentPage } = fetchedData;

  return (
    <div className="min-h-screen w-full bg-[#202020] py-8 px-4">
      <div className="w-full max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Memberships</h1>
          <p className="text-[#CFCFCF] text-lg">Choose the perfect plan for your learning journey</p>
        </div>
        
        <div className="mb-8">
          <MembershipList memberships={memberships} />
        </div>
        
        <div className="flex justify-center">
          <ServerPagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={size}
          />
        </div>
      </div>
    </div>
  );
}
