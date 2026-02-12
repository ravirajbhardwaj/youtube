export interface Video {
  id: string;
  userId: string;
  videoFile: string;
  thumbnail: string;
  title: string;
  description?: string;
  duration: number;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  isPublished: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  owner?: {
    id: string;
    username: string;
    fullname: string;
    avatar?: string;
  };
}

export interface CreateVideoInput {
  title: string;
  description?: string;
  thumbnail?: string | File;
  duration: number;
  isPublished?: boolean;
  videoFile?: File;
}

export interface UpdateVideoInput {
  title?: string;
  description?: string;
  thumbnail?: string;
  duration?: number;
  isPublished?: boolean;
}

export interface SearchVideosInput {
  query?: string;
  page?: number;
  limit?: number;
  sortBy?: "title" | "createdAt" | "viewCount" | "likeCount";
  sortOrder?: "asc" | "desc";
  category?: string;
  userId?: string;
}

export interface VideoResponse {
  success: boolean;
  data?: Video | Video[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  message?: string;
  error?: string;
}
