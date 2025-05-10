import { API_BASE_URL, handleResponse, getAuthHeader } from '../config/api';

export const spacesService = {
  getSpaces: async (page = 1, perPage = 10, filters = {}) => {
    const queryParams = new URLSearchParams({
      page: page,
      per_page: perPage,
      ...filters
    });
    
    const response = await fetch(`${API_BASE_URL}/spaces?${queryParams}`, {
      headers: getAuthHeader(),
    });
    return handleResponse(response);
  },

  getSpaceById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/spaces/${id}`, {
      headers: getAuthHeader(),
    });
    return handleResponse(response);
  },

  createSpace: async (spaceData) => {
    const formData = new FormData();
    Object.keys(spaceData).forEach(key => {
      if (key === 'images') {
        spaceData.images.forEach(image => {
          formData.append('images', image);
        });
      } else {
        formData.append(key, spaceData[key]);
      }
    });

    const response = await fetch(`${API_BASE_URL}/spaces`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: formData,
    });
    return handleResponse(response);
  },

  updateSpace: async (id, spaceData) => {
    // Use FormData to support image upload with other data
    const formData = new FormData();
    for (const key in spaceData) {
      if (key !== 'images' && key !== 'deleted_image_ids') {
        formData.append(key, spaceData[key]);
      }
    }
    if (spaceData.images && spaceData.images.length > 0) {
      spaceData.images.forEach((imageFile) => {
        formData.append('images', imageFile);
      });
    }
    if (spaceData.deleted_image_ids && spaceData.deleted_image_ids.length > 0) {
      spaceData.deleted_image_ids.forEach((id) => {
        formData.append('deleted_image_ids', id);
      });
    }
    if (spaceData.primary_image_id) {
      formData.append('primary_image_id', spaceData.primary_image_id);
    }

    const response = await fetch(`${API_BASE_URL}/spaces/${id}`, {
      method: 'PUT',
      headers: {
        ...getAuthHeader(),
        // 'Content-Type' should NOT be set when sending FormData; browser sets it automatically
      },
      body: formData,
    });
    return handleResponse(response);
  },

  deleteSpace: async (id) => {
    const response = await fetch(`${API_BASE_URL}/spaces/${id}`, {
      method: 'DELETE',
      headers: {
        ...getAuthHeader(),
      },
    });
    return handleResponse(response);
  },

  uploadSpaceImage: async (spaceId, imageFile, isPrimary = false) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('is_primary', isPrimary);

    const response = await fetch(`${API_BASE_URL}/spaces/${spaceId}/images`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: formData,
    });
    return handleResponse(response);
  }
};
