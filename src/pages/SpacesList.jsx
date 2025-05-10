import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { spacesService } from '../services/spacesService';
import './SpacesList.css';

function SpacesList() {
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('available');

  const fetchSpaces = async () => {
    try {
      setLoading(true);
      const { spaces, totalCount } = await spacesService.getSpaces(page, 9, statusFilter);
      setSpaces(spaces);
      setTotalPages(Math.ceil(totalCount / 9) || 1);
    } catch (err) {
      setError('Failed to fetch spaces');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // const handleBook = async (spaceId) => {
  //   try {
  //     await spacesService.bookSpace(spaceId);
  //     fetchSpaces();
  //   } catch (err) {
  //     console.error('Booking failed:', err);
  //   }
  // };

  useEffect(() => {
    fetchSpaces();
  }, [page, statusFilter]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo(0, 0);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4 },
    },
  };

  return (
    <div className="spaces-page">
      <div className="container">
        <div className="spaces-header">
          <h1 className="spaces-title">Available Spaces</h1>
          <p className="spaces-subtitle">Find and book the perfect space for your needs</p>

          <div className="filter-container">
            <select
              className="filter-select"
              value={statusFilter}
              onChange={(e) => {
                setPage(1);
                setStatusFilter(e.target.value);
              }}
            >
              <option value="available">Available Spaces</option>
              <option value="booked">Booked Spaces</option>
              <option value="">All Spaces</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="loading">
            <div className="loading-spinner"></div>
          </div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <>
            <motion.div
              className="spaces-grid"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {spaces.length > 0 ? (
                spaces.map((space) => (
                  <motion.div key={space.id} className="space-card" variants={itemVariants}>
                    <div className="space-image">
                      <img
                        src={space.images?.[0]?.image_url || `https://via.placeholder.com/300x200`}
                        alt={space.name}
                      />
                      <div className="space-status">{space.status}</div>
                    </div>
                    <div className="space-details">
                      <h3 className="space-name">{space.name}</h3>
                      <div className="space-info">
                        <span className="space-price">${space.price_per_hour}/hour</span>
                      </div>
                      <Link to={`/spaces/${space.id}`} className="btn btn-primary btn-small">
                        View Details
                      </Link>
                      {/* {statusFilter === 'available' && (
                        <button
                          className="btn btn-secondary btn-small"
                          onClick={() => handleBook(space.id)}
                        >
                          Book Now
                        </button>
                      )} */}
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="no-spaces">
                  <p>No spaces found.</p>
                </div>
              )}
            </motion.div>

            {spaces.length > 0 && (
              <div className="pagination">
                <button
                  className="pagination-btn"
                  disabled={page === 1}
                  onClick={() => handlePageChange(page - 1)}
                >
                  Previous
                </button>
                <span className="page-info">
                  Page {page} of {totalPages}
                </span>
                <button
                  className="pagination-btn"
                  disabled={page === totalPages}
                  onClick={() => handlePageChange(page + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default SpacesList;
