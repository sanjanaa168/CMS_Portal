using ComplaintManagementSystem.API.DTOs;
using ComplaintManagementSystem.API.Models.Enums;

namespace ComplaintManagementSystem.API.Services;

/// <summary>
/// Defines the contract for user and admin complaint operations.
/// </summary>
public interface IComplaintService
{
    // ==========================================
    // User Operations
    // ==========================================

    /// <summary>
    /// Creates a new complaint for the specified user.
    /// </summary>
    /// <param name="dto">Complaint submission details.</param>
    /// <param name="userId">ID of the authenticated user.</param>
    /// <returns>ComplaintResponseDto containing created complaint details.</returns>
    Task<ComplaintResponseDto> CreateComplaintAsync(CreateComplaintDto dto, int userId);

    /// <summary>
    /// Retrieves all complaints filed by the specified user.
    /// </summary>
    /// <param name="userId">ID of the authenticated user.</param>
    /// <returns>Collection of complaints belonging to the user.</returns>
    Task<IEnumerable<ComplaintResponseDto>> GetUserComplaintsAsync(int userId);

    /// <summary>
    /// Retrieves a specific complaint by ID, ensuring it belongs to the specified user.
    /// </summary>
    /// <param name="id">Complaint ID.</param>
    /// <param name="userId">ID of the authenticated user.</param>
    /// <returns>ComplaintResponseDto if found and owned by user; otherwise null.</returns>
    Task<ComplaintResponseDto?> GetComplaintByIdAsync(int id, int userId);

    /// <summary>
    /// Deletes a specific complaint by ID, ensuring it belongs to the specified user.
    /// </summary>
    /// <param name="id">Complaint ID.</param>
    /// <param name="userId">ID of the authenticated user.</param>
    /// <returns>True if complaint was found, owned by user, and deleted; otherwise false.</returns>
    Task<bool> DeleteComplaintAsync(int id, int userId);

    // ==========================================
    // Admin Operations
    // ==========================================

    /// <summary>
    /// Retrieves all complaints filed across all users in the system (Admin only).
    /// </summary>
    /// <returns>Collection of all complaints.</returns>
    Task<IEnumerable<ComplaintResponseDto>> GetAllComplaintsAsync();

    /// <summary>
    /// Retrieves any complaint by ID regardless of owner (Admin only).
    /// </summary>
    /// <param name="id">Complaint ID.</param>
    /// <returns>ComplaintResponseDto if found; otherwise null.</returns>
    Task<ComplaintResponseDto?> GetComplaintByIdAsync(int id);

    /// <summary>
    /// Updates the status of a specific complaint (Admin only).
    /// </summary>
    /// <param name="id">Complaint ID.</param>
    /// <param name="newStatus">New complaint status.</param>
    /// <returns>Updated ComplaintResponseDto if found; otherwise null.</returns>
    Task<ComplaintResponseDto?> UpdateComplaintStatusAsync(int id, ComplaintStatus newStatus);

    /// <summary>
    /// Deletes any complaint by ID regardless of owner (Admin only).
    /// </summary>
    /// <param name="id">Complaint ID.</param>
    /// <returns>True if complaint was found and deleted; otherwise false.</returns>
    Task<bool> DeleteComplaintAsync(int id);
}
