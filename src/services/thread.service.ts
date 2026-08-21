import api from './api';
import type { ThreadResponse } from '../types/thread.types';

const threadService = {
  getThreadsBySpace: async (spaceId: number): Promise<ThreadResponse[]> => {
    const response = await api.get<ThreadResponse[]>(`/threads/space/${spaceId}`);
    return response.data;
  },

  getThreadById: async (id: number): Promise<ThreadResponse> => {
    const response = await api.get<ThreadResponse>(`/threads/${id}`);
    return response.data;
  },

  getThreadsByUser: async (username: string): Promise<ThreadResponse[]> => {
    const response = await api.get<ThreadResponse[]>(`/threads/user/${username}`);
    return response.data;
  },

  createThread: async (threadData: { title: string; spaceId: number; content?: string; userId: number; image?: File }): Promise<ThreadResponse> => {
    const formData = new FormData();
    formData.append('title', threadData.title);
    formData.append('spaceId', threadData.spaceId.toString());
    formData.append('userId', threadData.userId.toString());
    if (threadData.content) formData.append('content', threadData.content);
    if (threadData.image) formData.append('image', threadData.image);

    const response = await api.post<ThreadResponse>('/threads', formData, {
      transformRequest: [(data, headers) => {
        delete headers['Content-Type'];
        return data;
      }],
    });
    return response.data;
  }
};

export default threadService;
