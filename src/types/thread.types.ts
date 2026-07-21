import type { User } from './auth.types';

export interface ThreadResponse {
  id: number;
  title: string;
  author: User;
  spaceId: number;
}
