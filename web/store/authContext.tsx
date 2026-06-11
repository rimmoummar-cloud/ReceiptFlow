"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { authService } from "@/services/authService";

const ACCESS_TOKEN_KEY = "access_token";

interface User {
  email: string;
  fullName?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

type AuthStateActions = {
  setUser: (user: User | null) => void;
  setIsAuthenticated: (value: boolean) => void;
  setIsLoading: (value: boolean) => void;
};

const getStoredToken = () => {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

const setStoredToken = (token: string) => {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(ACCESS_TOKEN_KEY, token);
};

const clearStoredToken = () => {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(ACCESS_TOKEN_KEY);
};

const checkAuth = async ({
  setUser,
  setIsAuthenticated,
  setIsLoading,
}: AuthStateActions) => {
  if (typeof window === "undefined") {
    setIsLoading(false);
    return null;
  }

  const token = getStoredToken();
  if (!token) {
    setUser(null);
    setIsAuthenticated(false);
    setIsLoading(false);
    return null;
  }

  try {
    const currentUser = await authService.me();
    setUser(currentUser);
    setIsAuthenticated(true);
    return currentUser;
  } catch {
    clearStoredToken();
    setUser(null);
    setIsAuthenticated(false);
    return null;
  } finally {
    setIsLoading(false);
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    void checkAuth({
      setUser,
      setIsAuthenticated,
      setIsLoading,
    });
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const token = await authService.login({ email, password });
      setStoredToken(token);
      await checkAuth({
        setUser,
        setIsAuthenticated,
        setIsLoading,
      });
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      const token = await authService.register({ email, password, name });
      setStoredToken(token);
      await checkAuth({
        setUser,
        setIsAuthenticated,
        setIsLoading,
      });
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const logout = () => {
    clearStoredToken();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
