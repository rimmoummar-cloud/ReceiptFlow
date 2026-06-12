namespace ReceiptFlow.Api.DTOs.Analytics;

public class AlertDto
{
    public bool IsOverLimit { get; set; }
    public decimal Limit { get; set; }
    public decimal Current { get; set; }
    public string Message { get; set; } = string.Empty;
}