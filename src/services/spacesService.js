import { API_BASE_URL, handleResponse, getAuthHeader } from '../config/api';

export const spacesService = {
  getSpaces: async (page = 1, perPage = 10, status = '', type = '', city = '') => {
    let url = `${API_BASE_URL}/spaces/?page=${page}&per_page=${perPage}`;
    if (status) {
      url += `&status=${status}`;
    }
    if (type) {
      url += `&type=${type}`;
    }
    if (city) {
      url += `&city=${city}`;
    }
    const response = await fetch(url, {
      headers: {
        ...getAuthHeader(),
      },
    });
    return handleResponse(response);
  },

  getSpaceById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/spaces/${id}`, {
      headers: {
        ...getAuthHeader(),
      },
    });
    return handleResponse(response);
  },

  createSpace: async (spaceData) => {
    // Map user-friendly type to backend enum values
    const typeMapping = {
      'Meeting Room': 'meeting_room',
      'Event Space': 'event_space',
      'Coworking': 'coworking',
      'Studio': 'studio',
      'Other': 'other'
    };
    const mappedType = typeMapping[spaceData.type] || spaceData.type;
    const payload = { ...spaceData, type: mappedType };

    // Use FormData to support image upload with other data
    const formData = new FormData();
    for (const key in payload) {
      formData.append(key, payload[key]);
    }
    if (spaceData.images && spaceData.images.length > 0) {
      spaceData.images.forEach((imageFile) => {
        formData.append('images', imageFile);
      });
    }

    const response = await fetch(`${API_BASE_URL}/spaces/`, {
      method: 'POST',
      headers: {
        ...getAuthHeader(),
        // 'Content-Type' should NOT be set when sending FormData; browser sets it automatically
      },
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
    formData.append('images', imageFile);
    if (isPrimary) {
      formData.append('is_primary', 'true');
    }

    const response = await fetch(`${API_BASE_URL}/spaces/${spaceId}/images`, {
      method: 'POST',
      headers: {
        ...getAuthHeader(),
        // 'Content-Type' should NOT be set when sending FormData; browser sets it automatically
      },
      body: formData,
    });

    return handleResponse(response);
  }
};
