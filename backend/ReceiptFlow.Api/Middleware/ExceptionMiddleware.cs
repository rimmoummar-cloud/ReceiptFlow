using System.Net;
using System.Text.Json;
using ReceiptFlow.Api.DTOs.Common;
namespace ReceiptFlow.Api.Middleware;

public class ExceptionMiddleware
{
    private readonly RequestDelegate _next;

    public ExceptionMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await HandleException(context, ex);
        }
    }

    // private static async Task HandleException(HttpContext context, Exception ex)
    // {
    //     context.Response.ContentType = "application/json";

    //     context.Response.StatusCode = ex switch
    //     {
    //         KeyNotFoundException => (int)HttpStatusCode.NotFound,
    //         UnauthorizedAccessException => (int)HttpStatusCode.Unauthorized,
    //         ArgumentException => (int)HttpStatusCode.BadRequest,
    //         _ => (int)HttpStatusCode.InternalServerError
    //     };

    //     var response = new
    //     {
    //         success = false,
    //         data = (object?)null,
    //       error = ex.InnerException?.Message ?? ex.Message
    //     };

    //     await context.Response.WriteAsync(JsonSerializer.Serialize(response));
    // }
private static Task HandleException(HttpContext context, Exception ex)
{
    context.Response.ContentType = "application/json";

    var statusCode = ex switch
    {
        UnauthorizedAccessException => StatusCodes.Status401Unauthorized,
        KeyNotFoundException => StatusCodes.Status404NotFound,
        ArgumentException => StatusCodes.Status400BadRequest,
        _ => StatusCodes.Status500InternalServerError
    };

    context.Response.StatusCode = statusCode;

    var response = ApiResponse<object>.Fail(ex.Message);

    return context.Response.WriteAsync(
        JsonSerializer.Serialize(response)
    );
}
// private static Task HandleException(HttpContext context, Exception ex)
// {
//     context.Response.ContentType = "application/json";

//     context.Response.StatusCode = ex switch
//     {
//         KeyNotFoundException => StatusCodes.Status404NotFound,
//         UnauthorizedAccessException => StatusCodes.Status401Unauthorized,
//         ArgumentException => StatusCodes.Status400BadRequest,
//         _ => StatusCodes.Status500InternalServerError
//     };

//     var response = new
//     {
//         success = false,
//         data = (object?)null,
//         error = ex.Message
//     };

//     return context.Response.WriteAsync(JsonSerializer.Serialize(response));
// }
}