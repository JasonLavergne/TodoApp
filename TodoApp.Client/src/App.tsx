import { useState, useEffect, useMemo } from 'react'
import { Header } from './components/Header'
import { useAuth } from './contexts/AuthContext'

interface Todo {
  id: number
  text: string
  completed: boolean
  createdAt?: string
  updatedAt?: string | null
}

const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5062')
const GUEST_TODOS_KEY = 'guestTodos'
const GUEST_WARNING_DISMISSED_KEY = 'guestWarningDismissed'

// Helper functions for localStorage guest todos
const getGuestTodos = (): Todo[] => {
  try {
    const stored = localStorage.getItem(GUEST_TODOS_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (err) {
    console.error('Error loading guest todos:', err)
  }
  return []
}

const saveGuestTodos = (todos: Todo[]) => {
  try {
    localStorage.setItem(GUEST_TODOS_KEY, JSON.stringify(todos))
  } catch (err) {
    console.error('Error saving guest todos:', err)
  }
}

function App() {
  const { user, isAuthenticated } = useAuth()
  const [todos, setTodos] = useState<Todo[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editText, setEditText] = useState('')
  const [activeCollapsed, setActiveCollapsed] = useState(false)
  const [completedCollapsed, setCompletedCollapsed] = useState(false)
  const [guestWarningDismissed, setGuestWarningDismissed] = useState(() => {
    try {
      return localStorage.getItem(GUEST_WARNING_DISMISSED_KEY) === 'true'
    } catch {
      return false
    }
  })

  // Load todos when user logs in or out
  useEffect(() => {
    if (isAuthenticated && user) {
      loadTodos()
      // Reset warning dismissed state when user logs in
      setGuestWarningDismissed(false)
      try {
        localStorage.removeItem(GUEST_WARNING_DISMISSED_KEY)
      } catch (err) {
        console.error('Error clearing dismissed state:', err)
      }
    } else {
      // Load guest todos from localStorage
      const guestTodos = getGuestTodos()
      setTodos(guestTodos)
      // Load dismissed state for guest mode
      try {
        const dismissed = localStorage.getItem(GUEST_WARNING_DISMISSED_KEY) === 'true'
        setGuestWarningDismissed(dismissed)
      } catch (err) {
        console.error('Error loading dismissed state:', err)
      }
    }
  }, [isAuthenticated, user])

  const loadTodos = async () => {
    if (!user) return

    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_BASE_URL}/api/todo?userId=${user.id}`)
      if (!response.ok) {
        throw new Error('Failed to load todos')
      }
      const data = await response.json()
      setTodos(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load todos')
      console.error('Error loading todos:', err)
    } finally {
      setLoading(false)
    }
  }

  const addTodo = async () => {
    if (input.trim() === '') return
    
    // Guest mode: save to localStorage
    if (!isAuthenticated || !user) {
      const newTodo: Todo = {
        id: Date.now(), // Use timestamp as ID for guest todos
        text: input.trim(),
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: null
      }
      const updatedTodos = [...todos, newTodo]
      setTodos(updatedTodos)
      saveGuestTodos(updatedTodos)
      setInput('')
      return
    }
    
    // Authenticated mode: save to API
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_BASE_URL}/api/todo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: parseInt(user.id),
          text: input.trim()
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create todo')
      }

      const newTodo = await response.json()
      setTodos([...todos, newTodo])
      setInput('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create todo')
      console.error('Error creating todo:', err)
    } finally {
      setLoading(false)
    }
  }

  const toggleTodo = async (id: number) => {
    const todo = todos.find(t => t.id === id)
    if (!todo) return

    // Guest mode: update localStorage
    if (!isAuthenticated || !user) {
      const updatedTodos = todos.map(t => 
        t.id === id ? { ...t, completed: !t.completed, updatedAt: new Date().toISOString() } : t
      )
      setTodos(updatedTodos)
      saveGuestTodos(updatedTodos)
      return
    }

    // Authenticated mode: update via API
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_BASE_URL}/api/todo/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: parseInt(user.id),
          completed: !todo.completed
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update todo')
      }

      const updatedTodo = await response.json()
      setTodos(todos.map(t => 
        t.id === id ? updatedTodo : t
      ))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update todo')
      console.error('Error updating todo:', err)
      // Revert optimistic update on error
      setTodos(todos.map(t => 
        t.id === id ? { ...t, completed: !t.completed } : t
      ))
    } finally {
      setLoading(false)
    }
  }

  const startEdit = (id: number) => {
    const todo = todos.find(t => t.id === id)
    if (todo) {
      setEditingId(id)
      setEditText(todo.text)
    }
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditText('')
  }

  const saveEdit = async (id: number) => {
    if (editText.trim() === '') {
      cancelEdit()
      return
    }

    // Guest mode: update localStorage
    if (!isAuthenticated || !user) {
      const updatedTodos = todos.map(t => 
        t.id === id ? { ...t, text: editText.trim(), updatedAt: new Date().toISOString() } : t
      )
      setTodos(updatedTodos)
      saveGuestTodos(updatedTodos)
      setEditingId(null)
      setEditText('')
      return
    }

    // Authenticated mode: update via API
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_BASE_URL}/api/todo/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: parseInt(user.id),
          text: editText.trim()
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update todo')
      }

      const updatedTodo = await response.json()
      setTodos(todos.map(t => 
        t.id === id ? updatedTodo : t
      ))
      setEditingId(null)
      setEditText('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update todo')
      console.error('Error updating todo:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleEditKeyPress = (e: React.KeyboardEvent, id: number) => {
    if (e.key === 'Enter') {
      saveEdit(id)
    } else if (e.key === 'Escape') {
      cancelEdit()
    }
  }

  const deleteTodo = async (id: number) => {
    // Guest mode: update localStorage
    if (!isAuthenticated || !user) {
      const updatedTodos = todos.filter(todo => todo.id !== id)
      setTodos(updatedTodos)
      saveGuestTodos(updatedTodos)
      return
    }

    // Authenticated mode: delete via API
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_BASE_URL}/api/todo/${id}?userId=${user.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete todo')
      }

      setTodos(todos.filter(todo => todo.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete todo')
      console.error('Error deleting todo:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTodo()
    }
  }

  const dismissGuestWarning = () => {
    setGuestWarningDismissed(true)
    try {
      localStorage.setItem(GUEST_WARNING_DISMISSED_KEY, 'true')
    } catch (err) {
      console.error('Error saving dismissed state:', err)
    }
  }

  // Separate active and completed todos
  const { activeTodos, completedTodos } = useMemo(() => {
    const active = todos.filter(todo => !todo.completed)
    const completed = todos.filter(todo => todo.completed)
    return { activeTodos: active, completedTodos: completed }
  }, [todos])

  const renderTodoItem = (todo: Todo) => (
    <li
      key={todo.id}
      className={`group flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 ${
        todo.completed 
          ? 'bg-slate-700/20 border-slate-600/20' 
          : 'bg-slate-700/40 border-slate-600/40 hover:bg-slate-700/60 hover:border-slate-500/50'
      }`}
    >
      <div className="relative flex-shrink-0 flex items-center">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => toggleTodo(todo.id)}
          disabled={loading}
          className="w-5 h-5 rounded-md bg-slate-600/50 border-2 border-blue-500/60 accent-blue-600 focus:ring-2 focus:ring-blue-500/60 focus:ring-offset-2 focus:ring-offset-slate-800 cursor-pointer transition-all duration-200 checked:bg-blue-600 checked:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>
      {editingId === todo.id ? (
        <input
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onKeyDown={(e) => handleEditKeyPress(e, todo.id)}
          autoFocus
          className="flex-1 px-3 py-2.5 bg-slate-600/60 border border-blue-500/60 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500/60 transition-all duration-200 text-base leading-normal"
        />
      ) : (
        <span
          className={`flex-1 px-3 py-2.5 border border-transparent rounded-lg transition-all duration-200 text-base leading-normal ${
            todo.completed
              ? 'line-through text-slate-500'
              : 'text-slate-100'
          }`}
        >
          {todo.text}
        </span>
      )}
      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {editingId === todo.id ? (
          <>
            <button
              onClick={() => saveEdit(todo.id)}
              disabled={loading}
              className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-green-500/20 hover:border-green-500/40"
              title="Save"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </button>
            <button
              onClick={cancelEdit}
              disabled={loading}
              className="p-2 bg-slate-500/20 text-slate-400 rounded-lg hover:bg-slate-500/30 focus:outline-none focus:ring-2 focus:ring-slate-500/50 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-slate-500/20 hover:border-slate-500/40"
              title="Cancel"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => startEdit(todo.id)}
              disabled={loading || todo.completed}
              className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-blue-500/20 hover:border-blue-500/40"
              title="Edit"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={() => deleteTodo(todo.id)}
              disabled={loading}
              className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-red-500/20 hover:border-red-500/40"
              title="Delete"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </>
        )}
      </div>
    </li>
  )

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      <div className="pt-[5.5rem] pb-16 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          {!isAuthenticated && !guestWarningDismissed && (
            <div className="bg-amber-500/5 border border-amber-500/15 rounded-2xl p-5 mb-6 backdrop-blur-sm relative">
              <button
                onClick={dismissGuestWarning}
                className="absolute top-3 right-3 text-amber-500/50 hover:text-amber-500/70 transition-colors duration-200 p-1 rounded-lg hover:bg-amber-500/5"
                title="Dismiss"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="flex items-start gap-3 pr-8">
                <svg className="w-5 h-5 text-amber-500/70 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-amber-500/80 font-bold text-base">Guest Mode</span>
                  </div>
                  <p className="text-amber-500/70 text-sm">Your tasks are saved locally. Log in to sync across devices.</p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-5 mb-6 text-center backdrop-blur-sm">
              <p className="text-red-400 font-medium">{error}</p>
            </div>
          )}
          
          <div className="bg-slate-800/60 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-6 sm:p-8 mb-6">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="What needs to be done?"
                disabled={loading}
                className="flex-1 px-5 py-2.5 bg-slate-700/40 border border-slate-600/40 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500/60 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-base shadow-inner"
              />
              <button
                onClick={addTodo}
                disabled={loading || input.trim() === ''}
                className="px-8 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
              >
                Add
              </button>
            </div>
          </div>

          <div className="bg-slate-800/60 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-6 sm:p-8">
            {loading && todos.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-blue-500/20 flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-8 h-8 text-blue-400 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <p className="text-slate-400 text-base font-medium">Loading todos...</p>
              </div>
            ) : todos.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-slate-700/50 flex items-center justify-center backdrop-blur-sm border border-slate-600/30">
                  <svg className="w-10 h-10 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-slate-100 text-lg font-semibold mb-1">
                  No tasks yet
                </p>
                <p className="text-slate-500 text-sm">
                  Add your first task above to get started
                </p>
              </div>
            ) : (
              <>
                {/* Active Todos Section */}
                {activeTodos.length > 0 && (
                  <div className="mb-6">
                    <button
                      onClick={() => setActiveCollapsed(!activeCollapsed)}
                      className="w-full flex items-center justify-between mb-4 hover:opacity-80 transition-opacity duration-200 group"
                    >
                      <h2 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        Active ({activeTodos.length})
                      </h2>
                      <svg
                        className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${activeCollapsed ? '' : 'rotate-180'}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {!activeCollapsed && (
                      <ul className="space-y-2.5">
                        {activeTodos.map(todo => renderTodoItem(todo))}
                      </ul>
                    )}
                  </div>
                )}

                {/* Completed Todos Section */}
                {completedTodos.length > 0 && (
                  <div className={activeTodos.length > 0 ? 'pt-6 border-t border-slate-700/50' : ''}>
                    <button
                      onClick={() => setCompletedCollapsed(!completedCollapsed)}
                      className="w-full flex items-center justify-between mb-4 hover:opacity-80 transition-opacity duration-200 group"
                    >
                      <h2 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        Completed ({completedTodos.length})
                      </h2>
                      <svg
                        className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${completedCollapsed ? '' : 'rotate-180'}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {!completedCollapsed && (
                      <ul className="space-y-2.5">
                        {completedTodos.map(todo => renderTodoItem(todo))}
                      </ul>
                    )}
                  </div>
                )}

                {/* Show message if no todos in either section */}
                {activeTodos.length === 0 && completedTodos.length === 0 && (
                  <div className="text-center py-20">
                    <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-slate-700/50 flex items-center justify-center backdrop-blur-sm border border-slate-600/30">
                      <svg className="w-10 h-10 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-slate-100 text-lg font-semibold mb-1">
                      No tasks yet
                    </p>
                    <p className="text-slate-500 text-sm">
                      Add your first task above to get started
                    </p>
                  </div>
                )}
                
                {todos.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-slate-700/50">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-2.5 text-sm">
                        <div className="w-5 h-5 rounded-md bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                          <svg className="w-3.5 h-3.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-slate-400 font-medium">
                          {todos.filter(t => t.completed).length} of {todos.length} completed
                        </span>
                      </div>
                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="flex-1 sm:flex-none h-2.5 w-32 bg-slate-700/50 rounded-full overflow-hidden shadow-inner">
                          <div 
                            className="h-full bg-blue-600 transition-all duration-500 rounded-full"
                            style={{ width: `${todos.length > 0 ? (todos.filter(t => t.completed).length / todos.length) * 100 : 0}%` }}
                          />
                        </div>
                        <span className="text-slate-400 font-semibold min-w-[3.5rem] text-right text-sm">
                          {Math.round((todos.filter(t => t.completed).length / todos.length) * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
