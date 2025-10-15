// Client-side token management utilities
export const storeAuthToken = (token) => {
  localStorage.setItem('authToken', token);
  // Optional: Can also set cookies if needed
  document.cookie = `token=${token}; path=/; max-age=86400`; // 1 day
};

export const clearAuthToken = () => {
  localStorage.removeItem('authToken');
  // Clear cookies too if used
  document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
};

export const getAuthToken = () => {
  return localStorage.getItem('authToken') || 
         document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
};