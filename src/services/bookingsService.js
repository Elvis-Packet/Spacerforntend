import { API_BASE_URL, handleResponse, getAuthHeader } from '../config/api';

export const bookingsService = {
  getBookings: async (page = 1, perPage = 10) => {
    const response = await fetch(
      `${API_BASE_URL}/bookings?page=${page}&per_page=${perPage}`, {
      headers: getAuthHeader(),
    });
    return handleResponse(response);
  },

  getBookingById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
      headers: {
        ...getAuthHeader(),
      },
    });
    return handleResponse(response);
  },

  createBooking: async (bookingData) => {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(bookingData),
    });
    return handleResponse(response);
  },

  cancelBooking: async (bookingId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/cancel`, {
        method: 'POST',
        headers: getAuthHeader()
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to cancel booking');
      }

      return data;
    } catch (error) {
      console.error('Cancel booking error:', error);
      throw error;
    }
  },

  processPayment: async (bookingId, paymentData) => {
    const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(paymentData),
    });
    return handleResponse(response);
  }
};
