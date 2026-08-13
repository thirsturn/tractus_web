import type { User } from './auth.types';

export interface ThreadResponse {
  id: number;
  title: string;
  content: string;
  imageUrl?: string;
  author: User;
  spaceId: number;
}
