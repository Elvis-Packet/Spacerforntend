import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { spacesService } from '../services/spacesService'
import { bookingsService } from '../services/bookingsService'
import './Dashboard.css'

function Dashboard() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [recentBookings, setRecentBookings] = useState([])
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        
        // Note: In a real app, you would fetch from a user-specific endpoint
        // For this demo, we're fetching real bookings from the backend
        const bookings = await bookingsService.getBookings()
        setRecentBookings(bookings)
      } catch (err) {
        setError('Failed to load dashboard data')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchDashboardData()
  }, [])
  
  // Format date for display
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4
      }
    }
  }
  
  return (
    <div className="dashboard-page">
      <div className="container">
        <div className="dashboard-header">
          <motion.h1 
            className="dashboard-title"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Dashboard
          </motion.h1>
          <motion.p 
            className="dashboard-welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Welcome back, User #{user?.id || 'User'}
          </motion.p>
        </div>
        
        {loading ? (
          <div className="loading">
            <div className="loading-spinner"></div>
          </div>
        ) : error ? (
          <div className="error-message">
            {error}
          </div>
        ) : (
          <div className="dashboard-content">
            <motion.div 
              className="dashboard-stats"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div className="stat-card" variants={itemVariants}>
                <div className="stat-icon">🏠</div>
                <div className="stat-value">{recentBookings.length}</div>
                <div className="stat-label">Active Bookings</div>
              </motion.div>
              
              <motion.div className="stat-card" variants={itemVariants}>
                <div className="stat-icon">✅</div>
                <div className="stat-value">10</div>
                <div className="stat-label">Completed Bookings</div>
              </motion.div>
              
              <motion.div className="stat-card" variants={itemVariants}>
                <div className="stat-icon">💰</div>
                <div className="stat-value">
                  ${recentBookings.reduce((sum, booking) => sum + booking.total_cost, 0).toFixed(2)}
                </div>
                <div className="stat-label">Total Spent</div>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="dashboard-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="section-header">
                <h2 className="section-title">Recent Bookings</h2>
                <Link to="/bookings" className="view-all-link">
                  View All <span className="arrow">→</span>
                </Link>
              </div>
              
              {recentBookings.length > 0 ? (
                <div className="bookings-list">
                  {recentBookings.map((booking) => (
                    <div key={booking.id} className="booking-card">
                      <div className="booking-info">
                        <h3 className="booking-space-name">{booking.space_name}</h3>
                        <div className="booking-dates">
                          <div className="booking-date">
                            <span className="date-label">From:</span>
                            <span className="date-value">{formatDate(booking.start_time)}</span>
                          </div>
                          <div className="booking-date">
                            <span className="date-label">To:</span>
                            <span className="date-value">{formatDate(booking.end_time)}</span>
                          </div>
                        </div>
                        <div className="booking-meta">
                          <div className="booking-price">${booking.total_cost.toFixed(2)}</div>
                          <div className={`booking-status ${booking.status}`}>{booking.status}</div>
                        </div>
                      </div>
                      <Link to={`/spaces/${booking.space_id}`} className="btn btn-secondary btn-small">
                        View Space
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-bookings">
                  <p>You don't have any bookings yet.</p>
                  <Link to="/spaces" className="btn btn-primary">
                    Browse Spaces
                  </Link>
                </div>
              )}
            </motion.div>
            
            <motion.div 
              className="dashboard-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="section-header">
                <h2 className="section-title">Account Information</h2>
              </div>
              
              <div className="account-info-card">
                <div className="account-info-row">
                  <span className="info-label">User ID:</span>
                  <span className="info-value">{user?.id || 'N/A'}</span>
                </div>
                <div className="account-info-row">
                  <span className="info-label">Account Type:</span>
                  <span className="info-value">{user?.role === 'SPACE_OWNER' ? 'Space Owner' : 'Client'}</span>
                </div>
                <div className="account-info-row">
                  <span className="info-label">Member Since:</span>
                  <span className="info-value">{new Date().toLocaleDateString()}</span>
                </div>
                
                <div className="account-actions">
                  <button className="btn btn-outline btn-small">
                    Edit Profile
                  </button>
                  <button className="btn btn-outline btn-small">
                    Change Password
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard