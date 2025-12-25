using Microsoft.AspNetCore.Identity;
using TodoApp.Server.Models;

namespace TodoApp.Server.Data;

public static class DbInitializer
{
    public static void Initialize(ApplicationDbContext context)
    {
        // Ensure database is created
        context.Database.EnsureCreated();

        // Check if users already exist
        if (context.Users.Any())
        {
            return; // Database has been seeded
        }

        // Use Microsoft's PasswordHasher
        var passwordHasher = new PasswordHasher<User>();

        // Create test user
        var testUser = new User
        {
            Name = "Test User",
            Email = "test@example.com",
            CreatedAt = DateTime.UtcNow
        };

        // Hash the password
        testUser.PasswordHash = passwordHasher.HashPassword(testUser, "password123");

        context.Users.Add(testUser);
        context.SaveChanges();
    }
}

