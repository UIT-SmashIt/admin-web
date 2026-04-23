import axios, {type AxiosResponse} from 'axios';
import type {ApiResponse} from "../types/apiResponse.type.ts";

const apiClient = axios.create({
  baseURL: 'http://localhost:8080/',
  timeout: 10000, // Timeout sau 10 giây
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<any>>) => {
    if (!response.data.success) {
      return Promise.reject(new Error(response.data.message));
    }
    return response.data.data;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const api = {
  get: async <T>(url: string): Promise<T> => {
    return apiClient.get<any, T>(url);
  },

  post: async <T>(url: string, body: any): Promise<T> => {
    return apiClient.post<any, T>(url, body);
  },

  put: async <T>(url: string, body: any): Promise<T> => {
    return apiClient.put<any, T>(url, body);
  },

  delete: async <T>(url: string): Promise<T> => {
    return apiClient.delete<any, T>(url);
  },
};

// Bạn có thể thêm Interceptor để tự động gắn Token ở đây
/*
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});*/
