import type { User } from './auth.types';

export interface NotificationResponse {
  id: number;
  actor: User;
  type: 'UPVOTE' | 'COMMENT' | 'FOLLOW' | 'MESSAGE';
  message: string;
  targetThreadId?: number;
  read: boolean;
  createdAt: string;
}
