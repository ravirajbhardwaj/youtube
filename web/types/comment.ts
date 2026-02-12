export interface Comment {
  id: string;
  userId: string;
  videoId: string;
  parentCommentId?: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    username: string;
    fullname: string;
    avatar?: string;
  };
  replies?: Comment[];
}

export interface CreateCommentInput {
  videoId: string;
  content: string;
  parentCommentId?: string;
}

export interface UpdateCommentInput {
  content: string;
}

export interface CommentResponse {
  success: boolean;
  data?: Comment | Comment[];
  message?: string;
  error?: string;
}
