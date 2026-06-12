import apiClient from './apiClient';

export const analyticsService = {
  async getAnalytics(monthlyLimit: number = 1000) {
    const response = await apiClient.get(
      `/analytics?monthlyLimit=${monthlyLimit}`
    );
    return response.data;
  },
};