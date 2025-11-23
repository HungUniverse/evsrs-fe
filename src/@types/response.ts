import type HttpStatusCode from "@/lib/utils/httpStatusCode.enum";

export interface ItemBaseResponse<T> {
  data: T;
  message: string;
  statusCode: HttpStatusCode;
  code: string;
}

export interface ListBaseResponse<T> {
  data: {
    items: T[];
    pageNumber: number;
    totalPages: number;
    totalCount: number;
    pageSize: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
  additionalData?: string | null;
  message?: string | null;
  statusCode: HttpStatusCode;
  code: string;
}

export interface ErrorType {
  response?: {
    data?: {
      errorMessage?: string;
    };
  };
}
