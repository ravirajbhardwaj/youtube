export interface Playlist {
  id: string;
  userId: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  videos?: {
    id: string;
    title: string;
    thumbnail: string;
    duration: number;
  }[];
  videoCount?: number;
}

export interface CreatePlaylistInput {
  name: string;
  description?: string;
}

export interface UpdatePlaylistInput {
  name?: string;
  description?: string;
}

export interface SearchPlaylistsInput {
  query?: string;
  page?: number;
  limit?: number;
  sortBy?: "name" | "createdAt" | "videoCount";
  sortOrder?: "asc" | "desc";
  userId?: string;
}

export interface PlaylistResponse {
  success: boolean;
  data?: Playlist | Playlist[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  message?: string;
  error?: string;
}
