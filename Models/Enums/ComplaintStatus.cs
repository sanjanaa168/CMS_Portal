namespace ComplaintManagementSystem.API.Models.Enums;

/// <summary>
/// Tracks the lifecycle status of a complaint.
/// </summary>
public enum ComplaintStatus
{
    Open = 1,
    Assigned = 2,
    InProgress = 3,
    Resolved = 4
}
