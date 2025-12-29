import { useState, useEffect } from 'react'
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

function App() {
  const { user, isAuthenticated } = useAuth()
  const [todos, setTodos] = useState<Todo[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load todos when user logs in
  useEffect(() => {
    if (isAuthenticated && user) {
      loadTodos()
    } else {
      setTodos([])
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
    if (input.trim() === '' || !user) return
    
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
    if (!user) return

    const todo = todos.find(t => t.id === id)
    if (!todo) return

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

  const deleteTodo = async (id: number) => {
    if (!user) return

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

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      <div className="pt-20 pb-16 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          {!isAuthenticated && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 mb-6 text-center backdrop-blur-sm">
              <p className="text-amber-400 font-medium">Please log in to save and manage your todos</p>
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
                placeholder={isAuthenticated ? "What needs to be done?" : "Log in to add todos"}
                disabled={!isAuthenticated || loading}
                className="flex-1 px-5 py-4 bg-slate-700/40 border border-slate-600/40 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500/60 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-base shadow-inner"
              />
              <button
                onClick={addTodo}
                disabled={!isAuthenticated || loading || input.trim() === ''}
                className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
              >
                {loading ? 'Adding...' : 'Add'}
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
                <ul className="space-y-2.5">
                  {todos.map(todo => (
                    <li
                      key={todo.id}
                      className={`group flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 ${
                        todo.completed 
                          ? 'bg-slate-700/20 border-slate-600/20' 
                          : 'bg-slate-700/40 border-slate-600/40 hover:bg-slate-700/60 hover:border-slate-500/50'
                      }`}
                    >
                      <div className="relative flex-shrink-0">
                        <input
                          type="checkbox"
                          checked={todo.completed}
                          onChange={() => toggleTodo(todo.id)}
                          disabled={loading || !isAuthenticated}
                          className="w-5 h-5 rounded-md bg-slate-600/50 border-2 border-blue-500/60 accent-blue-600 focus:ring-2 focus:ring-blue-500/60 focus:ring-offset-2 focus:ring-offset-slate-800 cursor-pointer transition-all duration-200 checked:bg-blue-600 checked:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                      </div>
                      <span
                        className={`flex-1 transition-all duration-200 text-base ${
                          todo.completed
                            ? 'line-through text-slate-500'
                            : 'text-slate-100'
                        }`}
                      >
                        {todo.text}
                      </span>
                      <button
                        onClick={() => deleteTodo(todo.id)}
                        disabled={loading || !isAuthenticated}
                        className="opacity-0 group-hover:opacity-100 px-4 py-2 text-sm font-medium bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed border border-red-500/20 hover:border-red-500/40"
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
                
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
