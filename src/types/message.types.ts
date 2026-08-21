import type { User } from './auth.types';

export interface MessageResponse {
  id: number;
  sender: User;
  recipient: User;
  content: string;
  createdAt: string;
  read: boolean;
}

export interface MessageRequest {
  recipientUsername: string;
  content: string;
}
