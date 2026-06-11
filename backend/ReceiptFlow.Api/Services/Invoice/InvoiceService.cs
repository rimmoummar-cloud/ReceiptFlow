using Microsoft.EntityFrameworkCore;
using ReceiptFlow.Api.Data;
using ReceiptFlow.Api.DTOs.Invoice;
using ReceiptFlow.Api.Services.Identity;
using ReceiptFlow.Api.Models;
using ReceiptFlow.Api.DTOs.Common;
using ReceiptFlow.Api.Services.AI;
namespace ReceiptFlow.Api.Services.Invoice;

public class InvoiceService : IInvoiceService
{
    private readonly AppDbContext _context;
    private readonly ICurrentUserService _currentUser;
private readonly IInvoiceAIService _aiService;

public InvoiceService(
    AppDbContext context,
    ICurrentUserService currentUser,
    IInvoiceAIService aiService)
{
    _context = context;
    _currentUser = currentUser;
    _aiService = aiService;
}


    // public InvoiceService(AppDbContext context, ICurrentUserService currentUser)
    // {
    //     _context = context;
    //     _currentUser = currentUser;
    // }

    // ================= CREATE =================
    public async Task<InvoiceResponseDto> Create(CreateInvoiceDto dto)
    {
        var userId = _currentUser.GetUserId();

if (userId == Guid.Empty)
    throw new Exception("INVALID USER ID");

        var invoice = new Models.Invoice
        {
            Id = Guid.NewGuid(),
            UserId = userId,

            Merchant = dto.Merchant,
            Amount = dto.Amount,
InvoiceDate = dto.InvoiceDate.ToUniversalTime(),
            ImageUrl = dto.ImageUrl,
            Category = dto.Category,
            Notes = dto.Notes,

            Status = "Pending",
            CreatedAt = DateTime.UtcNow
        };

        _context.Invoices.Add(invoice);
        await _context.SaveChangesAsync();

        return Map(invoice);
    }

    // ================= GET BY ID (SECURE) =================
    public async Task<InvoiceResponseDto> GetById(Guid id)
    {
        var userId = _currentUser.GetUserId();

        var invoice = await _context.Invoices
            .FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId);

        if (invoice == null)
            throw new KeyNotFoundException("Invoice not found");

        return Map(invoice);
    }

    // ================= GET ALL USER INVOICES =================
public async Task<PagedResult<InvoiceResponseDto>> GetMyInvoices(InvoiceQueryParams query)
{
  var userId = _currentUser.GetUserId();

var invoicesQuery = _context.Invoices
    .Where(x => x.UserId == userId)
    .AsQueryable();

    if (!string.IsNullOrWhiteSpace(query.Category))
    invoicesQuery = invoicesQuery.Where(x => EF.Functions.ILike(x.Category, query.Category));

if (!string.IsNullOrWhiteSpace(query.Status))
    invoicesQuery = invoicesQuery.Where(x => x.Status == query.Status);

    invoicesQuery = query.Sort switch
{
    "amount_desc" => invoicesQuery.OrderByDescending(x => x.Amount),
    "amount_asc" => invoicesQuery.OrderBy(x => x.Amount),
    "created_desc" => invoicesQuery.OrderByDescending(x => x.CreatedAt),
    "created_asc" => invoicesQuery.OrderBy(x => x.CreatedAt),
    _ => invoicesQuery.OrderByDescending(x => x.CreatedAt)
};



var totalCount = await invoicesQuery.CountAsync();




var invoices = await invoicesQuery
    .Select(x => new InvoiceResponseDto
    {
        Id = x.Id,
        Merchant = x.Merchant,
        Amount = x.Amount,
        InvoiceDate = x.InvoiceDate,
        ImageUrl = x.ImageUrl,
        Category = x.Category,
        Status = x.Status,
        Notes = x.Notes,
        CreatedAt = x.CreatedAt
    })
    .Skip((query.Page - 1) * query.PageSize)
    .Take(query.PageSize)
    .ToListAsync();
 


    // var result = invoices.Select(Map).ToList();

 return new PagedResult<InvoiceResponseDto>
{
    Items = invoices,
    TotalCount = totalCount
};
    }






    // ================= UPDATE =================
    public async Task<InvoiceResponseDto> Update(Guid id, UpdateInvoiceDto dto)
    {
        var userId = _currentUser.GetUserId();

        var invoice = await _context.Invoices
            .FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId);

        if (invoice == null)
       throw new Exception("Not found");

        invoice.Merchant = dto.Merchant;
        invoice.Amount = dto.Amount;
        invoice.InvoiceDate = dto.InvoiceDate;
        invoice.Category = dto.Category;
        invoice.Status = dto.Status;
        invoice.Notes = dto.Notes;

        await _context.SaveChangesAsync();

        return Map(invoice);
    }

    // ================= DELETE =================
    public async Task Delete(Guid id)
    {
        var userId = _currentUser.GetUserId();

        var invoice = await _context.Invoices
            .FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId);

        if (invoice == null)
       throw new Exception("Not found");

        _context.Invoices.Remove(invoice);
        await _context.SaveChangesAsync();
    }

    // ================= MAPPER =================
    private static InvoiceResponseDto Map(Models.Invoice invoice)
    {
        return new InvoiceResponseDto
        {
            Id = invoice.Id,
            Merchant = invoice.Merchant,
            Amount = invoice.Amount,
            InvoiceDate = invoice.InvoiceDate,
            ImageUrl = invoice.ImageUrl,
            Category = invoice.Category,
            Status = invoice.Status,
            Notes = invoice.Notes,
            CreatedAt = invoice.CreatedAt
        };
    }

    // ================= UploadAndExtract =================


public async Task<object> UploadAndExtract(IFormFile image)
{
    if (image == null)
        throw new Exception("No image provided");

    var fileName = Guid.NewGuid() + Path.GetExtension(image.FileName);

    var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "uploads");
    Directory.CreateDirectory(uploadsFolder);

    var path = Path.Combine(uploadsFolder, fileName);

    using (var stream = new FileStream(path, FileMode.Create))
    {
        await image.CopyToAsync(stream);
    }

    var userId = _currentUser.GetUserId();

    // 1️⃣ create invoice FIRST
var invoice = new Models.Invoice
{
    UserId = userId,
    ImageUrl = $"/uploads/{fileName}",
    Status = "Processing"
};

    _context.Invoices.Add(invoice);
    await _context.SaveChangesAsync();




try
{
    var ai = await _aiService.ExtractInvoiceAsync(path);
var invoiceToUpdate = await _context.Invoices
    .FirstOrDefaultAsync(x => x.Id == invoice.Id);

if (invoiceToUpdate != null)
{
    invoiceToUpdate.Merchant = ai?.Merchant ?? "Unknown";
    invoiceToUpdate.Amount = ai?.Amount ?? 0;
    invoiceToUpdate.Category = ai?.Category ?? "Other";
 invoiceToUpdate.InvoiceDate =
    ai?.InvoiceDate != default
        ? DateTime.SpecifyKind(ai.InvoiceDate, DateTimeKind.Utc)
        : DateTime.UtcNow;

    invoiceToUpdate.Status = "Processed";
}
}
catch (Exception ex)
{
  var invoiceToUpdate = await _context.Invoices
    .FirstOrDefaultAsync(x => x.Id == invoice.Id);

if (invoiceToUpdate != null)
{
    invoiceToUpdate.Status = "AI_FAILED";
}
}



    await _context.SaveChangesAsync();

    return new
    {
        invoice.Id,
        invoice.Status,
        invoice.ImageUrl
    };
}




}
