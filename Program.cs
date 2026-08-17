using System.Text;
using ComplaintManagementSystem.API.Data;
using ComplaintManagementSystem.API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;

var builder = WebApplication.CreateBuilder(args);

// =====================================================
// 1. SERVICES
// =====================================================

// Controllers
builder.Services.AddControllers();

// Application Services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IComplaintService, ComplaintService>();

// CORS Configuration
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://127.0.0.1:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});


// =====================================================
// 2. DATABASE
// =====================================================

var connectionString = builder.Configuration
    .GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException(
        "Connection string 'DefaultConnection' not found."
    );

builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseNpgsql(connectionString);
});


// =====================================================
// 3. JWT CONFIGURATION
// =====================================================

var jwtKey = builder.Configuration["Jwt:Key"]
    ?? throw new InvalidOperationException(
        "Jwt:Key is not configured."
    );

var jwtIssuer = builder.Configuration["Jwt:Issuer"]
    ?? throw new InvalidOperationException(
        "Jwt:Issuer is not configured."
    );

var jwtAudience = builder.Configuration["Jwt:Audience"]
    ?? throw new InvalidOperationException(
        "Jwt:Audience is not configured."
    );


// =====================================================
// 4. AUTHENTICATION
// =====================================================

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme =
        JwtBearerDefaults.AuthenticationScheme;

    options.DefaultChallengeScheme =
        JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,

        ValidIssuer = jwtIssuer,
        ValidAudience = jwtAudience,

        IssuerSigningKey =
            new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtKey)
            ),

        ClockSkew = TimeSpan.Zero
    };
});


// =====================================================
// 5. AUTHORIZATION
// =====================================================

builder.Services.AddAuthorization();


// =====================================================
// 6. SWAGGER
// =====================================================

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc(
        "v1",
        new OpenApiInfo
        {
            Title = "Complaint Management System API",
            Version = "v1",
            Description =
                "ASP.NET Core Web API with JWT Authentication"
        }
    );


    // ---------------------------------------------
    // JWT Bearer Security Definition
    // ---------------------------------------------

    options.AddSecurityDefinition(
        "Bearer",
        new OpenApiSecurityScheme
        {
            Name = "Authorization",

            Type = SecuritySchemeType.Http,

            Scheme = "bearer",

            BearerFormat = "JWT",

            In = ParameterLocation.Header,

            Description =
                "Enter your JWT token. Swagger will send it as: " +
                "Authorization: Bearer <token>"
        }
    );


    // ---------------------------------------------
    // Apply Bearer authentication to Swagger
    // ---------------------------------------------

    options.AddSecurityRequirement(
        document => new OpenApiSecurityRequirement
        {
            [
                new OpenApiSecuritySchemeReference(
                    "Bearer",
                    document
                )
            ] = []
        }
    );
});


// =====================================================
// 7. BUILD APPLICATION
// =====================================================

var app = builder.Build();


// =====================================================
// 8. HTTP PIPELINE
// =====================================================

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();

    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint(
            "/swagger/v1/swagger.json",
            "Complaint Management System API v1"
        );

        // Swagger opens at:
        // http://localhost:5000/
        options.RoutePrefix = string.Empty;
    });
}


app.UseHttpsRedirection();

// Enable CORS (must be before UseAuthentication/UseAuthorization)
app.UseCors("AllowFrontend");


// IMPORTANT:
// Authentication MUST come before Authorization
app.UseAuthentication();

app.UseAuthorization();


// Controllers
app.MapControllers();


// =====================================================
// 9. DATABASE SEEDING
// =====================================================

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    await DbInitializer.SeedAdminUserAsync(dbContext);
}


// Start application
app.Run();