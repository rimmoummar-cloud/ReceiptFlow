namespace ReceiptFlow.Api.DTOs.Analytics;

public class MonthlyAnalyticsDto
{
    public string Month { get; set; } = string.Empty;
    public decimal Total { get; set; }
}