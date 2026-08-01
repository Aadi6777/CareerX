import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import API from '../services/api';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

let supabaseClient = null;
if (supabaseUrl && supabaseKey && !supabaseUrl.includes('your-supabase')) {
  try {
    supabaseClient = createClient(supabaseUrl, supabaseKey);
  } catch (e) {
    console.warn('Supabase client init fallback:', e);
  }
}

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('careerx_token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        if (supabaseClient) {
          const { data: { session } } = await supabaseClient.auth.getSession();
          if (session?.user) {
            setUser({
              id: session.user.id,
              email: session.user.email,
              name: session.user.user_metadata?.name || session.user.email.split('@')[0],
              role: session.user.user_metadata?.role || 'student',
              grade: session.user.user_metadata?.grade || 'Grade 11 (Science)',
              location: session.user.user_metadata?.location || 'Bengaluru, KA'
            });
            setIsLoading(false);
            return;
          }
        }

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
    if (supabaseClient) {
      const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
      if (!error && data?.session) {
        const authUser = {
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.name || data.user.email.split('@')[0],
          role: data.user.user_metadata?.role || 'student',
          grade: data.user.user_metadata?.grade || 'Grade 11 (Science)'
        };
        localStorage.setItem('careerx_token', data.session.access_token);
        setToken(data.session.access_token);
        setUser(authUser);
        return authUser;
      }
    }

    const res = await API.post('/auth/login', { email, password });
    const { token: newToken, user: userData } = res.data;
    localStorage.setItem('careerx_token', newToken);
    setToken(newToken);
    setUser(userData);
    return userData;
  };

  const signup = async (data) => {
    if (supabaseClient) {
      const { data: authData, error } = await supabaseClient.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            role: data.role,
            grade: data.grade,
            location: data.location
          }
        }
      });

      if (!error && authData?.session) {
        const authUser = {
          id: authData.user.id,
          email: authData.user.email,
          name: data.name,
          role: data.role,
          grade: data.grade,
          location: data.location
        };
        localStorage.setItem('careerx_token', authData.session.access_token);
        setToken(authData.session.access_token);
        setUser(authUser);
        return authUser;
      }
    }

    const res = await API.post('/auth/signup', data);
    const { token: newToken, user: userData } = res.data;
    localStorage.setItem('careerx_token', newToken);
    setToken(newToken);
    setUser(userData);
    return userData;
  };

  const loginWithGoogle = async (googleEmailInput) => {
    if (supabaseClient) {
      const { data, error } = await supabaseClient.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin }
      });
      if (error) throw error;
      return data;
    }

    const email = googleEmailInput || 'student.google@gmail.com';
    const googleUser = {
      id: `usr_google_${Date.now()}`,
      email: email,
      name: email.split('@')[0].replace('.', ' ').toUpperCase(),
      role: 'student',
      grade: 'Grade 11 (Science)',
      location: 'Bengaluru, KA',
      provider: 'google',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`
    };

    const mockToken = `google_oauth_token_${Date.now()}`;
    localStorage.setItem('careerx_token', mockToken);
    setToken(mockToken);
    setUser(googleUser);
    return googleUser;
  };

  const updateOnboarding = async (data) => {
    await API.patch('/auth/onboarding', data);
    setUser(prev => ({ ...prev, ...data }));
  };

  const logout = async () => {
    if (supabaseClient) {
      await supabaseClient.auth.signOut();
    }
    localStorage.removeItem('careerx_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      isAuthenticated: !!user, 
      isLoading, 
      login, 
      signup, 
      loginWithGoogle, 
      updateOnboarding, 
      logout, 
      isSupabaseAuth: !!supabaseClient 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
