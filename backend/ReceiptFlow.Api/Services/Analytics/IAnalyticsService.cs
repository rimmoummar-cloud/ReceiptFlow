using ReceiptFlow.Api.DTOs.Analytics;

public interface IAnalyticsService
{
    Task<AnalyticsResponseDto> GetUserAnalytics(decimal monthlyLimit);
}