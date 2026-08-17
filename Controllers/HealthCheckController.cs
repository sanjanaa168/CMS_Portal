using Microsoft.AspNetCore.Mvc;

namespace ComplaintManagementSystem.API.Controllers;

/// <summary>
/// Health check endpoint to verify that the Web API server is up and responsive.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class HealthCheckController : ControllerBase
{
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public IActionResult GetStatus()
    {
        return Ok(new
        {
            Status = "Healthy",
            Service = "Complaint Management System API",
            TimestampUtc = DateTime.UtcNow
        });
    }
}
