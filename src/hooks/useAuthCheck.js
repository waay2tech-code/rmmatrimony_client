// src/hooks/useAuthCheck.js
import { useState, useEffect, useRef } from 'react';
import api from '../api/axios';

export const useAuthCheck = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  const checkAuth = async (force = false) => {
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new AbortController
    abortControllerRef.current = new AbortController();

    try {
      setLoading(true);
      setError(null);

      const { data } = await api.get('/users/profile', {
        signal: abortControllerRef.current.signal
      });

      if (data?.profile) {
        setUser(data.profile);
        return data.profile;
      }
    } catch (err) {
      // Ignore aborted requests
      if (err.name === 'AbortError' || err.cancelled) {
        console.log('Request was cancelled - expected behavior');
        return null;
      }

      console.error('Error fetching user:', err);
      setError(err.message || 'Failed to fetch user data');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return { user, loading, error, checkAuth };
};
