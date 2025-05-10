import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { spacesService } from '../services/spacesService'
import { useAuth } from '../context/AuthContext'
import './ManageSpaces.css'

function ManageSpaces() {
  const [spaces, setSpaces] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user } = useAuth()

  useEffect(() => {
    const fetchSpaces = async () => {
      try {
        const response = await spacesService.getSpaces()
        // Filter spaces owned by current user
        setSpaces(response.filter(space => space.owner_id === user.id))
      } catch (err) {
        setError(err.message || 'Failed to fetch spaces')
      } finally {
        setLoading(false)
      }
    }

    fetchSpaces()
  }, [user.id])

  const handleDeleteSpace = async (spaceId) => {
    if (window.confirm('Are you sure you want to delete this space?')) {
      try {
        await spacesService.deleteSpace(spaceId)
        setSpaces(spaces.filter(space => space.id !== spaceId))
      } catch (err) {
        setError(err.message || 'Failed to delete space')
      }
    }
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  return (
    <div className="manage-spaces-page">
      <div className="container">
        <div className="page-header">
          <h1>Manage Your Spaces</h1>
          <Link to="/spaces/new" className="btn btn-primary">
            Add New Space
          </Link>
        </div>

        {error && <div className="error-message">{error}</div>}

        <motion.div 
          className="spaces-grid"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {spaces.length > 0 ? (
            spaces.map(space => (
              <motion.div 
                key={space.id}
                className="space-card"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-image">
                  <img 
                    src={space.images?.[0]?.url || `https://via.placeholder.com/300x200`}
                    alt={space.name} 
                  />
                  <div className={`space-status ${space.status.toLowerCase()}`}>
                    {space.status}
                  </div>
                </div>

                <div className="space-details">
                  <h3>{space.name}</h3>
                  <p className="space-price">${space.price_per_hour}/hour</p>
                  
                  <div className="space-stats">
                    <div className="stat">
                      <span className="stat-label">Bookings</span>
                      <span className="stat-value">{space.total_bookings || 0}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Revenue</span>
                      <span className="stat-value">${space.total_revenue || 0}</span>
                    </div>
                  </div>

                  <div className="space-actions">
                    <Link 
                      to={`/spaces/${space.id}/edit`}
                      className="btn btn-secondary"
                    >
                      Edit
                    </Link>
                    <button 
                      onClick={() => handleDeleteSpace(space.id)}
                      className="btn btn-danger"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="no-spaces-message">
              <p>You haven't added any spaces yet.</p>
              <Link to="/spaces/new" className="btn btn-primary">
                Add Your First Space
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default ManageSpaces