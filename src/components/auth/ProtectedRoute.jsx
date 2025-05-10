import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function ProtectedRoute({ children, roleRequired }) {
  const { isAuthenticated, loading, user } = useAuth()

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (roleRequired && user?.role !== roleRequired) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default ProtectedRoute