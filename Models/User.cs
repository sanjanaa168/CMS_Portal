using ComplaintManagementSystem.API.Models.Enums;

namespace ComplaintManagementSystem.API.Models;

/// <summary>
/// Represents an application user (e.g., student/resident or admin).
/// </summary>
public class User
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string PasswordHash { get; set; } = string.Empty;

    public Role Role { get; set; } = Role.USER;

    // Navigation property: One user can have multiple complaints
    public ICollection<Complaint> Complaints { get; set; } = new List<Complaint>();
}
