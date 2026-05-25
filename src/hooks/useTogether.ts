import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  addCommunityPost,
  editCommunityPost,
  fetchCommunityPostById,
  fetchCommunityPosts,
  removeCommunityPost,
} from '../api/together.api.ts';
import type {
  CommunityPostAddPayload,
  CommunityPostEditPayload,
} from '../types/together.type.ts';

export const useFetchCommunityPosts = () => {
  return useQuery({
    queryKey: ['communityPosts'],
    queryFn: fetchCommunityPosts,
  });
};

export const useFetchCommunityPostById = (id: number) => {
  return useQuery({
    queryKey: ['communityPost', id],
    queryFn: () => fetchCommunityPostById(id),
  });
};

export const useAddCommunityPost = () => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, CommunityPostAddPayload>({
    mutationFn: addCommunityPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communityPosts'] });
    },
  });
};

export const useEditCommunityPost = () => {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    Error,
    { id: number; data: CommunityPostEditPayload }
  >({
    mutationFn: editCommunityPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communityPosts'] });
    },
  });
};

export const useRemoveCommunityPost = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: removeCommunityPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communityPosts'] });
    },
  });
};
