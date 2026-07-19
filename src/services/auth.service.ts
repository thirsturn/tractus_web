import api from './api';
import type { AuthResponse } from '../types/auth.types';

// The data structure required by the backend to register a user
export interface RegisterData {
  username: string;
  email: string;
  passwordHash: string;
}

// The data structure required by the backend to login
export interface LoginData {
  username: string;
  password: string;
}

const authService = {
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterData): Promise<any> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  }
};

export default authService;
