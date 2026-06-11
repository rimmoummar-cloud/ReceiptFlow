using ReceiptFlow.Api.DTOs.Invoice;
using ReceiptFlow.Api.DTOs.Common;
using Microsoft.AspNetCore.Http;
namespace ReceiptFlow.Api.Services.Invoice;

public interface IInvoiceService
{
    Task<InvoiceResponseDto> Create(CreateInvoiceDto dto);

    Task<InvoiceResponseDto> GetById(Guid id);

    Task<PagedResult<InvoiceResponseDto>> GetMyInvoices(InvoiceQueryParams query);

    Task<InvoiceResponseDto> Update(Guid id, UpdateInvoiceDto dto);

    Task Delete(Guid id);

    Task<object> UploadAndExtract(IFormFile image);
}