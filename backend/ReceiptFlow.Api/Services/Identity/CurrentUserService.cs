using System.Security.Claims;

namespace ReceiptFlow.Api.Services.Identity;

public class CurrentUserService : ICurrentUserService
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CurrentUserService(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

  public Guid GetUserId()
{
    var value = _httpContextAccessor.HttpContext?
        .User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

    if (!Guid.TryParse(value, out var userId))
        throw new UnauthorizedAccessException("Invalid user identity");

    return userId;
}
}