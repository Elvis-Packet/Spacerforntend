import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { bookingsService } from '../services/bookingsService';
import './Dashboard.css';

function Dashboard() {
  const { user } = useAuth();
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalSpent: 0,
    upcomingBookings: 0
  });

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await bookingsService.getBookings(1, 5); // Get first 5 bookings
        
        // Ensure we have an array of bookings
        const bookings = response?.bookings || [];
        setRecentBookings(bookings);

        // Calculate stats only if we have bookings
        if (Array.isArray(bookings) && bookings.length > 0) {
          const stats = bookings.reduce((acc, booking) => ({
            totalBookings: acc.totalBookings + 1,
            totalSpent: acc.totalSpent + (booking.total_price || 0),
            upcomingBookings: acc.upcomingBookings + 
              (new Date(booking.start_time) > new Date() ? 1 : 0)
          }), {
            totalBookings: 0,
            totalSpent: 0,
            upcomingBookings: 0
          });
          setStats(stats);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
    return <div className="dashboard-loading">Loading...</div>;
  }

  if (error) {
    return <div className="dashboard-error">Error: {error}</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {user?.first_name || 'User'}</h1>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Bookings</h3>
          <p>{stats.totalBookings}</p>
        </div>
        <div className="stat-card">
          <h3>Total Spent</h3>
          <p>${stats.totalSpent.toFixed(2)}</p>
        </div>
        <div className="stat-card">
          <h3>Upcoming Bookings</h3>
          <p>{stats.upcomingBookings}</p>
        </div>
      </div>

      <div className="recent-bookings">
        <div className="section-header">
          <h2>Recent Bookings</h2>
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
                      <span className="date-value">
                        {new Date(booking.start_time).toLocaleString()}
                      </span>
                    </div>
                    <div className="booking-date">
                      <span className="date-label">To:</span>
                      <span className="date-value">
                        {new Date(booking.end_time).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="booking-meta">
                    <div className="booking-price">
                      ${booking.total_price?.toFixed(2)}
                    </div>
                    <div className={`booking-status ${booking.status}`}>
                      {booking.status}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-bookings">
            <p>You haven't made any bookings yet.</p>
            <Link to="/spaces" className="btn btn-primary">
              Browse Spaces
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;