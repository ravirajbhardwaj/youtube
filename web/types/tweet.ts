export interface Tweet {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    username: string;
    fullname: string;
    avatar?: string;
  };
  likeCount?: number;
}

export interface CreateTweetInput {
  content: string;
}

export interface UpdateTweetInput {
  content: string;
}

export interface SearchTweetsInput {
  query?: string;
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "likeCount";
  sortOrder?: "asc" | "desc";
  userId?: string;
}

export interface TweetResponse {
  success: boolean;
  data?: Tweet | Tweet[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  message?: string;
  error?: string;
}
