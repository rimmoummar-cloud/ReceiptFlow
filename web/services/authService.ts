import apiClient from "./apiClient";
import {
  LoginRequest,
  RegisterRequest,
  ApiResponse,
  AuthTokenResponse,
  User,
} from "@/types/auth";

const extractToken = (responseData: ApiResponse<AuthTokenResponse>) => {
  const token = responseData?.data?.token?.trim();

  if (!token) {
    throw new Error("Authentication token was not returned by the server.");
  }

  return token;
};

export const authService = {
  async login(data: LoginRequest) {
    const response = await apiClient.post<ApiResponse<AuthTokenResponse>>(
      "/auth/login",
      data
    );

    return extractToken(response.data);
  },

  async register(data: RegisterRequest) {
    const response = await apiClient.post<ApiResponse<AuthTokenResponse>>(
      "/auth/register",
      data
    );

    return extractToken(response.data);
  },

  async me(): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>("/auth/me");
    const user = response.data?.data;

    if (!user) {
      throw new Error("Unable to load the authenticated user.");
    }

    return user;
  },
};
