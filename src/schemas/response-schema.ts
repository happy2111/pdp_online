export type Pagination<T> = T & {
  page_size: number;
  total_elements: number;
  total_pages: number;
  current_page: number;
};

export interface BaseResponse {
  code: number;
  message: string;
}

export interface ApiResponse<T> extends BaseResponse {
  data: T;
}

export interface ApiResponseItems<T> {
  code: number;
  message: string;
  items: T;
}