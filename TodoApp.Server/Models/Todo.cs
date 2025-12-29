namespace TodoApp.Server.Models;

public class Todo
{
    public int Id { get; set; }
    public string Text { get; set; } = string.Empty;
    public bool Completed { get; set; }
    public int UserId { get; set; }
    public User User { get; set; } = null!;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
}

