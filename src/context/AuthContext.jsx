// src/context/AuthContext.jsx
import { createContext, useState, useCallback, useContext, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [authState, setAuthState] = useState({
    user: null,
    loading: true,
    error: null,
    checked: false,
  });

  const checkAuthStatus = useCallback(async () => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      const { data } = await api.get('/auth/me');

      if (!data?.profile) throw new Error('Invalid user data');
    
      setAuthState({
        user: data.profile,
        loading: false,
        error: null,
        checked: true
      });
      // Do not auto-redirect admins; let the current route persist
      return true;
    } catch (error) {
      // Only log non-401 errors to avoid console spam
      if (error.response?.status !== 401) {
        console.error('Auth check error:', error);
      }
      
      setAuthState({
        user: null,
        loading: false,
        error: null, // Don't set error for 401 - it's normal for unauthenticated users
        checked: true
      });
      return false;
    }
  }, [navigate]);

  const login = useCallback(async (email, password) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      const credentials = { email, password };
      const { data } = await api.post('/auth/login', credentials);

      if (!data?.success || !data?.user) {
        throw new Error('Login failed - invalid response');
      }

      setAuthState({
        user: data.user,
        loading: false,
        error: null,
        checked: true
      });

      // Redirect admin users to admin panel after login
      const type = (data.user.userType || data.user.usertype || data.user.user_type || data.user.role || "").toString().toLowerCase();
      if (type === "admin") navigate("/admin");

      return { success: true, user: data.user };
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: error.response?.data?.msg || 'Invalid credentials'
      }));
      return {
        success: false,
        message: error.response?.data?.msg || 'Login failed'
      };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      setAuthState({
        user: null,
        loading: false,
        error: null,
        checked: true
      });
      // Redirect to home page after logout
      navigate("/");
    }
  }, [navigate]);

  // ✅ Only perform initial check, NO automatic navigation
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  return (
    <AuthContext.Provider value={{
      ...authState,
      login,
      logout,
      checkAuthStatus,
      isAuthenticated: !!authState.user
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};