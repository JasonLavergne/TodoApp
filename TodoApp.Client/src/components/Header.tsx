import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

export function Header() {
  const { user, login, register, logout, isAuthenticated, loading, error } = useAuth()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [isRegisterMode, setIsRegisterMode] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await login(email, password)
      setEmail('')
      setPassword('')
      setShowLoginModal(false)
    } catch (err) {
      console.error('Login failed:', err)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await register(name, email, password)
      setName('')
      setEmail('')
      setPassword('')
      setShowLoginModal(false)
      setIsRegisterMode(false)
    } catch (err) {
      console.error('Registration failed:', err)
    }
  }

  const resetForm = () => {
    setName('')
    setEmail('')
    setPassword('')
    setIsRegisterMode(false)
  }

  const handleLogout = async () => {
    await logout()
    setShowProfileMenu(false)
  }

  return (
    <>
      <header className="fixed top-0 right-0 left-0 z-50 bg-slate-900/70 backdrop-blur-xl border-b border-slate-700/50">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="relative flex justify-between items-center h-16 lg:grid lg:grid-cols-3">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-100 tracking-tight lg:justify-self-center lg:col-start-2">
              My Tasks
            </h1>
            <div className="lg:justify-self-end lg:col-start-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/40 transition-all duration-200 hover:border-slate-600/50"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                    {user?.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-slate-100 font-medium hidden sm:block">
                    {user?.name}
                  </span>
                  <svg
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showProfileMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowProfileMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-slate-800/95 backdrop-blur-xl rounded-xl border border-slate-700/50 overflow-hidden z-20">
                      <div className="px-4 py-3 border-b border-slate-700/50">
                        <p className="text-sm font-semibold text-slate-100">{user?.name}</p>
                        <p className="text-sm text-slate-400 truncate mt-0.5">{user?.email}</p>
                      </div>
                      <div className="py-1">
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors duration-150 font-medium"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-200"
              >
                Login
              </button>
            )}
            </div>
          </div>
        </div>
      </header>

      {showLoginModal && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onMouseDown={() => {
              setShowLoginModal(false)
              resetForm()
            }}
          >
            <div
              className="bg-slate-800/95 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-6 sm:p-8 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-100">
                  {isRegisterMode ? 'Register' : 'Login'}
                </h2>
                <button
                  onMouseDown={() => {
                    setShowLoginModal(false)
                    resetForm()
                  }}
                  className="text-slate-400 hover:text-slate-100 transition-colors duration-200 p-1 hover:bg-slate-700/50 rounded-lg"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={isRegisterMode ? handleRegister : handleLogin} className="space-y-5">
                {error && (
                  <div className="px-4 py-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 text-sm font-medium backdrop-blur-sm">
                    {error}
                  </div>
                )}

                {isRegisterMode && (
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-slate-300 mb-2.5">
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full px-4 py-2.5 bg-slate-700/40 border border-slate-600/40 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500/60 transition-all duration-200 shadow-inner"
                      required
                      disabled={loading}
                    />
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-slate-300 mb-2.5">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-2.5 bg-slate-700/40 border border-slate-600/40 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500/60 transition-all duration-200 shadow-inner"
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-slate-300 mb-2.5">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={isRegisterMode ? "Enter your password (min. 6 characters)" : "Enter your password"}
                    className="w-full px-4 py-2.5 bg-slate-700/40 border border-slate-600/40 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500/60 transition-all duration-200 shadow-inner"
                    required
                    disabled={loading}
                    minLength={isRegisterMode ? 6 : undefined}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600 mt-2.5"
                >
                  {loading 
                    ? (isRegisterMode ? 'Registering...' : 'Logging in...') 
                    : (isRegisterMode ? 'Register' : 'Login')}
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsRegisterMode(!isRegisterMode)
                      setName('')
                      setEmail('')
                      setPassword('')
                    }}
                    className="text-sm text-slate-400 hover:text-blue-400 transition-colors duration-200 font-medium"
                  >
                    {isRegisterMode 
                      ? 'Already have an account? Login' 
                      : "Don't have an account? Register"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  )
}

