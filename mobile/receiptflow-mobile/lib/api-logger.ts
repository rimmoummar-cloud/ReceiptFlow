import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

type LoggedConfig = AxiosRequestConfig & {
  metadata?: {
    requestId: number;
    startedAt: number;
  };
};

const buildUrl = (config: AxiosRequestConfig) => {
  const url = config.url ?? '';
  const baseURL = config.baseURL ?? '';

  try {
    return new URL(url, baseURL).toString();
  } catch {
    return `${baseURL}${url}`;
  }
};

export const logApiRequest = (config: AxiosRequestConfig) => {
  if (!__DEV__) {
    return;
  }

  const loggedConfig = config as LoggedConfig;
  const method = (config.method ?? 'GET').toUpperCase();
  const requestId = loggedConfig.metadata?.requestId ?? 0;

  console.log(`[api][${requestId}] request ${method} ${buildUrl(config)}`);
};

export const logApiResponse = (response: AxiosResponse) => {
  if (!__DEV__) {
    return;
  }

  const config = response.config as LoggedConfig;
  const requestId = config.metadata?.requestId ?? 0;
  const method = (response.config.method ?? 'GET').toUpperCase();
  const duration = config.metadata ? Date.now() - config.metadata.startedAt : undefined;
  const durationText = typeof duration === 'number' ? ` (${duration}ms)` : '';

  console.log(
    `[api][${requestId}] response ${response.status} ${method} ${buildUrl(response.config)}${durationText}`
  );
};

export const logApiError = (error: AxiosError) => {
  if (!__DEV__) {
    return;
  }

  const config = error.config as LoggedConfig | undefined;
  const requestId = config?.metadata?.requestId ?? 0;
  const method = (config?.method ?? 'GET').toUpperCase();
  const url = config ? buildUrl(config) : '[unknown url]';
  const duration = config?.metadata ? Date.now() - config.metadata.startedAt : undefined;
  const durationText = typeof duration === 'number' ? ` (${duration}ms)` : '';
  const statusText = error.response?.status ? `status ${error.response.status}` : 'no response';
  const messageText = error.message ? `message: ${error.message}` : 'message unavailable';

  console.warn(
    `[api][${requestId}] error ${method} ${url}${durationText} - ${statusText} - ${messageText}`
  );
};

export const attachRequestMetadata = (config: AxiosRequestConfig, requestId: number) => {
  const loggedConfig = config as LoggedConfig;
  loggedConfig.metadata = {
    requestId,
    startedAt: Date.now(),
  };
  return loggedConfig;
};
