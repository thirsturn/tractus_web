export interface User {
  id: number;
  username: string;
  email: string;
  bio?: string;
  location?: string;
  website?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
