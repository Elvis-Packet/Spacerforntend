import { createContext, useContext, useState, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
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
  
  // Check if token exists in localStorage and is valid
  const checkAuthStatus = useCallback(() => {
    setLoading(true)
    const token = localStorage.getItem('token')
    console.log('checkAuthStatus token:', token)
    
      if (token) {
        try {
          // Decode token to get user info
          const decoded = jwtDecode(token)
          const currentTime = Date.now() / 1000

          // Check if token is expired
          if (decoded.exp && decoded.exp < currentTime) {
            localStorage.removeItem('token')
            setUser(null)
          } else {
            setUser({ 
              id: decoded.sub || decoded.id || decoded.user_id,
              role: decoded.role || 'CLIENT'
            })
          }
        } catch (err) {
          console.error('Invalid token', err)
          localStorage.removeItem('token')
          setUser(null)
        }
      } else {
        setUser(null)
      }
    
    setLoading(false)
  }, [])
  
  // Login function
  const login = useCallback(async (email, password) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await authService.login({ email, password })
      const { access_token } = response
      console.log('login received access_token:', access_token)
      
      // Save token to localStorage
      localStorage.setItem('token', access_token)
      
      // Decode token to get user info including role
      const decoded = jwtDecode(access_token)
      setUser({ 
        id: decoded.sub || decoded.id || decoded.user_id,
        role: decoded.role || 'CLIENT'
      })
      
      navigate('/dashboard')
      return true
    } catch (err) {
      setError(err.message || 'Login failed')
      return false
    } finally {
      setLoading(false)
    }
  }, [navigate])
  
  // Register function
  const register = useCallback(async (email, password, first_name, last_name, role = 'CLIENT') => {
    setLoading(true)
    setError(null)
    
    try {
      // Ensure role is uppercase to match backend enum
      const roleUpper = role.toUpperCase()
      await authService.register({ email, password, first_name, last_name, role: roleUpper })
      
      // Auto login after successful registration
      return await login(email, password)
    } catch (err) {
      setError(err.message || 'Registration failed')
      return false
    } finally {
      setLoading(false)
    }
  }, [login])
  
  // Logout function
  const logout = useCallback(() => {
    localStorage.removeItem('token')
    setUser(null)
    navigate('/')
  }, [navigate])
  
  // Clear any auth errors
  const clearError = useCallback(() => {
    setError(null)
  }, [])
  
  // Value object that will be passed to consumers
  const value = useMemo(() => ({
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    checkAuthStatus,
    clearError
  }), [user, loading, error, login, register, logout, checkAuthStatus, clearError])
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}