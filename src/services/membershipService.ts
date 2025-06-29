import api from "@/lib/api";
import {
  GetMembershipResponse,
  GetMembershipsResponse,
  IMembership,
  PaginatedMemberships,
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

interface GetMembershipsParams {
  page: number;
  size: number;
  search?: string;
  price?: "asc" | "desc" | "";
  duration?: "asc" | "desc" | "";
  sortBy?: string;
  order?: string;
}

export const getAllMemberships = async (params: GetMembershipsParams): Promise<PaginatedMemberships> => {
  const { page, size, search, price, duration, sortBy, order } = params;
  const response = await api.get<PaginatedMemberships>('/api/memberships', {
    params: {
      page,
      size,
      search,
      price,
      duration,
      sortBy,
      order
    }
  });
  return response.data;
};

export const getMembershipById = async (id: string): Promise<IMembership> => {
  const response = await api.get<IMembership>(`/api/memberships/${id}`);
  return response.data;
};

export const createMembership = async (membershipData: Partial<IMembership>): Promise<IMembership> => {
  const response = await api.post<IMembership>('/api/memberships', membershipData);
  return response.data;
};

export const updateMembership = async (id: string, membershipData: Partial<IMembership>): Promise<IMembership> => {
  const response = await api.put<IMembership>(`/api/memberships/${id}`, membershipData);
  return response.data;
};

export const deleteMembership = async (id: string): Promise<void> => {
  await api.delete(`/api/memberships/${id}`);
};

export default MembershipService;
