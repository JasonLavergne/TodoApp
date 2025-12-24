using Microsoft.AspNetCore.Mvc;

namespace TodoApp.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ILogger<AuthController> _logger;

        public AuthController(ILogger<AuthController> logger)
        {
            _logger = logger;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            // TODO: Add actual authentication logic (check database, validate credentials, etc.)
            // For now, this is a simple mock that accepts any email/password
            if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password))
            {
                return BadRequest(new { message = "Email and password are required" });
            }

            // Mock authentication - replace with real authentication
            var user = new
            {
                id = "1",
                name = request.Email.Split('@')[0],
                email = request.Email,
                token = Guid.NewGuid().ToString() // In production, use JWT tokens
            };

            return Ok(user);
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

