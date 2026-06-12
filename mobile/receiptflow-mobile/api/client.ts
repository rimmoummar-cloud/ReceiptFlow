import axios, { type InternalAxiosRequestConfig } from 'axios';
import { authStorage } from '../lib/auth-storage';
import { resolveApiBaseUrl } from '../lib/api-config';
import {
  attachRequestMetadata,
  logApiError,
  logApiRequest,
  logApiResponse,
} from '../lib/api-logger';

let requestCounter = 0;
console.log('API URL =', `${resolveApiBaseUrl()}/api`);

// export const apiClient = axios.create({
//   baseURL: `${resolveApiBaseUrl()}/api`,
//   withCredentials: true,
//   timeout: 15000,
//   // headers: {
//   //   'Content-Type': 'application/json',
//   // },
// });
export const apiClient = axios.create({
  baseURL: `${resolveApiBaseUrl()}/api`,
  withCredentials: true,
  timeout: 15000,
});
apiClient.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const requestId = ++requestCounter;
  const loggedConfig = attachRequestMetadata(config, requestId);
  const token = await authStorage.getToken();
  if (token) {
    if (typeof loggedConfig.headers?.set === 'function') {
      loggedConfig.headers.set('Authorization', `Bearer ${token}`);
    } else {
      loggedConfig.headers = {
        ...loggedConfig.headers,
        Authorization: `Bearer ${token}`,
      };
    }
  }

  logApiRequest(loggedConfig);
  return loggedConfig;
});

apiClient.interceptors.response.use(
  (response) => {
    logApiResponse(response);
    return response;
  },
  (error) => {
    logApiError(error);
return Promise.reject(error);
  }
);
