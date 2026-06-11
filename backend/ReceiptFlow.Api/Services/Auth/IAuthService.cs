using ReceiptFlow.Api.DTOs.Auth;

namespace ReceiptFlow.Api.Services.Auth;

public interface IAuthService
{
    Task<string> Register(RegisterDto dto);
    Task<string> Login(LoginDto dto);
}