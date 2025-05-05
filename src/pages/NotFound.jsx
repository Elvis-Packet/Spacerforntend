import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import './NotFound.css'

function NotFound() {
  return (
    <div className="not-found-page">
      <div className="container">
        <motion.div 
          className="not-found-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="not-found-title">404</h1>
          <p className="not-found-subtitle">Page Not Found</p>
          <p className="not-found-message">
            The page you are looking for might have been removed,
            had its name changed, or is temporarily unavailable.
          </p>
          <Link to="/" className="btn btn-primary">
            Go Home
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

export default NotFound