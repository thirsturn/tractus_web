import api from './api';
import type { VoteRequest, VoteResponse } from '../types/vote.types';

const voteService = {
  castThreadVote: async (data: VoteRequest): Promise<VoteResponse> => {
    const response = await api.post<VoteResponse>('/thread-votes', data);
    return response.data;
  },
  
  getThreadVotes: async (threadId: number): Promise<VoteResponse[]> => {
    const response = await api.get<VoteResponse[]>(`/thread-votes/thread/${threadId}`);
    return response.data;
  },

  castCommentVote: async (data: VoteRequest): Promise<VoteResponse> => {
    const response = await api.post<VoteResponse>('/comment-votes', data);
    return response.data;
  },
  
  getCommentVotes: async (commentId: number): Promise<VoteResponse[]> => {
    const response = await api.get<VoteResponse[]>(`/comment-votes/comment/${commentId}`);
    return response.data;
  }
};

export default voteService;
