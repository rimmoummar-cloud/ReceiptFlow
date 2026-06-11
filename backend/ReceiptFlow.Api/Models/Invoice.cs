namespace ReceiptFlow.Api.Models;

public class Invoice
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }

    public User User { get; set; } = null!;

    public string Merchant { get; set; } = string.Empty;

    public decimal Amount { get; set; }

    public DateTime InvoiceDate { get; set; }

    public string? ImageUrl { get; set; }

    public string Category { get; set; } = "Other";

  public string Status { get; set; } = "Processed";

public string? Notes { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
  
}

