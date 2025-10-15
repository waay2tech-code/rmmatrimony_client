// src/services/authService.js
import api from './api';
import { clearAuthToken, storeAuthToken } from '../utils/authUtils'; // 
export const authService = {
  // Login user with proper credentials handling
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials, {
        withCredentials: true // Ensure cookies are sent/received
      });
      
      // Store token if received in response (JWT)
      if (response.data.token) {
        storeAuthToken(response.data.token);
      }
      
      return {
        user: response.data.user,
        token: response.data.token,
        ...response.data
      };
      
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Login failed',
        status: error.response?.status,
        data: error.response?.data
      };
    }
  },

  // Register user with enhanced error handling
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData, {
        withCredentials: true
      });
      
      // Auto-login after registration if token is returned
      if (response.data.token) {
        storeAuthToken(response.data.token);
      }
      
      return response.data;
      
    } catch (error) {
      throw {
        message: error.response?.data?.msg || 'Registration failed',
        errors: error.response?.data?.errors,
        status: error.response?.status
      };
    }
  },

  // Logout with proper cleanup
  logout: async () => {
    try {
      const response = await api.post('/auth/logout', {}, {
        withCredentials: true
      });
      
      // Clear client-side tokens
      clearAuthToken();
      
      return response.data;
      
    } catch (error) {
      // Ensure tokens are cleared even if logout fails
      clearAuthToken();
      throw {
        message: error.response?.data?.message || 'Logout failed',
        status: error.response?.status
      };
    }
  },

  // Check auth status with automatic token refresh handling
  checkAuthStatus: async () => {
    try {
      const response = await api.get('/users/profile', {
        withCredentials: true
      });
      
      return response.data;
      
    } catch (error) {
      if (error.response?.status === 401) {
        clearAuthToken(); // Clear invalid token
      }
      
      throw {
        message: error.response?.data?.message || 'Authentication check failed',
        requiresLogin: error.response?.status === 401,
        status: error.response?.status
      };
    }
  },

  // Forgot password with better error structure
  forgotPassword: async (email) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return {
        success: true,
        message: response.data.message,
        ...response.data
      };
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Password reset failed',
        status: error.response?.status
      };
    }
  },

  // Reset password with validation
  // resetPassword: async (token, newPassword) => {
  //   try {
  //     const response = await api.post('/auth/reset-password', {
  //       token,
  //       newPassword,
  //     });
      
  //     return {
  //       success: true,
  //       message: response.data.message,
  //       ...response.data
  //     };
      
  //   } catch (error) {
  //     throw {
  //       message: error.response?.data?.message || 'Password reset failed',
  //       errors: error.response?.data?.errors,
  //       status: error.response?.status
  //     };
  //   }
  // },
  // Reset password API call
resetPassword: async (token, newPassword, confirmPassword) => {
  try {
    const response = await api.post('/auth/reset-password', {
      token,
      newPassword,
      confirmPassword
    });
    
    return {
      success: true,
      message: response.data.message,
      ...response.data
    };
    
  } catch (error) {
    throw {
      message: error.response?.data?.message || 'Password reset failed',
      errors: error.response?.data?.errors,
      status: error.response?.status
    };
  }
},
//    // Forgot password API call
// forgotPassword: async (email) => {
//   try {
//     const response = await api.post('/auth/forgot-password', { email });
//     return {
//       success: true,
//       message: response.data.message,
//       ...response.data
//     };
//   } catch (error) {
//     throw {
//       message: error.response?.data?.message || 'Password reset failed',
//       status: error.response?.status
//     };
//   }
// },

  
};

export const loginUser = authService.login;
export const registerUser = authService.register;