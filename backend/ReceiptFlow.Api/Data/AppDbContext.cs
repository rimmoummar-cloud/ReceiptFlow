using Microsoft.EntityFrameworkCore;
using ReceiptFlow.Api.Models;

namespace ReceiptFlow.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();

    public DbSet<Invoice> Invoices => Set<Invoice>();
}