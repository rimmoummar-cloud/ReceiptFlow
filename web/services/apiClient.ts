import axios, { InternalAxiosRequestConfig } from "axios";
import toast from "react-hot-toast";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5241/api";

const ACCESS_TOKEN_KEY = "access_token";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);

    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
   const message =
  error.response?.data?.error ||
  error.response?.data?.Error ||
  error.response?.data?.message ||
  "Something went wrong";
    toast.error(message);

    if (error.response?.status === 401) {
      return Promise.reject({
        type: "AUTH_INVALID",
        message: "Email or password is incorrect",
      });
    }

   return Promise.resolve(error.response);
  }
);

export default apiClient;
