using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ReceiptFlow.Api.Services.Analytics;

[ApiController]
[Route("api/analytics")]
[Authorize]
public class AnalyticsController : ControllerBase
{
    private readonly IAnalyticsService _service;

    public AnalyticsController(IAnalyticsService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] decimal monthlyLimit = 1000)
    {
        var result = await _service.GetUserAnalytics(monthlyLimit);
       return Ok(ApiResponse<AnalyticsResponseDto>.Ok(result));
    }
}