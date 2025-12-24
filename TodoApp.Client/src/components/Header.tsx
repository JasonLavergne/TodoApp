import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

export function Header() {
  const { user, login, logout, isAuthenticated, loading, error } = useAuth()
  const [showLoginModal, setShowLoginModal] = useState(false)
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
      // Error is already set in context, it will be displayed
      console.error('Login failed:', err)
    }
  }

  const handleLogout = async () => {
    await logout()
    setShowProfileMenu(false)
  }

  return (
    <>
      <header className="fixed top-0 right-0 left-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-end items-center h-16">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/50 transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center text-white font-semibold text-sm">
                    {user?.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-slate-200 font-medium hidden sm:block">
                    {user?.name}
                  </span>
                  <svg
                    className={`w-4 h-4 text-slate-400 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`}
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
                    <div className="absolute right-0 mt-2 w-56 bg-slate-800 rounded-xl shadow-xl border border-slate-700/50 overflow-hidden z-20">
                      <div className="px-4 py-3 border-b border-slate-700/50">
                        <p className="text-sm font-medium text-slate-200">{user?.name}</p>
                        <p className="text-sm text-slate-400 truncate">{user?.email}</p>
                      </div>
                      <div className="py-1">
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-700/50 transition-colors"
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
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-blue-500 hover:to-cyan-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 active:scale-95"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </header>

      {showLoginModal && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => {
              setShowLoginModal(false)
              setEmail('')
              setPassword('')
            }}
          >
            <div
              className="bg-slate-800 rounded-2xl shadow-xl border border-slate-700/50 p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-200">Login</h2>
                <button
                  onClick={() => {
                    setShowLoginModal(false)
                    setEmail('')
                    setPassword('')
                  }}
                  className="text-slate-400 hover:text-slate-200 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                {error && (
                  <div className="px-4 py-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                    required
                    disabled={loading}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-blue-500 hover:to-cyan-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  )
}

