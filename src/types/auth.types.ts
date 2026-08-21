export interface User {
  id: number;
  username: string;
  email: string;
  bio?: string;
  location?: string;
  website?: string;
  followerCount?: number;
  followingCount?: number;
  profileImageUrl?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
