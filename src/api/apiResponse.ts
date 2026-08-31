export interface ApiSuccessResponse<T, TMeta = unknown> {
  success: true;
  data: T;
  message?: string;
  meta?: TMeta;
}

export interface PaginatedApiResponse<T, TMeta> extends ApiSuccessResponse<T, TMeta> {
  meta: TMeta;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details: unknown;
    requestId?: string;
  };
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}
