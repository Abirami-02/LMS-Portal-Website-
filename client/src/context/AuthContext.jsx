import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { apiRequest } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('slp_user') || 'null'))
  const [token, setToken] = useState(() => localStorage.getItem('slp_token'))
  const [loading, setLoading] = useState(Boolean(token))

  const setSession = useCallback((session) => {
    setUser(session.user)
    setToken(session.token)
    localStorage.setItem('slp_user', JSON.stringify(session.user))
    localStorage.setItem('slp_token', session.token)
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('slp_user')
    localStorage.removeItem('slp_token')
  }, [])

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }
    apiRequest('/auth/me', { token })
      .then(({ user: currentUser }) => {
        setUser(currentUser)
        localStorage.setItem('slp_user', JSON.stringify(currentUser))
      })
      .catch(logout)
      .finally(() => setLoading(false))
  }, [logout, token])

  const login = useCallback(async (credentials) => {
    const session = await apiRequest('/auth/login', { method: 'POST', body: credentials })
    setSession(session)
    return session.user
  }, [setSession])

  const register = useCallback(async (details) => {
    const session = await apiRequest('/auth/register', { method: 'POST', body: details })
    setSession(session)
    return session.user
  }, [setSession])

  const value = useMemo(() => ({ user, token, loading, login, register, logout, setUser }), [user, token, loading, login, register, logout])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
