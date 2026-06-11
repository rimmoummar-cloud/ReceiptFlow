namespace ReceiptFlow.Api.Services.Identity;

public interface ICurrentUserService
{
    Guid GetUserId();
}