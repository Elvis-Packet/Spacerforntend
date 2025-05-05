import { API_BASE_URL, handleResponse, getAuthHeader } from '../config/api';

export const bookingsService = {
  getBookings: async (page = 1, perPage = 10) => {
    const url = `${API_BASE_URL}/bookings/?page=${page}&per_page=${perPage}`;
    const response = await fetch(url, {
      headers: {
        ...getAuthHeader(),
      },
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
    const response = await fetch(`${API_BASE_URL}/bookings/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(bookingData),
    });
    return handleResponse(response);
  },

  cancelBooking: async (bookingId, reason = '') => {
    const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/cancel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({ reason }),
    });
    return handleResponse(response);
  }
};
