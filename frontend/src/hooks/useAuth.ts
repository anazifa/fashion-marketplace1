import { useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'USER' | 'SELLER';
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setState({ user: null, loading: false, error: null });
        return;
      }

      const response = await axios.get('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setState({ user: response.data, loading: false, error: null });
    } catch (error) {
      setState({ user: null, loading: false, error: 'Authentication failed' });
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setState({ user, loading: false, error: null });
      return true;
    } catch (error) {
      setState({ user: null, loading: false, error: 'Login failed' });
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setState({ user: null, loading: false, error: null });
  };

  return {
    user: state.user,
    loading: state.loading,
    error: state.error,
    login,
    logout,
  };
}; 