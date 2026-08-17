using ComplaintManagementSystem.API.DTOs;

namespace ComplaintManagementSystem.API.Services;

/// <summary>
/// Defines the contract for user authentication operations (registration and login).
/// </summary>
public interface IAuthService
{
    /// <summary>
    /// Registers a new user with default USER role, hashes their password, and generates a JWT.
    /// </summary>
    /// <param name="request">The registration details.</param>
    /// <returns>AuthResponse containing user info and JWT token.</returns>
    Task<AuthResponse> RegisterAsync(RegisterRequest request);

    /// <summary>
    /// Authenticates a user by email and password, returning user info and a JWT on success.
    /// </summary>
    /// <param name="request">The login credentials.</param>
    /// <returns>AuthResponse if credentials are valid; otherwise null.</returns>
    Task<AuthResponse?> LoginAsync(LoginRequest request);
}
