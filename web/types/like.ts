export interface Like {
  id?: string;
  userId: string;
  targetId: string;
  targetType: "video" | "tweet";
  createdAt: string;
}

export interface CreateLikeInput {
  targetId: string;
  targetType: "video" | "tweet";
}

export interface LikeResponse {
  success: boolean;
  data?: Like | Like[];
  message?: string;
  error?: string;
}
