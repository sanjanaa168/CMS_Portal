using ComplaintManagementSystem.API.Models.Enums;

namespace ComplaintManagementSystem.API.Models;

/// <summary>
/// Represents a complaint submitted by a user.
/// </summary>
public class Complaint
{
    public int Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public ComplaintCategory Category { get; set; }

    public ComplaintStatus Status { get; set; } = ComplaintStatus.Open;

    public string? ImageUrl { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Foreign key to User entity
    public int UserId { get; set; }

    // Navigation property: Reference to the user who filed the complaint
    public User User { get; set; } = null!;
}
