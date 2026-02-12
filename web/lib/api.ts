import { RegisterInput, LoginInput } from "../types/auth";
import {
  CreateVideoInput,
  UpdateVideoInput,
  SearchVideosInput,
} from "../types/video";
import { CreateCommentInput, UpdateCommentInput } from "../types/comment";
import {
  CreatePlaylistInput,
  UpdatePlaylistInput,
  SearchPlaylistsInput,
} from "../types/playlist";
import {
  CreateTweetInput,
  UpdateTweetInput,
  SearchTweetsInput,
} from "../types/tweet";
import { CreateLikeInput } from "../types/like";
import { CreateSubscriptionInput } from "../types/subscription";
import { UpdateAccountDetailsInput } from "../types/user";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

const fetchWithAuth = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const token = localStorage.getItem("accessToken");
  const headers = new Headers(options.headers || {});

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Handle token refresh or logout
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "/signin";
    throw new Error("Unauthorized");
  }

  return response;
};

// Auth APIs
export const authAPI = {
  login: async (data: LoginInput) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  register: async (data: RegisterInput) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value) {
        formData.append(key, value instanceof File ? value : String(value));
      }
    });

    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      body: formData,
    });
    return response.json();
  },

  refreshToken: async (refreshToken: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    return response.json();
  },
};

// User APIs
export const userAPI = {
  getProfile: async (userId?: string) => {
    const url = userId
      ? `${API_BASE_URL}/user/profile/${userId}`
      : `${API_BASE_URL}/user/profile`;
    const response = await fetchWithAuth(url);
    return response.json();
  },

  updateProfile: async (data: UpdateAccountDetailsInput) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/user/update`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  uploadAvatar: async (file: File) => {
    const formData = new FormData();
    formData.append("avatar", file);

    const response = await fetchWithAuth(`${API_BASE_URL}/user/avatar`, {
      method: "PUT",
      body: formData,
    });
    return response.json();
  },

  uploadCoverImage: async (file: File) => {
    const formData = new FormData();
    formData.append("coverImage", file);

    const response = await fetchWithAuth(`${API_BASE_URL}/user/cover-image`, {
      method: "PUT",
      body: formData,
    });
    return response.json();
  },
};

// Video APIs
export const videoAPI = {
  create: async (
    data: CreateVideoInput & { videoFile: File; thumbnail?: File },
  ) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value) {
        formData.append(key, value instanceof File ? value : String(value));
      }
    });

    const response = await fetchWithAuth(`${API_BASE_URL}/videos`, {
      method: "POST",
      body: formData,
    });
    return response.json();
  },

  update: async (videoId: string, data: UpdateVideoInput) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/videos/${videoId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  getById: async (videoId: string) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/videos/${videoId}`);
    return response.json();
  },

  delete: async (videoId: string) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/videos/${videoId}`, {
      method: "DELETE",
    });
    return response.json();
  },

  search: async (params: SearchVideosInput) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });

    const response = await fetchWithAuth(
      `${API_BASE_URL}/videos?${searchParams}`,
    );
    return response.json();
  },

  getByUser: async (userId: string, params?: SearchVideosInput) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
    }

    const response = await fetchWithAuth(
      `${API_BASE_URL}/videos?userId=${userId}${params ? `&${searchParams}` : ""}`,
    );
    return response.json();
  },

  incrementViewCount: async (videoId: string) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/videos/${videoId}`, {
      method: "GET",
    });
    return response.json();
  },
};

