// Together / Community Post Types

export interface ICommunityPost {
  id: number;
  authorName: string;
  authorCode: string;
  phone: string;
  courtId: number;
  date: string;
  startTime: string;
  endTime: string;
  maxPlayers: number;
  currentPlayers: number;
  level: string;
  caption: string;
  hashtags: string[];
  postedAt: string;
  isFull: boolean;
  courtFee: number;
  createdAt: string;
  updatedAt: string;
}

export interface CommunityPostAddPayload {
  authorName: string;
  authorCode: string;
  phone: string;
  courtId: number;
  date: string;
  startTime: string;
  endTime: string;
  maxPlayers: number;
  level: string;
  caption: string;
  hashtags: string[];
}

export interface CommunityPostEditPayload extends Partial<CommunityPostAddPayload> {
  // Allow partial updates
}
