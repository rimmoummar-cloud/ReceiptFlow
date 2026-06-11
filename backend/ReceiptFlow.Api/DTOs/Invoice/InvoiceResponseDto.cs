namespace ReceiptFlow.Api.DTOs.Invoice;

public class InvoiceResponseDto
{
    public Guid Id { get; set; }

    public string Merchant { get; set; } = string.Empty;

    public decimal Amount { get; set; }

    public DateTime InvoiceDate { get; set; }

    public string? ImageUrl { get; set; }

    public string Category { get; set; } = string.Empty;

    public string Status { get; set; } = string.Empty;

    public string? Notes { get; set; }

    public DateTime CreatedAt { get; set; }
}