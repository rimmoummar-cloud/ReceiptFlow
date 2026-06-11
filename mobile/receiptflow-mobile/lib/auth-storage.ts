import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const AUTH_TOKEN_KEY = 'auth_token';
const AUTH_SESSION_KEY = 'auth_session_active';

const canUseWebStorage = Platform.OS === 'web' && typeof window !== 'undefined';

const setWebValue = (key: string, value: string) => {
  window.localStorage.setItem(key, value);
};

const getWebValue = (key: string) => {
  return window.localStorage.getItem(key);
};

const removeWebValue = (key: string) => {
  window.localStorage.removeItem(key);
};

export const authStorage = {
  getToken: async () => {
    try {
      if (canUseWebStorage) {
        return getWebValue(AUTH_TOKEN_KEY);
      }

      return await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
    } catch {
      return null;
    }
  },
  setToken: async (token: string) => {
    try {
      if (canUseWebStorage) {
        setWebValue(AUTH_TOKEN_KEY, token);
        return;
      }

      await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
    } catch {
      return;
    }
  },
  clearToken: async () => {
    try {
      if (canUseWebStorage) {
        removeWebValue(AUTH_TOKEN_KEY);
        return;
      }

      await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
    } catch {
      return;
    }
  },
  getSessionActive: async () => {
    try {
      if (canUseWebStorage) {
        return getWebValue(AUTH_SESSION_KEY) === '1';
      }

      return (await SecureStore.getItemAsync(AUTH_SESSION_KEY)) === '1';
    } catch {
      return false;
    }
  },
  setSessionActive: async (active: boolean) => {
    try {
      if (canUseWebStorage) {
        if (active) {
          setWebValue(AUTH_SESSION_KEY, '1');
        } else {
          removeWebValue(AUTH_SESSION_KEY);
        }
        return;
      }

      if (active) {
        await SecureStore.setItemAsync(AUTH_SESSION_KEY, '1');
      } else {
        await SecureStore.deleteItemAsync(AUTH_SESSION_KEY);
      }
    } catch {
      return;
    }
  },
  clearSession: async () => {
    try {
      if (canUseWebStorage) {
        removeWebValue(AUTH_TOKEN_KEY);
        removeWebValue(AUTH_SESSION_KEY);
        return;
      }

      await Promise.all([
        SecureStore.deleteItemAsync(AUTH_TOKEN_KEY),
        SecureStore.deleteItemAsync(AUTH_SESSION_KEY),
      ]);
    } catch {
      return;
    }
  },
};
