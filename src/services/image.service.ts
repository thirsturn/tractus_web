import api from './api';

export interface ImageUploadResponse {
  id: string;
  url: string;
}

const imageService = {
  uploadImage: async (file: File): Promise<ImageUploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post<ImageUploadResponse>('/images/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  }
};

export default imageService;
