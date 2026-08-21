import api from './api';
import type { SpaceResponse } from '../types/space.types';

const spaceService = {
  getAllSpaces: async (): Promise<SpaceResponse[]> => {
    const response = await api.get<SpaceResponse[]>('/spaces');
    return response.data;
  }
};

export default spaceService;
