"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User } from "../types/user";
import { authAPI } from "../lib/api";
import { LoginInput, RegisterInput } from "../types/auth";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (
    credentials: LoginInput,
  ) => Promise<{ success: boolean; message: string }>;
  register: (
    data: RegisterInput,
  ) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  refreshToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    const initAuth = async () => {
      const accessToken = localStorage.getItem("accessToken");

      if (accessToken) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1"}/auth/current-user`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            if (data.success && data.data?.user) {
              setUser(data.data.user);
            }
          } else if (response.status === 401) {
            // Token expired, try to refresh
            const refreshed = await refreshToken();
            if (!refreshed) {
              localStorage.removeItem("accessToken");
              localStorage.removeItem("refreshToken");
            }
          }
        } catch (error) {
          console.error("Auth init error:", error);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginInput) => {
    try {
      const response = await authAPI.login(credentials);

      if (response.success && response.data) {
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        setUser(response.data.user);
        return { success: true, message: response.message };
      }

      return { success: false, message: response.error || "Login failed" };
    } catch (error) {
      return { success: false, message: "Login failed" };
    }
  };

  const register = async (data: RegisterInput) => {
    try {
      const response = await authAPI.register(data);

      if (response.success && response.data) {
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        setUser(response.data.user);
        return { success: true, message: response.message };
      }

      return {
        success: false,
        message: response.error || "Registration failed",
      };
    } catch (error) {
      return { success: false, message: "Registration failed" };
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
  };

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      logout();
      return false;
    }

    try {
      const response = await authAPI.refreshToken(refreshToken);
      if (response.success && response.data) {
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        setUser(response.data.user);
        return true;
      } else {
        logout();
        return false;
      }
    } catch (error) {
      logout();
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
