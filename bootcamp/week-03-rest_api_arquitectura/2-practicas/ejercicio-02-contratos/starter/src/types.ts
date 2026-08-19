export interface Book {
  id: number;
  title: string;
  author: string;
  year: number;
  pages: number;
}

export type CreateBookDto = Omit<Book, 'id'>;
export type UpdateBookDto = Partial<CreateBookDto>;

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