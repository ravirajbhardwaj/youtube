export interface RegisterInput {
  username: string;
  fullname: string;
  email: string;
  password: string;
  avatar?: File;
  coverImage?: File;
}

export interface LoginInput {
  username: string;
  password: string;
}

export interface RefreshTokenInput {
  refreshToken: string;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

export interface ForgotPasswordInput {
  email: string;
}

export interface ResetPasswordInput {
  newPassword: string;
}

import { User } from "./user";

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
  error?: string;
}
