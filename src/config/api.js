export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export const getAuthHeader = () => {
  const token = localStorage.getItem('token')
  return {
    'Authorization': token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json',
  }
}

export const handleResponse = async (response) => {
  if (response.ok) {
    return response.json()
  }

  const error = await response.json()
  if (response.status === 401) {
    localStorage.removeItem('token')
    window.location.href = '/login'
  }
  throw new Error(error.message || 'Something went wrong')
}

export const api = {
  get: async (endpoint) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: getAuthHeader(),
    })
    return handleResponse(response)
  },

  post: async (endpoint, data) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(data),
    })
    return handleResponse(response)
  },

  put: async (endpoint, data) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: getAuthHeader(),
      body: JSON.stringify(data),
    })
    return handleResponse(response)
  },

  delete: async (endpoint) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    })
    return handleResponse(response)
  }
}