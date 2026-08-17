using ComplaintManagementSystem.API.Models;
using Microsoft.EntityFrameworkCore;

namespace ComplaintManagementSystem.API.Data;

/// <summary>
/// ApplicationDbContext acts as the bridge between Entity Framework Core and PostgreSQL.
/// It coordinates database queries, entity mappings, relationships, and schema configurations.
/// </summary>
public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Complaint> Complaints => Set<Complaint>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // ==========================================
        // User Entity Configuration
        // ==========================================
        modelBuilder.Entity<User>(entity =>
        {
            // Primary Key
            entity.HasKey(u => u.Id);

            // Column Configurations & Validations
            entity.Property(u => u.Name)
                .IsRequired()
                .HasMaxLength(100);

            entity.Property(u => u.Email)
                .IsRequired()
                .HasMaxLength(150);

            // Ensure unique email across all users
            entity.HasIndex(u => u.Email)
                .IsUnique();

            entity.Property(u => u.PasswordHash)
                .IsRequired();

            // Store Enum as human-readable string in PostgreSQL (e.g., 'USER', 'ADMIN')
            entity.Property(u => u.Role)
                .IsRequired()
                .HasConversion<string>()
                .HasMaxLength(20);
        });

        // ==========================================
        // Complaint Entity Configuration
        // ==========================================
        modelBuilder.Entity<Complaint>(entity =>
        {
            // Primary Key
            entity.HasKey(c => c.Id);

            // Column Configurations & Validations
            entity.Property(c => c.Title)
                .IsRequired()
                .HasMaxLength(200);

            entity.Property(c => c.Description)
                .IsRequired()
                .HasMaxLength(2000);

            // Store Enums as human-readable strings in PostgreSQL
            entity.Property(c => c.Category)
                .IsRequired()
                .HasConversion<string>()
                .HasMaxLength(50);

            entity.Property(c => c.Status)
                .IsRequired()
                .HasConversion<string>()
                .HasMaxLength(50);

            entity.Property(c => c.ImageUrl)
                .IsRequired(false)
                .HasMaxLength(500);

            entity.Property(c => c.CreatedAt)
                .IsRequired();

            // ==========================================
            // One-to-Many Relationship: User (1) -> Complaints (Many)
            // ==========================================
            entity.HasOne(c => c.User)
                .WithMany(u => u.Complaints)
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.Cascade); // Deleting a user will automatically cascade delete their complaints
        });
    }
}
