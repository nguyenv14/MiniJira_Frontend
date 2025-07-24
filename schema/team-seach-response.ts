// models/User.ts
export interface Users {
  _id: string;
  username: string;
  email: string;
  role: number;
  isActive: boolean;
}

export interface PaginationResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
