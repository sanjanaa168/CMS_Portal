using System.Security.Claims;
using ComplaintManagementSystem.API.DTOs;
using ComplaintManagementSystem.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ComplaintManagementSystem.API.Controllers;

/// <summary>
/// Controller for managing complaints submitted by authenticated users.
/// </summary>
[ApiController]
[Route("api/complaints")]
[Authorize]
public class ComplaintController : ControllerBase
{
    private readonly IComplaintService _complaintService;

    public ComplaintController(IComplaintService complaintService)
    {
        _complaintService = complaintService;
    }

    /// <summary>
    /// Creates a new complaint for the logged-in user.
    /// </summary>
    /// <param name="dto">Complaint payload (Title, Description, Category, ImageUrl).</param>
    /// <returns>Created complaint details with HTTP 201 Created.</returns>
    [HttpPost]
    [ProducesResponseType(typeof(ComplaintResponseDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Create([FromBody] CreateComplaintDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var userId = GetCurrentUserId();
        if (userId == null)
        {
            return Unauthorized(new { message = "User identity could not be verified." });
        }

        var response = await _complaintService.CreateComplaintAsync(dto, userId.Value);
        return CreatedAtAction(nameof(GetById), new { id = response.Id }, response);
    }

    /// <summary>
    /// Retrieves all complaints filed by the logged-in user.
    /// </summary>
    /// <returns>List of user-owned complaints.</returns>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<ComplaintResponseDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetAll()
    {
        var userId = GetCurrentUserId();
        if (userId == null)
        {
            return Unauthorized(new { message = "User identity could not be verified." });
        }

        var complaints = await _complaintService.GetUserComplaintsAsync(userId.Value);
        return Ok(complaints);
    }

    /// <summary>
    /// Retrieves a specific complaint by ID if it belongs to the logged-in user.
    /// </summary>
    /// <param name="id">Complaint ID.</param>
    /// <returns>Complaint details if found; otherwise 404 Not Found.</returns>
    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(ComplaintResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetById(int id)
    {
        var userId = GetCurrentUserId();
        if (userId == null)
        {
            return Unauthorized(new { message = "User identity could not be verified." });
        }

        var complaint = await _complaintService.GetComplaintByIdAsync(id, userId.Value);
        if (complaint == null)
        {
            return NotFound(new { message = $"Complaint with ID {id} not found." });
        }

        return Ok(complaint);
    }

    /// <summary>
    /// Deletes a specific complaint by ID if it belongs to the logged-in user.
    /// </summary>
    /// <param name="id">Complaint ID.</param>
    /// <returns>Success message or 404 Not Found.</returns>
    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Delete(int id)
    {
        var userId = GetCurrentUserId();
        if (userId == null)
        {
            return Unauthorized(new { message = "User identity could not be verified." });
        }

        var isDeleted = await _complaintService.DeleteComplaintAsync(id, userId.Value);
        if (!isDeleted)
        {
            return NotFound(new { message = $"Complaint with ID {id} not found." });
        }

        return Ok(new { message = "Complaint deleted successfully." });
    }

    /// <summary>
    /// Extracts the integer User ID from the NameIdentifier claim of the JWT.
    /// </summary>
    private int? GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return int.TryParse(userIdClaim, out var userId) ? userId : null;
    }
}
