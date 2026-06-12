import Constants from 'expo-constants';
import { Platform } from 'react-native';

const DEFAULT_ANDROID_BASE_URL = 'http://10.0.2.2:5000';
const DEFAULT_NATIVE_BASE_URL = 'http://localhost:5000';
const DEFAULT_API_PORT = 5000;

const normalizeBaseUrl = (value: string) => {
  const trimmed = value.trim();

  if (!trimmed) {
    return '';
  }

  if (/^[a-z][a-z\d+\-.]*:\/\//i.test(trimmed)) {
    return trimmed.replace(/\/+$/, '');
  }

  return `http://${trimmed.replace(/\/+$/, '')}`;
};

const resolveHostFromExpo = () => {
  const hostUri = Constants.expoConfig?.hostUri?.trim();
  if (!hostUri) {
    return null;
  }

  const normalizedHost = hostUri.startsWith('http')
    ? hostUri
    : `http://${hostUri}`;

  try {
    return new URL(normalizedHost).hostname;
  } catch {
    return null;
  }
};

const buildHostBaseUrl = (hostname: string, port: number) => {
  return `http://${hostname}:${port}`;
};

export const resolveApiBaseUrl = () => {
  return 'https://receiptflow-1.onrender.com';
  const envBaseUrl =
    process.env.EXPO_PUBLIC_API_BASE_URL ??
    process.env.EXPO_PUBLIC_API_URL ??
    '';
  const envPort =
    process.env.EXPO_PUBLIC_API_PORT ??
    process.env.EXPO_PUBLIC_API_BACKEND_PORT ??
    '';

  const normalizedEnvUrl = normalizeBaseUrl(envBaseUrl);
  if (normalizedEnvUrl) {
    return normalizedEnvUrl;
  }

  const resolvedPort = Number.parseInt(envPort, 10);
  const backendPort = Number.isFinite(resolvedPort) ? resolvedPort : DEFAULT_API_PORT;
  const expoHost = resolveHostFromExpo();

  if (expoHost) {
    return buildHostBaseUrl(expoHost, backendPort);
  }

  if (Platform.OS === 'android') {
    return DEFAULT_ANDROID_BASE_URL;
  }

  if (Platform.OS === 'ios') {
    return DEFAULT_NATIVE_BASE_URL;
  }

  return `http://localhost:${backendPort}`;
};
