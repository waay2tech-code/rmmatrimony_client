// src/services/memberIdService.js
import api from './api';

export const memberIdService = {
  /**
   * Get member ID statistics (admin only)
   */
  getStats: async () => {
    try {
      const response = await api.get('/memberid/stats');
      return response.data;
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Failed to get member ID statistics',
        status: error.response?.status
      };
    }
  },

  /**
   * Migrate all existing users without member IDs (admin only)
   */
  migrateAllUsers: async () => {
    try {
      const response = await api.post('/memberid/migrate');
      return response.data;
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Failed to start migration',
        status: error.response?.status
      };
    }
  },

  /**
   * Get users without member IDs (admin only)
   */
  getUsersWithoutMemberID: async (page = 1, limit = 10) => {
    try {
      const response = await api.get(`/memberid/users-without?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Failed to get users without member IDs',
        status: error.response?.status
      };
    }
  },

  /**
   * Generate member ID for a specific user (admin only)
   */
  generateMemberIDForUser: async (userId) => {
    try {
      const response = await api.post(`/memberid/generate/${userId}`);
      return response.data;
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Failed to generate member ID',
        status: error.response?.status
      };
    }
  },

  /**
   * Validate member ID format (admin only)
   */
  validateMemberID: async (memberid) => {
    try {
      const response = await api.get(`/memberid/validate/${memberid}`);
      return response.data;
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Failed to validate member ID',
        status: error.response?.status
      };
    }
  }
};

// Export individual functions for convenience
export const {
  getStats,
  migrateAllUsers,
  getUsersWithoutMemberID,
  generateMemberIDForUser,
  validateMemberID
} = memberIdService;

export default memberIdService;