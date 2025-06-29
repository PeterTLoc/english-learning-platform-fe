export interface IMembership {
  _id: string;
  name: string;
  description?: string;
  price: number;
  duration: number; // in days
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GetMembershipResponse {
  membership: IMembership;
  message: string;
}

export interface GetMembershipsResponse {
  data: IMembership[];
  totalPages: number;
  page: number;
  total: number;
  message: string;
}

export interface PaginatedMemberships {
  data: IMembership[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
}
