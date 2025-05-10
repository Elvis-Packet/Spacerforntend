import { API_BASE_URL, handleResponse, getAuthHeader } from '../config/api';

export const testimonialsService = {
  getTestimonials: async (page = 1, perPage = 10) => {
    const response = await fetch(
      `${API_BASE_URL}/testimonials?page=${page}&per_page=${perPage}`, {
      headers: getAuthHeader(),
    });
    return handleResponse(response);
  },

  addTestimonial: async (testimonialData) => {
    const response = await fetch(`${API_BASE_URL}/testimonials`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(testimonialData),
    });
    return handleResponse(response);
  }
};
