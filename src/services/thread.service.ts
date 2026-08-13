import api from './api';
import type { ThreadResponse } from '../types/thread.types';

const threadService = {
  getThreadsBySpace: async (spaceId: number): Promise<ThreadResponse[]> => {
    const response = await api.get<ThreadResponse[]>(`/threads/space/${spaceId}`);
    return response.data;
  },
  
  createThread: async (threadData: { title: string; spaceId: number; content?: string; userId: number }): Promise<ThreadResponse> => {
    const response = await api.post<ThreadResponse>('/threads', threadData);
    return response.data;
  },
  
  getThreadById: async (id: number): Promise<ThreadResponse> => {
    const response = await api.get<ThreadResponse>(`/threads/${id}`);
    return response.data;
  }
};

export default threadService;
