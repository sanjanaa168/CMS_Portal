namespace ComplaintManagementSystem.API.DTOs;

/// <summary>
/// Data Transfer Object returned upon successful authentication (register or login).
/// </summary>
public class AuthResponse
{
    public string Token { get; set; } = string.Empty;
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
}
