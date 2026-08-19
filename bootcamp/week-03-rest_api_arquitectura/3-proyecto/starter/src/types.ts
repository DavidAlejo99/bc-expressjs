
export interface Child {
  id: number;
  name: string;
  group: string;
  monthlyFee: number;
  active: boolean;
  createdAt: string;
}

export type CreateChildDto = Omit<Child, 'id' | 'createdAt'>;
export type UpdateChildDto = Partial<CreateChildDto>;

export interface SingleResponse<T> {
  data: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface ErrorResponse {
  error: string;
  message: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}