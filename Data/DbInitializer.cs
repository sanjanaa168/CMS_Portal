using ComplaintManagementSystem.API.Models;
using ComplaintManagementSystem.API.Models.Enums;
using Microsoft.EntityFrameworkCore;

namespace ComplaintManagementSystem.API.Data;

/// <summary>
/// Handles database initialization and administrative data seeding.
/// </summary>
public static class DbInitializer
{
    public const string AdminName = "Admin User";
    public const string AdminEmail = "admin@gmail.com";
    public const string DefaultAdminPassword = "Admin@123";

    /// <summary>
    /// Seeds the default administrator account if it does not already exist.
    /// Password is secure, salted, and hashed using BCrypt.
    /// </summary>
    /// <param name="context">The ApplicationDbContext instance.</param>
    public static async Task SeedAdminUserAsync(ApplicationDbContext context)
    {
        var normalizedEmail = AdminEmail.Trim().ToLower();

        // Prevent duplicate creation across application startups
        var adminExists = await context.Users.AnyAsync(u => u.Email.ToLower() == normalizedEmail);
        if (!adminExists)
        {
            var adminUser = new User
            {
                Name = AdminName,
                Email = normalizedEmail,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(DefaultAdminPassword),
                Role = Role.ADMIN
            };

            context.Users.Add(adminUser);
            await context.SaveChangesAsync();
        }
    }
}
