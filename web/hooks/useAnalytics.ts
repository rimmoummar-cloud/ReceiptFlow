import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '@/services/analyticsService';

export const useAnalytics = (monthlyLimit: number = 1000) => {
  return useQuery({
    queryKey: ['analytics', monthlyLimit],
    queryFn: () => analyticsService.getAnalytics(monthlyLimit),
  });
};