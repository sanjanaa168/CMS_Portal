using ComplaintManagementSystem.API.DTOs;
using ComplaintManagementSystem.API.Models.Enums;
using ComplaintManagementSystem.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ComplaintManagementSystem.API.Controllers;

/// <summary>
/// Controller for administrative management of all user complaints.
/// Restrict access to users possessing the ADMIN role.
/// </summary>
[ApiController]
[Route("api/admin/complaints")]
[Authorize(Roles = "ADMIN")]
public class AdminComplaintController : ControllerBase
{
    private readonly IComplaintService _complaintService;

    public AdminComplaintController(IComplaintService complaintService)
    {
        _complaintService = complaintService;
    }

    /// <summary>
    /// Retrieves all complaints across all users.
    /// </summary>
    /// <returns>Collection of all complaints in the system.</returns>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<ComplaintResponseDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> GetAll()
    {
        var complaints = await _complaintService.GetAllComplaintsAsync();
        return Ok(complaints);
    }

    /// <summary>
    /// Retrieves a specific complaint by ID.
    /// </summary>
    /// <param name="id">Complaint ID.</param>
    /// <returns>Complaint details if found; otherwise 404 Not Found.</returns>
    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(ComplaintResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> GetById(int id)
    {
        var complaint = await _complaintService.GetComplaintByIdAsync(id);
        if (complaint == null)
        {
            return NotFound(new { message = $"Complaint with ID {id} not found." });
        }

        return Ok(complaint);
    }

    /// <summary>
    /// Updates the status of a specific complaint.
    /// </summary>
    /// <param name="id">Complaint ID.</param>
    /// <param name="dto">Payload containing the new ComplaintStatus.</param>
    /// <returns>Updated complaint details.</returns>
    [HttpPut("{id:int}/status")]
    [ProducesResponseType(typeof(ComplaintResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateComplaintStatusDto dto)
    {
        if (!ModelState.IsValid || !Enum.IsDefined(typeof(ComplaintStatus), dto.Status))
        {
            return BadRequest(new { message = "Invalid complaint status value." });
        }

        var updatedComplaint = await _complaintService.UpdateComplaintStatusAsync(id, dto.Status);
        if (updatedComplaint == null)
        {
            return NotFound(new { message = $"Complaint with ID {id} not found." });
        }

        return Ok(updatedComplaint);
    }

    /// <summary>
    /// Deletes a specific complaint.
    /// </summary>
    /// <param name="id">Complaint ID.</param>
    /// <returns>Success message or 404 Not Found.</returns>
    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> Delete(int id)
    {
        var isDeleted = await _complaintService.DeleteComplaintAsync(id);
        if (!isDeleted)
        {
            return NotFound(new { message = $"Complaint with ID {id} not found." });
        }

        return Ok(new { message = "Complaint deleted successfully." });
    }
}
