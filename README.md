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
- **Features**: User auth, CRUD operations, guest mode (localStorage)

## Tech Stack

- Backend: .NET Core, Entity Framework Core, SQLite
- Frontend: React, TypeScript, Tailwind CSS
- Database: SQLite (file-based, no setup needed)

## Notes

- SQLite database file (`todoapp.db`) is created automatically on first run
- Guest users can use the app without signing up (data stored in browser)
- In production, you'd want to add JWT tokens, proper error handling, and maybe swap SQLite for PostgreSQL

## Project Structure

```
TodoApp/
├── TodoApp.Server/    # .NET Core API
└── TodoApp.Client/    # React frontend
```

---

Built as a coding test. It works, it's clean, and it's ready to extend.

