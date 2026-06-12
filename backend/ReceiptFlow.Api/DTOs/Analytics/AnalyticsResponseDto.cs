namespace ReceiptFlow.Api.DTOs.Analytics;

public class AnalyticsResponseDto
{
    public decimal TotalAmount { get; set; }

    public decimal PaidAmount { get; set; }
    public decimal PendingAmount { get; set; }
    public decimal OverdueAmount { get; set; }

    public List<MonthlyAnalyticsDto> Monthly { get; set; } = new();
    public List<YearlyAnalyticsDto> Yearly { get; set; } = new();
    public List<CategoryAnalyticsDto> ByCategory { get; set; } = new();

    public AlertDto? Alert { get; set; }
}