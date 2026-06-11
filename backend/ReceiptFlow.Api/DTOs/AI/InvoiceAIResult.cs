namespace ReceiptFlow.Api.DTOs.AI;

// public class InvoiceAIResult
// {
//     public string Merchant { get; set; }
//     public decimal Amount { get; set; }
//     public string Category { get; set; }
//     public string InvoiceDate { get; set; }
// }
public class InvoiceAIResult
{
    public string Merchant { get; set; }
    public decimal Amount { get; set; }
    public string Category { get; set; }
    public DateTime InvoiceDate { get; set; }
}