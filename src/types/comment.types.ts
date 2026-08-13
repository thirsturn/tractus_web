import type { User } from './auth.types';

export interface CommentCreateRequest {
  content: string;
  userId: number;
  threadId: number;
  parentCommentId?: number;
}

export interface CommentResponse {
  id: number;
  content: string;
  author: User;
  threadId: number;
  parentCommentId?: number;
}
