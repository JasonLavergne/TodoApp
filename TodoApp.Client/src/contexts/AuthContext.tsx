import { createContext, useContext, useState, ReactNode } from 'react'

interface User {
  id: string
  name: string
  email: string
  token?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5062'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    // Try to restore user from localStorage
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      try {
        return JSON.parse(savedUser)
      } catch {
        return null
      }
    }
    return null
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Login failed' }))
        throw new Error(errorData.message || 'Login failed')
      }

      const userData = await response.json()
      const user: User = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        token: userData.token,
      }
      
      setUser(user)
      localStorage.setItem('user', JSON.stringify(user))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      // Call logout endpoint if you want server-side logout
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
    } catch (err) {
      // Even if API call fails, clear local state
      console.error('Logout API call failed:', err)
    } finally {
      setUser(null)
      localStorage.removeItem('user')
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, loading, error }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
