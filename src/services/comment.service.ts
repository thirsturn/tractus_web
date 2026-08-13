import api from './api';
import type { CommentResponse, CommentCreateRequest } from '../types/comment.types';

const commentService = {
  getCommentsByThread: async (threadId: number): Promise<CommentResponse[]> => {
    const response = await api.get<CommentResponse[]>(`/comments/thread/${threadId}`);
    return response.data;
  },

  createComment: async (data: CommentCreateRequest): Promise<CommentResponse> => {
    const response = await api.post<CommentResponse>('/comments', data);
    return response.data;
  }
};

export default commentService;
