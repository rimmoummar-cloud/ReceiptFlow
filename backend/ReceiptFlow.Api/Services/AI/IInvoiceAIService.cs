using ReceiptFlow.Api.DTOs.AI;
using System.Text.Json;

using System.Net.Http.Json;
namespace ReceiptFlow.Api.Services.AI;
public interface IInvoiceAIService
{
    Task<InvoiceAIResult> ExtractInvoiceAsync(string imagePath);
}

public class InvoiceAIService : IInvoiceAIService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _config;

    public InvoiceAIService(HttpClient httpClient, IConfiguration config)
    {
        _httpClient = httpClient;
        _config = config;
    }

    public async Task<InvoiceAIResult> ExtractInvoiceAsync(string imagePath)
    {
       var apiKey = _config["Gemini:ApiKey"];

        var imageBytes = await File.ReadAllBytesAsync(imagePath);
        var base64 = Convert.ToBase64String(imageBytes);

      var requestBody = new
{
    contents = new[]
    {
        new
        {
            parts = new object[]
            {
                new
                {
                    text =
@"Extract invoice data and return ONLY JSON:

{
  ""merchant"": """",
  ""amount"": 0,
  ""date"": """",
  ""category"": """"
}"
                },
                new
                {
                    inline_data = new
                    {
                        mime_type = "image/jpeg",
                        data = base64
                    }
                }
            }
        }
    }
};
Console.WriteLine("API KEY = " + apiKey);
var request = new HttpRequestMessage(
    HttpMethod.Post,
    $"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={apiKey}"
);
       
        request.Content = JsonContent.Create(requestBody);


Console.WriteLine("BEFORE GEMINI");

var response = await _httpClient.SendAsync(request);

Console.WriteLine("AFTER GEMINI");

        // var response = await _httpClient.SendAsync(request);
        var jsonString = await response.Content.ReadAsStringAsync();
      
Console.WriteLine(jsonString);

        // هنا بدك parse response (رح أبسطها لك)
//       return new InvoiceAIResult
// {
//     Merchant = "TEMP",
//     Amount = 0,
//     Category = "TEMP",
//     InvoiceDate = DateTime.UtcNow
// };
var root = JsonDocument.Parse(jsonString);

var text = root
    .RootElement
    .GetProperty("candidates")[0]
    .GetProperty("content")
    .GetProperty("parts")[0]
    .GetProperty("text")
    .GetString();
    
Console.WriteLine("RAW TEXT:");
Console.WriteLine(text);


var cleaned = text
    .Replace("```json", "")
    .Replace("```", "")
    .Trim();

var invoiceJson = JsonDocument.Parse(cleaned);
Console.WriteLine("====== CLEANED AI JSON ======");
Console.WriteLine(cleaned);
Console.WriteLine("=============================");
return new InvoiceAIResult
{
    Merchant = invoiceJson.RootElement
        .GetProperty("merchant")
        .GetString(),

    Amount = invoiceJson.RootElement
        .GetProperty("amount")
        .GetDecimal(),

    Category = invoiceJson.RootElement
        .GetProperty("category")
        .GetString(),

    InvoiceDate = DateTime.Parse(
        invoiceJson.RootElement
            .GetProperty("date")
            .GetString()
    )
};


    }
}