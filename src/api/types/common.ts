export interface NestErrorResponse {
  message: string;
  error: string;
  statusCode: number;
}

export interface NestResponse<T> {
  message: string | string[];
  nextCursor?: number | string;
  data: T;
}
