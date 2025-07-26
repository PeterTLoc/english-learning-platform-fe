import ServerPagination from "@/components/common/ServerPagination"
import MembershipList from "@/components/membership/MembershipList"
import MembershipService from "@/services/membershipService"
import { IMembership } from "@/types/membership/membership"

const membershipService = new MembershipService()

export default async function Page({
  searchParams,
}: {
  searchParams: {
    page?: string
    size?: string
  }
}) {
  const { page: pageParam, size: sizeParam } = await searchParams
  const page = Number(pageParam) || 1
  const size = Number(sizeParam) || 8

  const fetchedData = await membershipService.getMemberships(page, size)

  const memberships: IMembership[] = fetchedData.data || []
  const { totalPages, page: currentPage } = fetchedData

  return (
    <div className="px-5 pt-5 flex justify-center">
      <div className="w-[1625px]">
        <h1 className="title">Memberships</h1>
        <MembershipList memberships={memberships} />
        <ServerPagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={size}
        />
      </div>
    </div>
  )
}
