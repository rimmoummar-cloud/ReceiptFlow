using ReceiptFlow.Api.Models;
using ReceiptFlow.Api.Data;
using ReceiptFlow.Api.DTOs.Auth;
using Microsoft.EntityFrameworkCore;

namespace ReceiptFlow.Api.Services.Auth;

public class AuthService : IAuthService
{
    private readonly AppDbContext _context;
    private readonly JwtService _jwt;

    public AuthService(AppDbContext context, JwtService jwt)
    {
        _context = context;
        _jwt = jwt;
    }

    public async Task<string> Register(RegisterDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.Password))
    throw new Exception("Email and password required");
    
        var exists = await _context.Users.AnyAsync(x => x.Email == dto.Email);
        if (exists)
            throw new Exception("User already exists");

        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = dto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            CreatedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return _jwt.GenerateToken(user);
    }

    // public async Task<string> Login(LoginDto dto)
    // {
    //     var user = await _context.Users.FirstOrDefaultAsync(x => x.Email == dto.Email);

    //     if (user == null)
    //         throw new Exception("Invalid credentials");

    //     var valid = BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);

    //     if (!valid)
    //         throw new Exception("Invalid credentials");

    //     return _jwt.GenerateToken(user);
    // }
    public async Task<string> Login(LoginDto dto)
{
    var user = await _context.Users
        .FirstOrDefaultAsync(x => x.Email == dto.Email);

    if (user == null)
        throw new UnauthorizedAccessException("Invalid credentials");

    var valid = BCrypt.Net.BCrypt.Verify(
        dto.Password,
        user.PasswordHash
    );

    if (!valid)
        throw new UnauthorizedAccessException("Invalid credentials");

    return _jwt.GenerateToken(user);
}
}