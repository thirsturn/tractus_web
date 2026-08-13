export type VoteType = 'UP' | 'DOWN';

export interface VoteRequest {
  userId: number;
  targetId: number;
  voteType: VoteType;
}

export interface VoteResponse {
  id: number;
  userId: number;
  targetId: number;
  voteType: VoteType;
}
