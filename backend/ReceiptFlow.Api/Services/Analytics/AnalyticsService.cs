using Microsoft.EntityFrameworkCore;
using ReceiptFlow.Api.Data;
using ReceiptFlow.Api.DTOs.Analytics;
using ReceiptFlow.Api.Services.Identity;

public class AnalyticsService : IAnalyticsService
{
    private readonly AppDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public AnalyticsService(AppDbContext context, ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<AnalyticsResponseDto> GetUserAnalytics(decimal monthlyLimit)
    {
        var userId = _currentUser.GetUserId();

        var invoices = await _context.Invoices
            .Where(x => x.UserId == userId)
            .ToListAsync();

        var total = invoices.Sum(x => x.Amount);

        var paid = invoices.Where(x => x.Status == "Paid").Sum(x => x.Amount);
        var pending = invoices.Where(x => x.Status == "Pending").Sum(x => x.Amount);
        var overdue = invoices.Where(x => x.Status == "Overdue").Sum(x => x.Amount);

        // Monthly grouping
        var monthly = invoices
            .GroupBy(x => new { x.InvoiceDate.Year, x.InvoiceDate.Month })
            .Select(g => new MonthlyAnalyticsDto
            {
                Month = $"{g.Key.Month}-{g.Key.Year}",
                Total = g.Sum(x => x.Amount)
            })
            .OrderBy(x => x.Month)
            .ToList();

        // Yearly grouping
        var yearly = invoices
            .GroupBy(x => x.InvoiceDate.Year)
            .Select(g => new YearlyAnalyticsDto
            {
                Year = g.Key,
                Total = g.Sum(x => x.Amount)
            })
            .ToList();

        // Category
        var byCategory = invoices
            .GroupBy(x => x.Category)
            .Select(g => new CategoryAnalyticsDto
            {
                Category = g.Key,
                Total = g.Sum(x => x.Amount)
            })
            .ToList();

        // Alert logic
        var currentMonth = DateTime.UtcNow.Month;
        var currentYear = DateTime.UtcNow.Year;

        var currentMonthTotal = invoices
            .Where(x => x.InvoiceDate.Month == currentMonth && x.InvoiceDate.Year == currentYear)
            .Sum(x => x.Amount);

        var alert = new AlertDto
        {
            Limit = monthlyLimit,
            Current = currentMonthTotal,
            IsOverLimit = currentMonthTotal > monthlyLimit,
            Message = currentMonthTotal > monthlyLimit
                ? "You exceeded your monthly limit!"
                : "You're within budget"
        };

        return new AnalyticsResponseDto
        {
            TotalAmount = total,
            PaidAmount = paid,
            PendingAmount = pending,
            OverdueAmount = overdue,
            Monthly = monthly,
            Yearly = yearly,
            ByCategory = byCategory,
            Alert = alert
        };
    }
}