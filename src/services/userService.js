// src/services/userService.js
import api from './api';

export const userService = {
  // Get current user profile
  getProfile: async () => {
    try {
      const response = await api.get('/users/profile');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  //admin
  admingetProfile: async (id) => {
    try {
      const response = await api.get(`/users/admingetprofile/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get admin users
  getAllAdminUsers: async () => {
    try {
      const response = await api.get('/users/adminusers');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get user profile type (for premium check)
  getProfileType: async () => {
    try {
      const response = await api.get('/users/profile-type');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get user profile by ID (for viewing other users' profiles)
  getUserById: async (id) => {
    try {
      const response = await api.get(`/users/profile/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get user gallery by ID
  getUserGallery: async (userId) => {
    try {
      const response = await api.get(`/users/gallery/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update user profile
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/users/profile', profileData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update user profile
  adminupdateProfile: async (profileData,id) => {
    try {
      const response = await api.put(`/users/admin-update-profile/${id}`, profileData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get matches/recommendations
  getMatches: async () => {
    try {
      const response = await api.get('/users/matches');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get all users with filters (for search page)
  getAllUsers: async (filters = {}) => {
    try {
      console.log("📡 API call to /matches/search with filters:", filters);
      const response = await api.get('/matches/search', { params: filters });
      console.log("✅ API response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ API error:", error);
      throw error;
    }
  },

  // Like/unlike a profile
  toggleLike: async (profileId) => {
    try {
      const response = await api.post(`/users/like/${profileId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Upload photo to gallery
  uploadPhoto: async (formData) => {
    try {
      const response = await api.post('/users/upload-photo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  adminuploadPhoto: async (formData,id) => {
    try {
      const response = await api.post(`/users/admin-upload-photo/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete photo from gallery
  deletePhoto: async (photoUrl) => {
    try {
      const response = await api.delete('/users/delete-photo', {
        data: { photoUrl },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  admindeletePhoto: async (photoUrl,id) => {
    try {
      const response = await api.delete(`/users/admin-delete-photo/${id}`, {
        data: { photoUrl },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get notifications
  getNotifications: async () => {
    try {
      const response = await api.get('/users/notifications');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Send interest to a user
  sendInterest: async (receiverId) => {
    try {
      const response = await api.post(`/userActions/interest/send/${receiverId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Mark notification as read
  markNotificationAsRead: async (notificationId) => {
    try {
      const response = await api.put(`/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete notification
  deleteNotification: async (notificationId) => {
    try {
      const response = await api.delete(`/notifications/${notificationId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

   // Get current user profile
   getCurrentUser: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },
   // Get user profile type (premium check)
   getUserProfileType: async () => {
    const response = await api.get('/users/profile-type');
    return response.data;
  },

  // Get all users with filters
//   getAllUsers: async (filters = {}) => {
//     const params = {};
//     Object.entries(filters).forEach(([key, value]) => {
//       if (value) params[key] = value;
//     });
    
//     const response = await api.get('/users/allusers', { params });
//     return response.data;
//   },
   // Like/unlike a profile
//    toggleLike: async (profileId) => {
//     const response = await api.post(`/users/like/${profileId}`, {});
//     return response.data;
//   }


updateUserByAdmin: async (userId, userData) => {
  try {
    const response = await api.put(`/users/adminedit/${userId}`, userData);
    return response.data;
  } catch (error) {
    throw error;
  }
},

// Delete user by admin
deleteUserByAdmin: async (userId) => {
  try {
    const response = await api.delete(`/users/admindelete/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
},
};

// Export individual functions for backward compatibility
export const {
    updateUserByAdmin,
    deleteUserByAdmin,
    getAllAdminUsers,
  getProfile,
  getProfileType,
  getUserById,
  getUserGallery,
  updateProfile,
  getMatches,
  getAllUsers,
  toggleLike,
  uploadPhoto,
  deletePhoto,
  getNotifications,
  sendInterest,
  markNotificationAsRead,
  deleteNotification,
  getCurrentUser,
  getUserProfileType,
 
} = userService;

// Default export
export default userService;