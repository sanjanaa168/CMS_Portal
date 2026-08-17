using System.ComponentModel.DataAnnotations;

namespace ComplaintManagementSystem.API.DTOs;

/// <summary>
/// Data Transfer Object representing user login payload.
/// </summary>
public class LoginRequest
{
    [Required(ErrorMessage = "Email is required.")]
    [EmailAddress(ErrorMessage = "Invalid email address format.")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Password is required.")]
    public string Password { get; set; } = string.Empty;
}
