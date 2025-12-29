using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TodoApp.Server.Data;
using TodoApp.Server.Models;

namespace TodoApp.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TodoController : ControllerBase
    {
        private readonly ILogger<TodoController> _logger;
        private readonly ApplicationDbContext _context;

        public TodoController(ILogger<TodoController> logger, ApplicationDbContext context)
        {
            _logger = logger;
            _context = context;
        }

        // GET: api/todo?userId=1
        [HttpGet]
        public async Task<IActionResult> GetTodos([FromQuery] int userId)
        {
            if (userId <= 0)
            {
                return BadRequest(new { message = "Valid userId is required" });
            }

            var todos = await _context.Todos
                .Where(t => t.UserId == userId)
                .OrderByDescending(t => t.CreatedAt)
                .Select(t => new
                {
                    id = t.Id,
                    text = t.Text,
                    completed = t.Completed,
                    createdAt = t.CreatedAt,
                    updatedAt = t.UpdatedAt
                })
                .ToListAsync();

            return Ok(todos);
        }

        // POST: api/todo
        [HttpPost]
        public async Task<IActionResult> CreateTodo([FromBody] CreateTodoRequest request)
        {
            if (request.UserId <= 0)
            {
                return BadRequest(new { message = "Valid userId is required" });
            }

            if (string.IsNullOrWhiteSpace(request.Text))
            {
                return BadRequest(new { message = "Text is required" });
            }

            // Verify user exists
            var userExists = await _context.Users.AnyAsync(u => u.Id == request.UserId);
            if (!userExists)
            {
                return NotFound(new { message = "User not found" });
            }

            var todo = new Todo
            {
                Text = request.Text.Trim(),
                Completed = false,
                UserId = request.UserId,
                CreatedAt = DateTime.UtcNow
            };

            _context.Todos.Add(todo);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                id = todo.Id,
                text = todo.Text,
                completed = todo.Completed,
                createdAt = todo.CreatedAt,
                updatedAt = todo.UpdatedAt
            });
        }

        // PUT: api/todo/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTodo(int id, [FromBody] UpdateTodoRequest request)
        {
            if (request.UserId <= 0)
            {
                return BadRequest(new { message = "Valid userId is required" });
            }

            var todo = await _context.Todos
                .FirstOrDefaultAsync(t => t.Id == id && t.UserId == request.UserId);

            if (todo == null)
            {
                return NotFound(new { message = "Todo not found" });
            }

            if (request.Text != null)
            {
                todo.Text = request.Text.Trim();
            }

            if (request.Completed.HasValue)
            {
                todo.Completed = request.Completed.Value;
            }

            todo.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                id = todo.Id,
                text = todo.Text,
                completed = todo.Completed,
                createdAt = todo.CreatedAt,
                updatedAt = todo.UpdatedAt
            });
        }

        // DELETE: api/todo/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTodo(int id, [FromQuery] int userId)
        {
            if (userId <= 0)
            {
                return BadRequest(new { message = "Valid userId is required" });
            }

            var todo = await _context.Todos
                .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

            if (todo == null)
            {
                return NotFound(new { message = "Todo not found" });
            }

            _context.Todos.Remove(todo);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Todo deleted successfully" });
        }
    }

    public class CreateTodoRequest
    {
        public int UserId { get; set; }
        public string Text { get; set; } = string.Empty;
    }

    public class UpdateTodoRequest
    {
        public int UserId { get; set; }
        public string? Text { get; set; }
        public bool? Completed { get; set; }
    }
}

