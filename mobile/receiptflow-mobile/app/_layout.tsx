import { useEffect } from 'react';
import { isAxiosError } from 'axios';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Slot, useRouter, useSegments } from 'expo-router';
import { authApi } from '@/api/auth';
import { authStorage } from '@/lib/auth-storage';
import { useAuthStore } from '@/store/auth.store';

export default function RootLayout() {
  const { isAuthenticated, isLoading, restoreSession, clearSession } =
    useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    let isActive = true;

    const initAuth = async () => {
      const storedToken = await authStorage.getToken();
      const storedSessionActive = await authStorage.getSessionActive();

      if (!storedToken && !storedSessionActive) {
        if (isActive) {
          useAuthStore.setState({
            token: null,
            user: null,
            sessionActive: false,
            isAuthenticated: false,
            isLoading: false,
          });
        }

        return;
      }

      try {
        const user = await authApi.getMe();

        if (!isActive) {
          return;
        }

        restoreSession(storedToken, user);
      } catch (error) {
        console.warn('[auth] session restore failed', error);

        if (isAxiosError(error) && error.response?.status === 401) {
          if (isActive) {
            await clearSession();
          }

          return;
        }

        if (isActive) {
          restoreSession(storedToken, null);
          return;
        }
      }
    };

    void initAuth();

    return () => {
      isActive = false;
    };
  }, [clearSession, restoreSession]);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/login');
      return;
    }

    if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)/home');
    }
  }, [isAuthenticated, isLoading, router, segments]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return <Slot />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0a0f1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
