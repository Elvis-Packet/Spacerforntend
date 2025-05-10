import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import './Auth.css'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [formErrors, setFormErrors] = useState({})
  const { login, loading, error, isAuthenticated, clearError } = useAuth()
  
  // If already authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }
  
  const validateForm = () => {
    const errors = {}
    
    if (!email.trim()) {
      errors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid'
    }
    
    if (!password) {
      errors.password = 'Password is required'
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (clearError) clearError() // Add conditional check
    
    if (validateForm()) {
      try {
        await login(email, password)
      } catch (err) {
        console.error('Login error:', err)
      }
    }
  }
  
  return (
    <div className="auth-page">
      <div className="auth-container">
        <motion.div 
          className="auth-form-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in to your Spacer account</p>
          
          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}
          
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                id="email"
                className={`form-input ${formErrors.email ? 'error' : ''}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
              {formErrors.email && (
                <span className="form-error">{formErrors.email}</span>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                id="password"
                className={`form-input ${formErrors.password ? 'error' : ''}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
              {formErrors.password && (
                <span className="form-error">{formErrors.password}</span>
              )}
            </div>
            
            <button 
              type="submit" 
              className={`btn btn-primary btn-block ${loading ? 'btn-disabled' : ''}`}
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          
          <div className="auth-links">
            <p>
              Don't have an account? <Link to="/register">Sign up</Link>
            </p>
          </div>
        </motion.div>
        
        <motion.div 
          className="auth-image"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="auth-overlay"></div>
        </motion.div>
      </div>
    </div>
  )
}

export default Login