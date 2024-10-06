export interface PagingRequest {
  page: number;
  size: number;
}

export interface PagingSearchRequest {
  page: number;
  size: number;
  keyword?: string;
}
