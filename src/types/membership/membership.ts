import { IMembership } from "../models/IMembership";

export interface GetMembershipResponse {
  membership: IMembership;
  message: string;
}

export interface GetMembershipsResponse {
  data: IMembership[] | [];
  totalPages: number;
  page: number;
  total: number;
  message: string;
}
