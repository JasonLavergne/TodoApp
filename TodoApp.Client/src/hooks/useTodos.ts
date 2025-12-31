import { useState, useEffect, useMemo } from 'react'
import type { Todo } from '../types/todo'
import { API_BASE_URL, GUEST_WARNING_DISMISSED_KEY } from '../utils/constants'
import { getGuestTodos, saveGuestTodos } from '../utils/guestStorage'

interface UseTodosProps {
  isAuthenticated: boolean
  userId: string | undefined
}

export function useTodos({ isAuthenticated, userId }: UseTodosProps) {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editText, setEditText] = useState('')
  const [guestWarningDismissed, setGuestWarningDismissed] = useState(() => {
    try {
      return localStorage.getItem(GUEST_WARNING_DISMISSED_KEY) === 'true'
    } catch {
      return false
    }
  })

  useEffect(() => {
    if (isAuthenticated && userId) {
      loadTodos()
      setGuestWarningDismissed(false)
      try {
        localStorage.removeItem(GUEST_WARNING_DISMISSED_KEY)
      } catch (err) {
        console.error('Error clearing dismissed state:', err)
      }
    } else {
      const guestTodos = getGuestTodos()
      setTodos(guestTodos)
      try {
        const dismissed = localStorage.getItem(GUEST_WARNING_DISMISSED_KEY) === 'true'
        setGuestWarningDismissed(dismissed)
      } catch (err) {
        console.error('Error loading dismissed state:', err)
      }
    }
  }, [isAuthenticated, userId])

  const loadTodos = async () => {
    if (!userId) return

    setInitialLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_BASE_URL}/api/todo?userId=${userId}`)
      if (!response.ok) {
        throw new Error('Failed to load todos')
      }
      const data = await response.json()
      setTodos(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load todos')
      console.error('Error loading todos:', err)
    } finally {
      setInitialLoading(false)
    }
  }

  const addTodo = async (text: string) => {
    if (text.trim() === '') return
    
    if (!isAuthenticated || !userId) {
      const newTodo: Todo = {
        id: Date.now(),
        text: text.trim(),
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: null
      }
      const updatedTodos = [...todos, newTodo]
      setTodos(updatedTodos)
      saveGuestTodos(updatedTodos)
      return
    }
    
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_BASE_URL}/api/todo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: parseInt(userId),
          text: text.trim()
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create todo')
      }

      const newTodo = await response.json()
      setTodos([...todos, newTodo])
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

    if (!isAuthenticated || !userId) {
      const updatedTodos = todos.map(t => 
        t.id === id ? { ...t, completed: !t.completed, updatedAt: new Date().toISOString() } : t
      )
      setTodos(updatedTodos)
      saveGuestTodos(updatedTodos)
      return
    }

    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_BASE_URL}/api/todo/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: parseInt(userId),
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

    if (!isAuthenticated || !userId) {
      const updatedTodos = todos.map(t => 
        t.id === id ? { ...t, text: editText.trim(), updatedAt: new Date().toISOString() } : t
      )
      setTodos(updatedTodos)
      saveGuestTodos(updatedTodos)
      setEditingId(null)
      setEditText('')
      return
    }

    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_BASE_URL}/api/todo/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: parseInt(userId),
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

  const deleteTodo = async (id: number) => {
    if (!isAuthenticated || !userId) {
      const updatedTodos = todos.filter(todo => todo.id !== id)
      setTodos(updatedTodos)
      saveGuestTodos(updatedTodos)
      return
    }

    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_BASE_URL}/api/todo/${id}?userId=${userId}`, {
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

  const dismissGuestWarning = () => {
    setGuestWarningDismissed(true)
    try {
      localStorage.setItem(GUEST_WARNING_DISMISSED_KEY, 'true')
    } catch (err) {
      console.error('Error saving dismissed state:', err)
    }
  }

  const { activeTodos, completedTodos } = useMemo(() => {
    const active = todos.filter(todo => !todo.completed)
    const completed = todos.filter(todo => todo.completed)
    return { activeTodos: active, completedTodos: completed }
  }, [todos])

  return {
    todos,
    activeTodos,
    completedTodos,
    loading,
    initialLoading,
    error,
    editingId,
    editText,
    guestWarningDismissed,
    addTodo,
    toggleTodo,
    startEdit,
    cancelEdit,
    saveEdit,
    deleteTodo,
    dismissGuestWarning,
    setEditText
  }
}

