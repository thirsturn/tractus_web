import api from './api';
import type { ThreadResponse } from '../types/thread.types';

const threadService = {
  getThreadsBySpace: async (spaceId: number): Promise<ThreadResponse[]> => {
    const response = await api.get<ThreadResponse[]>(`/threads/space/${spaceId}`);
    return response.data;
  },
};

export default threadService;
