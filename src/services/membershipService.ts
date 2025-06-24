import api from "@/lib/api";
import {
  GetMembershipResponse,
  GetMembershipsResponse,
} from "@/types/membership/membership";

class MembershipService {
  async getMembership(id: string): Promise<GetMembershipResponse> {
    const response = await api.get(`/api/memberships/${id}`);
    return response.data;
  }

  async getMemberships(
    page?: number,
    size?: number,
    order?: string,
    sortBy?: string,
    search?: string
  ): Promise<GetMembershipsResponse> {
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
    const url = query ? `/api/memberships?${query}` : "/memberships";
    const response = await api.get(url);
    return response.data;
  }
}

export default MembershipService;
