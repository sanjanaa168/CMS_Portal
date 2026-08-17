using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using ComplaintManagementSystem.API.Data;
using ComplaintManagementSystem.API.DTOs;
using ComplaintManagementSystem.API.Models;
using ComplaintManagementSystem.API.Models.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace ComplaintManagementSystem.API.Services;

/// <summary>
/// Service implementing user authentication logic including password hashing and JWT token creation.
/// </summary>
public class AuthService : IAuthService
{
    private readonly ApplicationDbContext _context;
    private readonly IConfiguration _configuration;

    public AuthService(ApplicationDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    /// <inheritdoc />
    public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
    {
        var normalizedEmail = request.Email.Trim().ToLower();

        // 1. Check if email is already registered
        var emailExists = await _context.Users.AnyAsync(u => u.Email.ToLower() == normalizedEmail);
        if (emailExists)
        {
            throw new InvalidOperationException("A user with this email address already exists.");
        }

        // 2. Hash the password securely using BCrypt (never store plain text)
        var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

        // 3. Create new user entity with default USER role
        var user = new User
        {
            Name = request.Name.Trim(),
            Email = normalizedEmail,
            PasswordHash = passwordHash,
            Role = Role.USER
        };

        // 4. Save the user using Entity Framework Core
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        // 5. Generate JWT token and return response
        var (token, expiresAt) = GenerateJwtToken(user);

        return new AuthResponse
        {
            Token = token,
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            Role = user.Role.ToString(),
            ExpiresAt = expiresAt
        };
    }

    /// <inheritdoc />
    public async Task<AuthResponse?> LoginAsync(LoginRequest request)
    {
        var normalizedEmail = request.Email.Trim().ToLower();

        // 1. Find the user by email
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == normalizedEmail);
        if (user == null)
        {
            return null; // Invalid email
        }

        // 2. Verify password hash using BCrypt
        var isPasswordValid = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);
        if (!isPasswordValid)
        {
            return null; // Invalid password
        }

        // 3. Generate JWT token and return response
        var (token, expiresAt) = GenerateJwtToken(user);

        return new AuthResponse
        {
            Token = token,
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            Role = user.Role.ToString(),
            ExpiresAt = expiresAt
        };
    }

    /// <summary>
    /// Generates a signed JWT token containing User claims (Id, Name, Email, Role) and expiration.
    /// </summary>
    private (string Token, DateTime ExpiresAt) GenerateJwtToken(User user)
    {
        var jwtKey = _configuration["Jwt:Key"]
            ?? throw new InvalidOperationException("JWT Key is not configured in appsettings.json.");
        var jwtIssuer = _configuration["Jwt:Issuer"]
            ?? throw new InvalidOperationException("JWT Issuer is not configured in appsettings.json.");
        var jwtAudience = _configuration["Jwt:Audience"]
            ?? throw new InvalidOperationException("JWT Audience is not configured in appsettings.json.");

        var expiresAt = DateTime.UtcNow.AddHours(24);

        // Define user claims to embed in the JWT payload
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Name, user.Name),
            new(ClaimTypes.Email, user.Email),
            new(ClaimTypes.Role, user.Role.ToString()),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var tokenDescriptor = new JwtSecurityToken(
            issuer: jwtIssuer,
            audience: jwtAudience,
            claims: claims,
            expires: expiresAt,
            signingCredentials: credentials
        );

        var tokenHandler = new JwtSecurityTokenHandler();
        var tokenString = tokenHandler.WriteToken(tokenDescriptor);

        return (tokenString, expiresAt);
    }
}
