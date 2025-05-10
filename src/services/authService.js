import { API_BASE_URL, handleResponse, getAuthHeader } from '../config/api';

export const authService = {
  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    const data = await handleResponse(response);
    localStorage.setItem('token', data.access_token);
    return data;
  },

  register: async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          first_name: userData.first_name,
          last_name: userData.last_name,
          email: userData.email,
          password: userData.password,
          role: userData.role,
          phone_number: userData.phone_number || '',
          business_name: userData.business_name || ''
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      return data;
    } catch (error) {
      console.error('Registration error details:', error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  getCurrentUser: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getAuthHeader(),
    });
    return handleResponse(response);
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  getProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      headers: {
        ...getAuthHeader(),
      },
    });
    return handleResponse(response);
  },

  updateProfile: async (profileData) => {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(profileData),
    });
    return handleResponse(response);
  }
};
