import type { AxiosResponse } from 'axios';
import { apiClient } from './client';
import type {
  ApiResponse,
  AuthCredentials,
  AuthSession,
  RegisterCredentials,
  User,
} from '../types';
import { getApiErrorMessage } from '../lib/api-errors';

const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
};

const parseApiEnvelope = <T>(payload: unknown): ApiResponse<T> | null => {
  if (!isPlainObject(payload)) {
    return null;
  }

  if (typeof payload.success !== 'boolean') {
    return null;
  }

  return {
    success: payload.success,
    data: (payload.data as T | null) ?? null,
    error: typeof payload.error === 'string' ? payload.error : null,
  };
};

const normalizeUser = (value: unknown): User | null => {
  if (!isPlainObject(value)) {
    return null;
  }

  const candidate: User = { ...value };

  if (typeof candidate.id === 'number') {
    candidate.id = String(candidate.id);
  }

  if (typeof candidate.id !== 'string') {
    delete candidate.id;
  }

  if (typeof candidate.email !== 'string') {
    delete candidate.email;
  }

  if (typeof candidate.name !== 'string') {
    delete candidate.name;
  }

  return Object.keys(candidate).length > 0 ? candidate : null;
};

const extractTokenFromHeaders = (response: AxiosResponse) => {
  const authorizationHeader =
    response.headers?.authorization ?? response.headers?.Authorization;

  if (typeof authorizationHeader !== 'string') {
    return null;
  }

  if (authorizationHeader.toLowerCase().startsWith('bearer ')) {
    return authorizationHeader.slice(7).trim() || null;
  }

  return authorizationHeader.trim() || null;
};

const extractToken = (payload: unknown, response: AxiosResponse) => {
  if (isPlainObject(payload)) {
    const candidates = [
      payload.token,
      payload.accessToken,
      payload.access_token,
      payload.jwt,
      payload.authToken,
    ];

    for (const candidate of candidates) {
      if (typeof candidate === 'string' && candidate.trim()) {
        return candidate.trim();
      }
    }
  }

  return extractTokenFromHeaders(response);
};

const extractUser = (payload: unknown) => {
  if (!isPlainObject(payload)) {
    return null;
  }

  return (
    normalizeUser(payload.user) ??
    normalizeUser(payload.data) ??
    normalizeUser(payload)
  );
};

const resolveSessionFromResponse = async (
  response: AxiosResponse<unknown>,
  fallbackError: string
): Promise<AuthSession> => {
  const envelope = parseApiEnvelope<unknown>(response.data);

  if (envelope && envelope.success === false) {
    throw new Error(envelope.error ?? fallbackError);
  }

  const payload = envelope?.data ?? response.data;
  const token = extractToken(payload, response);
  const user = extractUser(payload);

  if (token || user) {
    return {
      token: token ?? null,
      user,
      raw: response.data,
    };
  }

  try {
    const restoredUser = await authApi.getMe();
    return {
      token: null,
      user: restoredUser,
      raw: response.data,
    };
  } catch (error) {
    throw new Error(
      getApiErrorMessage(
        error,
        'Authentication succeeded, but the session could not be restored.'
      )
    );
  }
};

export const authApi = {
  login: async (credentials: AuthCredentials): Promise<AuthSession> => {
    const response = await apiClient.post<unknown>('/auth/login', credentials);
    return resolveSessionFromResponse(response, 'Login failed.');
  },
  register: async (details: RegisterCredentials): Promise<AuthSession> => {
    const response = await apiClient.post<unknown>('/auth/register', details);
    return resolveSessionFromResponse(response, 'Registration failed.');
  },
  getMe: async (): Promise<User> => {
    const response = await apiClient.get<unknown>('/auth/me');
    const envelope = parseApiEnvelope<unknown>(response.data);

    if (envelope && envelope.success === false) {
      throw new Error(envelope.error ?? 'Failed to load the current user.');
    }

    const user = extractUser(envelope?.data ?? response.data);
    if (!user) {
      throw new Error('The backend returned an unexpected /auth/me response.');
    }

    return user;
  },
};
