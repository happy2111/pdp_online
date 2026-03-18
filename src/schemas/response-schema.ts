export type Pagination<T> = T & {
  page_size: number;
  total_elements: number;
  total_pages: number;
  current_page: number;
};

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}