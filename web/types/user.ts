export interface User {
  id: string;
  fullname: string;
  username: string;
  email: string;
  avatar?: string;
  coverImage?: string;
  refreshToken?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateAccountDetailsInput {
  fullname?: string;
  email?: string;
  username?: string;
}

export interface UserProfileResponse {
  success: boolean;
  data?: {
    user: User;
    stats?: {
      totalVideos: number;
      totalSubscribers: number;
      totalSubscriptions: number;
      totalViews: number;
      totalLikes: number;
      totalComments: number;
    };
  };
  message?: string;
  error?: string;
}
