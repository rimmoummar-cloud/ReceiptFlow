using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ReceiptFlow.Api.DTOs.Common;
using ReceiptFlow.Api.DTOs.Invoice;
using ReceiptFlow.Api.Services.Invoice;

namespace ReceiptFlow.Api.Controllers;

[ApiController]
[Route("api/invoices")]
[Authorize]
public class InvoiceController : ControllerBase
{
    private readonly IInvoiceService _service;

    public InvoiceController(IInvoiceService service)
    {
        _service = service;
    }

    // CREATE
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateInvoiceDto dto)
    {
        var result = await _service.Create(dto);

        return CreatedAtAction(
            nameof(GetById),
            new { id = result.Id },
            ApiResponse<InvoiceResponseDto>.Ok(result)
        );
    }

    // GET BY ID
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var result = await _service.GetById(id);

        return Ok(ApiResponse<InvoiceResponseDto>.Ok(result));
    }

    // GET ALL (USER SCOPED)
 [HttpGet]
public async Task<IActionResult> GetMyInvoices([FromQuery] InvoiceQueryParams query)
{
    var result = await _service.GetMyInvoices(query);

    return Ok(ApiResponse<PagedResult<InvoiceResponseDto>>.Ok(result));
}

    // UPDATE
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateInvoiceDto dto)
    {
        var result = await _service.Update(id, dto);

        return Ok(ApiResponse<InvoiceResponseDto>.Ok(result));
    }

    // DELETE
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _service.Delete(id);

        return Ok(ApiResponse<bool>.Ok(true));
    }



[HttpPost("upload")]
[Consumes("multipart/form-data")]
public async Task<IActionResult> Upload(
    [FromForm] UploadInvoiceDto dto
)
{
    var result = await _service.UploadAndExtract(
        dto.Image
    );

    return Ok(ApiResponse<object>.Ok(result));
}

}