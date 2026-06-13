import { create } from 'zustand';
import { authStorage } from '../lib/auth-storage';
import type { AuthSession, User } from '../types';

interface AuthState {
  token: string | null;
  user: User | null;
  sessionActive: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (session: AuthSession) => Promise<void>;
  restoreSession: (token: string | null, user: User | null) => void;
  clearSession: () => Promise<void>;
  logout: () => Promise<void>;
  setLoading: (loading: boolean) => void;
}

const applySession = (
  set: (partial: Partial<AuthState>) => void,
  token: string | null,
  user: User | null,
  sessionActive: boolean
) => {
  set({
    token,
    user,
    sessionActive,
isAuthenticated: Boolean(token),
    isLoading: false,
  });
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  sessionActive: false,
  isAuthenticated: false,
  isLoading: true,
  // setAuth: async ({ token, user }) => {
  //   await authStorage.setSessionActive(true);

  //   if (token) {
  //     await authStorage.setToken(token);
  //   } else {
  //     await authStorage.clearToken();
  //   }

  //   applySession(set, token, user, true);
  // },

setAuth: async (session) => {
  if (!session) {
    return;
  }

  const { token, user } = session;

  await authStorage.setSessionActive(true);

  if (token) {
    await authStorage.setToken(token);
  } else {
    await authStorage.clearToken();
  }

  set({
    token,
    user,
    sessionActive: true,
 isAuthenticated: Boolean(token),
    isLoading: false,
  });
},


  restoreSession: (token, user) => {
    applySession(set, token, user, true);
  },
  clearSession: async () => {
    await authStorage.clearSession();
    set({
      token: null,
      user: null,
      sessionActive: false,
      isAuthenticated: false,
      isLoading: false,
    });
  },
  logout: async () => {
    await authStorage.clearSession();
    set({
      token: null,
      user: null,
      sessionActive: false,
      isAuthenticated: false,
      isLoading: false,
    });
  },
  setLoading: (loading) => {
    set({ isLoading: loading });
  },
}));
