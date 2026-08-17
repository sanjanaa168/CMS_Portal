using System.ComponentModel.DataAnnotations;
using ComplaintManagementSystem.API.Models.Enums;

namespace ComplaintManagementSystem.API.DTOs;

/// <summary>
/// Data Transfer Object representing the payload to update a complaint's status.
/// </summary>
public class UpdateComplaintStatusDto
{
    [Required(ErrorMessage = "Status is required.")]
    [EnumDataType(typeof(ComplaintStatus), ErrorMessage = "Invalid complaint status value.")]
    public ComplaintStatus Status { get; set; }
}
