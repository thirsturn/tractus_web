export interface User {
  id: number;
  username: string;
  email: string;
  bio?: string;
  location?: string;
  website?: string;
  followerCount?: number;
  followingCount?: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}
