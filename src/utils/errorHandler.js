export const handleError = (error) => {
  if (error.response) {
    // Server responded with error status
    return error.response.data.message || 'Something went wrong';
  } else if (error.request) {
    // Request made but no response
    return 'Network error. Please check your connection.';
  } else {
    // Request setup error
    return error.message || 'An error occurred';
  }
};