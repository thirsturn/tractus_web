import api from './api';
import type { User } from '../types/auth.types';

export interface UserUpdateData {
  bio?: string;
  location?: string;
  website?: string;
}

const userService = {
  getUserByUsername: async (username: string): Promise<User> => {
    const response = await api.get<User>(`/users/${username}`);
    return response.data;
  },

  updateUser: async (id: number, data: UserUpdateData): Promise<User> => {
    const response = await api.put<User>(`/users/${id}`, data);
    return response.data;
  }
};

export default userService;
