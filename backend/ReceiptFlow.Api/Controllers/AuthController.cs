using Microsoft.AspNetCore.Mvc;
using ReceiptFlow.Api.DTOs.Auth;
using ReceiptFlow.Api.Services.Auth;
using ReceiptFlow.Api.DTOs.Common;
using Google.Apis.Auth;

using Microsoft.EntityFrameworkCore;
using ReceiptFlow.Api.Data;
using ReceiptFlow.Api.Models;
using ReceiptFlow.Api.Services;




namespace ReceiptFlow.Api.Controllers;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
  private readonly IAuthService _auth;
private readonly AppDbContext _context;
private readonly JwtService _jwtService;

    // public AuthController(IAuthService auth)
    // {
    //     _auth = auth;
    // }
public AuthController(
    IAuthService auth,
    AppDbContext context,
    JwtService jwtService)
{
    _auth = auth;
    _context = context;
    _jwtService = jwtService;
}

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto dto)
    {
       var token = await _auth.Register(dto);

//     Response.Cookies.Append(
//         "access_token",
//         token,
//         new CookieOptions
//         {
//             HttpOnly = true,
//             // Secure = true,
//             // SameSite = SameSiteMode.Strict,
//             Secure = false, // dev فقط
// SameSite = SameSiteMode.Lax,
//             Expires = DateTime.UtcNow.AddDays(7)
//         });

 return Ok(ApiResponse<object>.Ok(new
{
    token = token
}));




    }

[Authorize]
[HttpGet("me")]
public IActionResult Me()
{
    return Ok(
        ApiResponse<object>.Ok(new
        {
          email = User.FindFirst(ClaimTypes.Email)?.Value
        })
    );
}

    // [HttpPost("login")]
    // public async Task<IActionResult> Login(LoginDto dto)
    // {
    //     var token = await _auth.Login(dto);
    // return Ok(ApiResponse<string>.Ok(token));
    // }
    [HttpPost("login")]
public async Task<IActionResult> Login(LoginDto dto)
{
    var token = await _auth.Login(dto);


    return Ok(ApiResponse<object>.Ok(new
{
    token = token
}));
}




[HttpPost("google")]
public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginDto dto)
{
    // var payload = await GoogleJsonWebSignature.ValidateAsync(dto.Token);
var payload = await GoogleJsonWebSignature.ValidateAsync(
    dto.Token,
    new GoogleJsonWebSignature.ValidationSettings
    {
        Audience = new[] { "365135028752-i2d570thjfhi0ffb9eeedt8hagb7rtbt.apps.googleusercontent.com" }
    }
);
    var email = payload.Email;
    var name = payload.Name;
    var googleId = payload.Subject;

    var user = await _context.Users.FirstOrDefaultAsync(x => x.Email == email);

    if (user == null)
    {
        // user = new User
        // {
        //     Id = Guid.NewGuid(),
        //     Email = email,
        //     FullName = name,
        //     GoogleId = googleId,
        //     CreatedAt = DateTime.UtcNow
        // };
user = new User
{
    Id = Guid.NewGuid(),
    Email = email,
    GoogleId = googleId,
    CreatedAt = DateTime.UtcNow
};

        _context.Users.Add(user);
        await _context.SaveChangesAsync();
    }

    var jwt = _jwtService.GenerateToken(user);

    return Ok(new
    {
        token = jwt,
        user
    });
}






}