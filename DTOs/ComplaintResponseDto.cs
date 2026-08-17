namespace ComplaintManagementSystem.API.DTOs;

/// <summary>
/// Data Transfer Object representing complaint details returned by the API.
/// </summary>
public class ComplaintResponseDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
    public DateTime CreatedAt { get; set; }
    public int UserId { get; set; }
}
