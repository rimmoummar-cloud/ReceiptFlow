using Microsoft.EntityFrameworkCore;
using ReceiptFlow.Api.Data;

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using ReceiptFlow.Api.Services;
using ReceiptFlow.Api.Services.Auth;
using ReceiptFlow.Api.Middleware;
using ReceiptFlow.Api.Services.Identity;
using ReceiptFlow.Api.Services.Invoice;
using ReceiptFlow.Api.Services.AI;
using Microsoft.Extensions.FileProviders;
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddScoped<JwtService>();
builder.Services.AddControllers();
builder.Services.AddHttpContextAccessor();
// builder.Services.AddCors(options =>
// {
//     options.AddPolicy("Frontend", policy =>
//     {
//         policy
// .WithOrigins(
//     "http://localhost:3000",
//     "http://192.168.0.100:3000"
// )
// .AllowAnyHeader()
// .AllowAnyMethod()
// .AllowCredentials();
//     });
// });
builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy
            .AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});



builder.Services.AddScoped<ICurrentUserService, CurrentUserService>();
builder.Services.AddHttpClient<IInvoiceAIService, InvoiceAIService>();
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
.AddJwtBearer(options =>
{
//     options.Events = new JwtBearerEvents
// {
//     OnMessageReceived = context =>
//     {
//         // context.Token =
//         //     context.Request.Cookies["access_token"];
// options.Events = new JwtBearerEvents
// {
//     OnMessageReceived = context =>
//     {
//         var authHeader =
//             context.Request.Headers["Authorization"]
//                 .FirstOrDefault();

//         if (
//             !string.IsNullOrEmpty(authHeader) &&
//             authHeader.StartsWith("Bearer ")
//         )
//         {
//             context.Token =
//                 authHeader.Substring("Bearer ".Length);
//         }

//         return Task.CompletedTask;
//     }
// };
//         return Task.CompletedTask;
//     }
// };

options.Events = new JwtBearerEvents
{
    OnMessageReceived = context =>
    {
        var authHeader =
            context.Request.Headers["Authorization"]
                .FirstOrDefault();

        if (
            !string.IsNullOrEmpty(authHeader) &&
            authHeader.StartsWith("Bearer ")
        )
        {
            context.Token =
                authHeader.Substring("Bearer ".Length);
        }

        return Task.CompletedTask;
    }
};





    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,

        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"])
        )
    };
});
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IInvoiceService, InvoiceService>();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "Enter: Bearer {your token}"
    });

    c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection")
    ));



var port = Environment.GetEnvironmentVariable("PORT") ?? "5000";
builder.WebHost.UseUrls($"http://0.0.0.0:{port}");


var app = builder.Build();
app.MapGet("/", () => Results.Ok("OK"));

app.MapGet("/health", () => Results.Ok("Healthy"));
// Configure the HTTP request pipeline.
// if (app.Environment.IsDevelopment())
// {
//     app.UseSwagger();
//     app.UseSwaggerUI();
// }

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.RoutePrefix = "swagger";
});

var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast =  Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast")
.WithOpenApi();




app.UseStaticFiles();


var uploadsPath = Path.Combine(
    Directory.GetCurrentDirectory(),
    "uploads"
);

Directory.CreateDirectory(uploadsPath);
app.UseStaticFiles(
    new StaticFileOptions
    {
        FileProvider = new PhysicalFileProvider(
            Path.Combine(
                Directory.GetCurrentDirectory(),
                "uploads"
            )
        ),
        RequestPath = "/uploads"
    }
);



app.UseHttpsRedirection();

app.UseRouting();

app.UseCors("Frontend");

app.UseAuthentication();
app.UseAuthorization();
app.UseMiddleware<ExceptionMiddleware>();


app.MapControllers();




app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
