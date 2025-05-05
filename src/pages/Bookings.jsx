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
} from '@mui/material';
import { bookingsService } from '../services/bookingsService';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const fetchBookings = async (pageNumber) => {
    setLoading(true);
    try {
      const data = await bookingsService.getBookings(pageNumber, 10);
      setBookings(data?.bookings || []);
      setTotalPages(data?.pages || 1);
      setPage(data?.current_page || 1);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
      setBookings([]);
      setTotalPages(1);
      setPage(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings(page);
  }, [page]);

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await bookingsService.cancelBooking(bookingId);
      fetchBookings(page);
    } catch (error) {
      console.error('Failed to cancel booking:', error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        My Bookings
      </Typography>

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
                    <TableCell>{booking.space_id}</TableCell>
                    <TableCell>{new Date(booking.start_time).toLocaleString()}</TableCell>
                    <TableCell>{new Date(booking.end_time).toLocaleString()}</TableCell>
                    <TableCell>{booking.status}</TableCell>
                    <TableCell>${booking.total_amount.toFixed(2)}</TableCell>
                    <TableCell>
                      {booking.status !== 'cancelled' && booking.status !== 'completed' && (
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
