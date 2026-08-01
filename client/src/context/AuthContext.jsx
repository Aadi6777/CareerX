import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('careerx_token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await API.get('/auth/me');
        if (res.data && res.data.user) {
          setUser(res.data.user);
        }
      } catch (err) {
        console.warn('Failed to load authenticated user profile:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await API.post('/auth/login', { email, password });
    const { token: newToken, user: userData } = res.data;
    localStorage.setItem('careerx_token', newToken);
    setToken(newToken);
    setUser(userData);
    return userData;
  };

  const signup = async (data) => {
    const res = await API.post('/auth/signup', data);
    const { token: newToken, user: userData } = res.data;
    localStorage.setItem('careerx_token', newToken);
    setToken(newToken);
    setUser(userData);
    return userData;
  };

  const updateOnboarding = async (data) => {
    await API.patch('/auth/onboarding', data);
    setUser(prev => ({ ...prev, ...data }));
  };

  const logout = () => {
    localStorage.removeItem('careerx_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!user, isLoading, login, signup, updateOnboarding, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
