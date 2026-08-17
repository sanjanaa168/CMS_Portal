using System.ComponentModel.DataAnnotations;
using ComplaintManagementSystem.API.Models.Enums;

namespace ComplaintManagementSystem.API.DTOs;

/// <summary>
/// Data Transfer Object representing complaint submission payload.
/// Note: UserId, Status, and CreatedAt are handled server-side for security.
/// </summary>
public class CreateComplaintDto
{
    [Required(ErrorMessage = "Title is required.")]
    [StringLength(200, ErrorMessage = "Title cannot exceed 200 characters.")]
    public string Title { get; set; } = string.Empty;

    [Required(ErrorMessage = "Description is required.")]
    [StringLength(2000, ErrorMessage = "Description cannot exceed 2000 characters.")]
    public string Description { get; set; } = string.Empty;

    [Required(ErrorMessage = "Category is required.")]
    public ComplaintCategory Category { get; set; }

    [StringLength(500, ErrorMessage = "ImageUrl cannot exceed 500 characters.")]
    public string? ImageUrl { get; set; }
}
