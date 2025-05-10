import { useState, useEffect } from 'react'
import { spacesService } from '../../services/spacesService'
import { useAuth } from '../../context/AuthContext'

function ManageSpaces() {
  const [spaces, setSpaces] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user } = useAuth()

  useEffect(() => {
    const fetchSpaces = async () => {
      try {
        const response = await spacesService.getSpaces()
        setSpaces(response.data.filter(space => space.ownerId === user.id))
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchSpaces()
  }, [user.id])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="manage-spaces">
      <h1>Manage Your Spaces</h1>
      <div className="spaces-grid">
        {spaces.map(space => (
          <div key={space.id} className="space-card">
            <img src={space.primaryImage} alt={space.name} />
            <h3>{space.name}</h3>
            <p>{space.description}</p>
            <div className="space-actions">
              <button onClick={() => handleEdit(space.id)}>Edit</button>
              <button onClick={() => handleDelete(space.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ManageSpaces