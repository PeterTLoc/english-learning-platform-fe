import { IBlog } from "../models/IBlog";

export interface GetBlogResponse {
  blog: IBlog;
  message: string;
}
export interface GetBlogsResponse {
  data: IBlog[] | [];
  totalPages: number;
  page: number;
  total: number;
  message: string;
}
