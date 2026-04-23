export type ApiResponse<T> = {
  code: string;
  data: T;
  message: string;
  success: boolean;
  timestamp: string;
};