// Comment APIs
export const commentAPI = {
  create: async (data: CreateCommentInput) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/comment/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  update: async (commentId: string, data: UpdateCommentInput) => {
    const response = await fetchWithAuth(
      `${API_BASE_URL}/comment/update/${commentId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      },
    );
    return response.json();
  },

  delete: async (commentId: string) => {
    const response = await fetchWithAuth(
      `${API_BASE_URL}/comment/delete/${commentId}`,
      {
        method: "DELETE",
      },
    );
    return response.json();
  },

  getByVideo: async (videoId: string) => {
    const response = await fetchWithAuth(
      `${API_BASE_URL}/comment/video/${videoId}`,
    );
    return response.json();
  },

  getReplies: async (commentId: string) => {
    const response = await fetchWithAuth(
      `${API_BASE_URL}/comment/replies/${commentId}`,
    );
    return response.json();
  },
};

// Playlist APIs
export const playlistAPI = {
  create: async (data: CreatePlaylistInput) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/playlist/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  update: async (playlistId: string, data: UpdatePlaylistInput) => {
    const response = await fetchWithAuth(
      `${API_BASE_URL}/playlist/update/${playlistId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      },
    );
    return response.json();
  },

  delete: async (playlistId: string) => {
    const response = await fetchWithAuth(
      `${API_BASE_URL}/playlist/delete/${playlistId}`,
      {
        method: "DELETE",
      },
    );
    return response.json();
  },

  getById: async (playlistId: string) => {
    const response = await fetchWithAuth(
      `${API_BASE_URL}/playlist/${playlistId}`,
    );
    return response.json();
  },

  getByUser: async (userId: string, params?: SearchPlaylistsInput) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
    }

    const response = await fetchWithAuth(
      `${API_BASE_URL}/playlist/user/${userId}?${searchParams}`,
    );
    return response.json();
  },

  addVideo: async (playlistId: string, videoId: string) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/playlist/add-video`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playlistId, videoId }),
    });
    return response.json();
  },

  removeVideo: async (playlistId: string, videoId: string) => {
    const response = await fetchWithAuth(
      `${API_BASE_URL}/playlist/remove-video`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playlistId, videoId }),
      },
    );
    return response.json();
  },
};

// Tweet APIs
export const tweetAPI = {
  create: async (data: CreateTweetInput) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/tweet/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  update: async (tweetId: string, data: UpdateTweetInput) => {
    const response = await fetchWithAuth(
      `${API_BASE_URL}/tweet/update/${tweetId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      },
    );
    return response.json();
  },

  delete: async (tweetId: string) => {
    const response = await fetchWithAuth(
      `${API_BASE_URL}/tweet/delete/${tweetId}`,
      {
        method: "DELETE",
      },
    );
    return response.json();
  },

  getById: async (tweetId: string) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/tweet/${tweetId}`);
    return response.json();
  },

  search: async (params: SearchTweetsInput) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });

    const response = await fetchWithAuth(
      `${API_BASE_URL}/tweet/search?${searchParams}`,
    );
    return response.json();
  },

  getByUser: async (userId: string, params?: SearchTweetsInput) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
    }

    const response = await fetchWithAuth(
      `${API_BASE_URL}/tweet/user/${userId}?${searchParams}`,
    );
    return response.json();
  },
};

// Like APIs
export const likeAPI = {
  create: async (data: CreateLikeInput) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/like/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  delete: async (likeId: string) => {
    const response = await fetchWithAuth(
      `${API_BASE_URL}/like/delete/${likeId}`,
      {
        method: "DELETE",
      },
    );
    return response.json();
  },

  getByUser: async (userId: string) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/like/user/${userId}`);
    return response.json();
  },

  getByVideo: async (videoId: string) => {
    const response = await fetchWithAuth(
      `${API_BASE_URL}/like/video/${videoId}`,
    );
    return response.json();
  },

  getByTweet: async (tweetId: string) => {
    const response = await fetchWithAuth(
      `${API_BASE_URL}/like/tweet/${tweetId}`,
    );
    return response.json();
  },
};

// Subscription APIs
export const subscriptionAPI = {
  create: async (data: CreateSubscriptionInput) => {
    const response = await fetchWithAuth(
      `${API_BASE_URL}/subscription/create`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      },
    );
    return response.json();
  },

  delete: async (subscriptionId: string) => {
    const response = await fetchWithAuth(
      `${API_BASE_URL}/subscription/delete/${subscriptionId}`,
      {
        method: "DELETE",
      },
    );
    return response.json();
  },

  getSubscriptions: async (userId: string) => {
    const response = await fetchWithAuth(
      `${API_BASE_URL}/subscription/subscriptions/${userId}`,
    );
    return response.json();
  },

  getSubscribers: async (channelId: string) => {
    const response = await fetchWithAuth(
      `${API_BASE_URL}/subscription/subscribers/${channelId}`,
    );
    return response.json();
  },

  isSubscribed: async (subscriberId: string, channelId: string) => {
    const response = await fetchWithAuth(
      `${API_BASE_URL}/subscription/is-subscribed?subscriberId=${subscriberId}&channelId=${channelId}`,
    );
    return response.json();
  },
};

// Dashboard APIs
export const dashboardAPI = {
  getStats: async () => {
    const response = await fetchWithAuth(`${API_BASE_URL}/dashboard/stats`);
    return response.json();
  },

  getRecentVideos: async () => {
    const response = await fetchWithAuth(
      `${API_BASE_URL}/dashboard/recent-videos`,
    );
    return response.json();
  },

  getTrendingVideos: async () => {
    const response = await fetchWithAuth(
      `${API_BASE_URL}/dashboard/trending-videos`,
    );
    return response.json();
  },
};
