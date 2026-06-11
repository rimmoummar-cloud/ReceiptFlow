namespace ReceiptFlow.Api.DTOs.Invoice;

public class InvoiceQueryParams
{
    // Pagination
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;

    // Filtering
    public string? Category { get; set; }
    public string? Status { get; set; }

    // Sorting
    public string? Sort { get; set; } = "created_desc";
}