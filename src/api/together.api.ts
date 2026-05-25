import { api } from './apiClient.ts';
import type {
  ICommunityPost,
  CommunityPostAddPayload,
  CommunityPostEditPayload,
} from '../types/together.type.ts';

// ===== Community Posts (Together) API =====
export const fetchCommunityPosts = async (): Promise<ICommunityPost[]> => {
  return api.get<ICommunityPost[]>('/api/together');
};

export const fetchCommunityPostById = async (id: number): Promise<ICommunityPost> => {
  return api.get<ICommunityPost>(`/api/together/${id}`);
};

export const addCommunityPost = async (
  newPost: CommunityPostAddPayload
): Promise<ICommunityPost> => {
  return api.post<ICommunityPost>('/api/together', newPost);
};

export const editCommunityPost = async ({
  id,
  data,
}: {
  id: number;
  data: CommunityPostEditPayload;
}): Promise<void> => {
  return api.put(`/api/together/${id}`, data);
};

export const removeCommunityPost = async (id: number): Promise<void> => {
  return api.delete(`/api/together/${id}`);
};
