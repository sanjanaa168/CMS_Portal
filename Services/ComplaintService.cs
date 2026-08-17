using ComplaintManagementSystem.API.Data;
using ComplaintManagementSystem.API.DTOs;
using ComplaintManagementSystem.API.Models;
using ComplaintManagementSystem.API.Models.Enums;
using Microsoft.EntityFrameworkCore;

namespace ComplaintManagementSystem.API.Services;

/// <summary>
/// Service implementing business logic for User and Admin Complaint operations.
/// </summary>
public class ComplaintService : IComplaintService
{
    private readonly ApplicationDbContext _context;

    public ComplaintService(ApplicationDbContext context)
    {
        _context = context;
    }

    // ==========================================
    // User Operations
    // ==========================================

    /// <inheritdoc />
    public async Task<ComplaintResponseDto> CreateComplaintAsync(CreateComplaintDto dto, int userId)
    {
        var complaint = new Complaint
        {
            Title = dto.Title.Trim(),
            Description = dto.Description.Trim(),
            Category = dto.Category,
            Status = ComplaintStatus.Open,
            ImageUrl = string.IsNullOrWhiteSpace(dto.ImageUrl) ? null : dto.ImageUrl.Trim(),
            CreatedAt = DateTime.UtcNow,
            UserId = userId
        };

        _context.Complaints.Add(complaint);
        await _context.SaveChangesAsync();

        return MapToDto(complaint);
    }

    /// <inheritdoc />
    public async Task<IEnumerable<ComplaintResponseDto>> GetUserComplaintsAsync(int userId)
    {
        return await _context.Complaints
            .AsNoTracking()
            .Where(c => c.UserId == userId)
            .OrderByDescending(c => c.CreatedAt)
            .Select(c => new ComplaintResponseDto
            {
                Id = c.Id,
                Title = c.Title,
                Description = c.Description,
                Category = c.Category.ToString(),
                Status = c.Status.ToString(),
                ImageUrl = c.ImageUrl,
                CreatedAt = c.CreatedAt,
                UserId = c.UserId
            })
            .ToListAsync();
    }

    /// <inheritdoc />
    public async Task<ComplaintResponseDto?> GetComplaintByIdAsync(int id, int userId)
    {
        var complaint = await _context.Complaints
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId);

        return complaint == null ? null : MapToDto(complaint);
    }

    /// <inheritdoc />
    public async Task<bool> DeleteComplaintAsync(int id, int userId)
    {
        var complaint = await _context.Complaints
            .FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId);

        if (complaint == null)
        {
            return false;
        }

        _context.Complaints.Remove(complaint);
        await _context.SaveChangesAsync();
        return true;
    }

    // ==========================================
    // Admin Operations
    // ==========================================

    /// <inheritdoc />
    public async Task<IEnumerable<ComplaintResponseDto>> GetAllComplaintsAsync()
    {
        return await _context.Complaints
            .AsNoTracking()
            .OrderByDescending(c => c.CreatedAt)
            .Select(c => new ComplaintResponseDto
            {
                Id = c.Id,
                Title = c.Title,
                Description = c.Description,
                Category = c.Category.ToString(),
                Status = c.Status.ToString(),
                ImageUrl = c.ImageUrl,
                CreatedAt = c.CreatedAt,
                UserId = c.UserId
            })
            .ToListAsync();
    }

    /// <inheritdoc />
    public async Task<ComplaintResponseDto?> GetComplaintByIdAsync(int id)
    {
        var complaint = await _context.Complaints
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.Id == id);

        return complaint == null ? null : MapToDto(complaint);
    }

    /// <inheritdoc />
    public async Task<ComplaintResponseDto?> UpdateComplaintStatusAsync(int id, ComplaintStatus newStatus)
    {
        var complaint = await _context.Complaints
            .FirstOrDefaultAsync(c => c.Id == id);

        if (complaint == null)
        {
            return null;
        }

        complaint.Status = newStatus;
        await _context.SaveChangesAsync();

        return MapToDto(complaint);
    }

    /// <inheritdoc />
    public async Task<bool> DeleteComplaintAsync(int id)
    {
        var complaint = await _context.Complaints
            .FirstOrDefaultAsync(c => c.Id == id);

        if (complaint == null)
        {
            return false;
        }

        _context.Complaints.Remove(complaint);
        await _context.SaveChangesAsync();
        return true;
    }

    /// <summary>
    /// Helper method to map a Complaint entity to ComplaintResponseDto.
    /// </summary>
    private static ComplaintResponseDto MapToDto(Complaint complaint)
    {
        return new ComplaintResponseDto
        {
            Id = complaint.Id,
            Title = complaint.Title,
            Description = complaint.Description,
            Category = complaint.Category.ToString(),
            Status = complaint.Status.ToString(),
            ImageUrl = complaint.ImageUrl,
            CreatedAt = complaint.CreatedAt,
            UserId = complaint.UserId
        };
    }
}
