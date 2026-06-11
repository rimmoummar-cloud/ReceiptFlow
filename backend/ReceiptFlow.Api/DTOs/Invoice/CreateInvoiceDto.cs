namespace ReceiptFlow.Api.DTOs.Invoice;

public class CreateInvoiceDto
{
    public string Merchant { get; set; } = string.Empty;

    public decimal Amount { get; set; }

    // public DateTime InvoiceDate { get; set; }
public DateTime InvoiceDate { get; set; } = DateTime.UtcNow;

    public string? ImageUrl { get; set; }

    public string Category { get; set; } = "Other";

    public string? Notes { get; set; }
}
