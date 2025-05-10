import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  Pagination,
  Alert,
  Snackbar
} from '@mui/material';
import { bookingsService } from '../services/bookingsService';
import { useAuth } from '../context/AuthContext';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchBookings = async (pageNumber) => {
    setLoading(true);
    setError(null);
    try {
      const data = await bookingsService.getBookings(pageNumber, 10);
      setBookings(data?.bookings || []);
      setTotalPages(data?.pages || 1);
      setPage(data?.current_page || 1);
    } catch (err) {
      setError(err.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings(page);
  }, [page]);

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      setLoading(true);
      await bookingsService.cancelBooking(bookingId);
      await fetchBookings(page); // Refresh the bookings list
      setError({ message: 'Booking cancelled successfully', type: 'success' });
    } catch (err) {
      setError({ message: err.message || 'Failed to cancel booking', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const canCancelBooking = (booking) => {
    // Only allow cancellation if:
    // 1. Booking exists and has a status
    // 2. Booking is not already cancelled or completed
    // 3. User owns the booking OR is an admin OR is the space owner
    return (
      booking &&
      booking.status &&
      booking.status !== 'cancelled' &&
      booking.status !== 'completed' &&
      (
        booking.user_id === user?.id ||
        user?.role === 'admin' ||
        (user?.role === 'owner' && booking.space_owner_id === user?.id)
      )
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        My Bookings
      </Typography>

      {error && (
        <Snackbar 
          open={!!error} 
          autoHideDuration={6000} 
          onClose={() => setError(null)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert 
            onClose={() => setError(null)} 
            severity={error.type || 'error'}
            variant="filled"
          >
            {error.message}
          </Alert>
        </Snackbar>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : bookings.length === 0 ? (
        <Typography>No bookings found.</Typography>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Space</TableCell>
                  <TableCell>Start Time</TableCell>
                  <TableCell>End Time</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Total Amount</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>{booking.space_name || booking.space_id}</TableCell>
                    <TableCell>{new Date(booking.start_time).toLocaleString()}</TableCell>
                    <TableCell>{new Date(booking.end_time).toLocaleString()}</TableCell>
                    <TableCell>{booking.status}</TableCell>
                    <TableCell>${(booking.total_price || 0).toFixed(2)}</TableCell>
                    <TableCell>
                      {canCancelBooking(booking) && (
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => handleCancel(booking.id)}
                        >
                          Cancel
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(e, value) => setPage(value)}
            />
          </Box>
        </>
      )}
    </Box>
  );
};

export default Bookings;
