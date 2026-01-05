# Todo App

A simple todo task management app built with .NET Core backend and React frontend.

## Quick Start

### Prerequisites
- .NET 9.0 SDK
- Node.js 18+ and npm

### Run the App

1. **Backend** (from `TodoApp.Server` folder):
   ```bash
   dotnet run
   ```
   Backend runs on `http://localhost:5062`

2. **Frontend** (from `TodoApp.Client` folder):
   ```bash
   npm install
   npm run dev
   ```
   Frontend runs on `http://localhost:5173`

That's it! Open `http://localhost:5173` in your browser.

## What's Inside

- **Backend**: .NET Core 9.0 API with SQLite database
- **Frontend**: React + TypeScript + Vite
- **Features**: User auth, CRUD operations, guest mode (localStorage), mobile support (Capacitor)
- **Communication**: REST API with JSON, CORS enabled for frontend-backend communication

## Tech Stack

- Backend: .NET Core, Entity Framework Core, SQLite
- Frontend: React, TypeScript, Tailwind CSS
- Database: SQLite (file-based, no setup needed)

## Architecture & Decisions

**Structure**: Clean separation between frontend and backend. Controllers handle API logic, EF Core manages database operations, React hooks handle state management.

**Trade-offs & Assumptions**:
- Using SQLite for simplicity (no database server needed). For production, PostgreSQL would be better for concurrent users.
- Simple GUID tokens instead of JWT (works for MVP, but JWT would be needed for real auth).
- Guest mode uses localStorage (data doesn't persist across devices, but allows testing without signup).
- No pagination (assumes users won't have thousands of todos).

**Scalability**: Current setup handles single-user to small-team use. For scale, you'd want: PostgreSQL, JWT auth, pagination, and caching.

**Future Improvements**: JWT tokens, email verification, password reset, todo categories/tags, due dates, search/filter, pagination, real-time updates (SignalR), unit tests.

## Notes

- SQLite database file (`todoapp.db`) is created automatically on first run
- Guest users can use the app without signing up (data stored in browser)

## Project Structure

```
TodoApp/
├── TodoApp.Server/    # .NET Core API
└── TodoApp.Client/    # React frontend
```

---

Built as a coding test. It works, it's clean, and it's ready to extend.

