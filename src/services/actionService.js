import api from './api';

export const actionService = {
  // Send interest to a user
  sendInterest: async (receiverId) => {
    const response = await api.post(`/userActions/interest/send/${receiverId}`, {});
    return response.data;
  },

  // Get user interests (if needed)
  getUserInterests: async () => {
    const response = await api.get('/userActions/interests');
    return response.data;
  }
};
