import { createContext, useContext, useState, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/authService'

const AuthContext = createContext(null)

export function useAuth() {
  const context = useContext(AuthContext)
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  
  return context
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const clearError = useCallback(() => {
    setError(null)
  }, [])
  
  const checkAuthStatus = useCallback(async () => {
    setLoading(true)
    const token = localStorage.getItem('token')
    
    if (token) {
      try {
        // Verify token with backend
        const userData = await authService.getCurrentUser()
        setUser(userData)
      } catch (err) {
        console.error('Auth check failed:', err)
        localStorage.removeItem('token')
        setUser(null)
      }
    }
    setLoading(false)
  }, [])
  
  const register = useCallback(async (userData) => {
    setLoading(true)
    setError(null)
    try {
      const response = await authService.register(userData)
      return response
    } catch (err) {
      const errorMessage = err.message || 'Registration failed'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  const login = useCallback(async (email, password) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await authService.login({ email, password })
      localStorage.setItem('token', response.access_token)
      const userData = await authService.getCurrentUser()
      setUser(userData)
      navigate('/dashboard')
      return true
    } catch (err) {
      setError(err.message || 'Login failed')
      return false
    } finally {
      setLoading(false)
    }
  }, [navigate])
  
  const logout = useCallback(() => {
    authService.logout()
    setUser(null)
    navigate('/')
  }, [navigate])
  
  const value = useMemo(() => ({
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    logout,
    checkAuthStatus,
    register,
    clearError
  }), [user, loading, error, login, logout, checkAuthStatus, register, clearError])
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}