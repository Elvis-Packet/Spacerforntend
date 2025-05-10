import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { motion } from 'framer-motion'
import './Header.css'

function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { isAuthenticated, user, logout } = useAuth()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    setIsMenuOpen(false)
  }
  
  // Handle scroll events to change header style
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }
    
    window.addEventListener('scroll', handleScroll)
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])
  
  // Close menu when changing routes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [location.pathname])
  
  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container header-container">
        <Link to="/" className="logo">
          <span className="logo-text">Spacer</span>
        </Link>
        
        <button 
          className={`menu-toggle ${isMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        
        <nav className={`navigation ${isMenuOpen ? 'open' : ''}`}>
          <ul className="nav-list">
            <li className="nav-item">
              <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/spaces" className={location.pathname.includes('/spaces') ? 'active' : ''}>
                Spaces
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/testimonials" className={location.pathname === '/testimonials' ? 'active' : ''}>
                Testimonials
              </Link>
            </li>
            
            {isAuthenticated ? (
              <>
                <li className="nav-item">
                  <Link to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''}>
                    Dashboard
                  </Link>
                </li>
                {user?.role === 'SPACE_OWNER' && (
                  <li className="nav-item">
                    <Link to="/manage-spaces" className={location.pathname === '/manage-spaces' ? 'active' : ''}>
                      Manage Spaces
                    </Link>
                  </li>
                )}
                <li className="nav-item">
                  <Link to="/bookings" className={location.pathname === '/bookings' ? 'active' : ''}>
                    My Bookings
                  </Link>
                </li>
                <li className="nav-item">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="logout-btn"
                    onClick={handleLogout}
                  >
                    Logout
                  </motion.button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link to="/login" className={location.pathname === '/login' ? 'active' : ''}>
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/register" className="register-btn">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header