namespace ReceiptFlow.Api.DTOs.Invoice;

public class UpdateInvoiceDto
{
    public string Merchant { get; set; } = string.Empty;

    public decimal Amount { get; set; }

    public DateTime InvoiceDate { get; set; }

    public string Category { get; set; } = "Other";

    public string Status { get; set; } = "Processed";

    public string? Notes { get; set; }
}