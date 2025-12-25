using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TodoApp.Server.Data;
using TodoApp.Server.Models;

namespace TodoApp.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ILogger<AuthController> _logger;
        private readonly ApplicationDbContext _context;
        private readonly PasswordHasher<User> _passwordHasher;

        public AuthController(ILogger<AuthController> logger, ApplicationDbContext context)
        {
            _logger = logger;
            _context = context;
            _passwordHasher = new PasswordHasher<User>();
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password))
            {
                return BadRequest(new { message = "Email and password are required" });
            }

            // Find user by email
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == request.Email);

            if (user == null)
            {
                return Unauthorized(new { message = "Invalid email or password" });
            }

            // Verify password
            var result = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, request.Password);
            if (result != PasswordVerificationResult.Success)
            {
                return Unauthorized(new { message = "Invalid email or password" });
            }

            // Return user data (in production, generate JWT token here)
            var response = new
            {
                id = user.Id.ToString(),
                name = user.Name,
                email = user.Email,
                token = Guid.NewGuid().ToString() // In production, use JWT tokens
            };

            return Ok(response);
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            // TODO: Invalidate token on server side if using token-based auth
            return Ok(new { message = "Logged out successfully" });
        }

        [HttpGet("me")]
        public IActionResult GetCurrentUser()
        {
            // TODO: Get user from token/session
            // For now, return unauthorized
            return Unauthorized();
        }
    }

    public class LoginRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}

