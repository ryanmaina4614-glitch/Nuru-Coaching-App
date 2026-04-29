import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from './api';

interface User {
  uid: string;
  email: string;
  displayName?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  signup: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          const userData = await api.getMe(token);
          setUser(userData);
        } catch (error) {
          console.error('Session expired', error);
          localStorage.removeItem('auth_token');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string, rememberMe: boolean) => {
    const { user: userData, token } = await api.login(email, password);
    setUser(userData);
    if (rememberMe) {
      localStorage.setItem('auth_token', token);
    } else {
      sessionStorage.setItem('auth_token', token);
    }
  };

  const signup = async (email: string, password: string, displayName: string) => {
    const { user: userData, token } = await api.signup(email, password, displayName);
    setUser(userData);
    localStorage.setItem('auth_token', token);
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('auth_token');
    sessionStorage.removeItem('auth_token');
  };

  const resetPassword = (email: string) => api.resetPassword(email);

  const signInWithGoogle = () => api.socialLogin('google');

  const signInWithFacebook = () => api.socialLogin('facebook');

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      signup, 
      logout, 
      resetPassword,
      signInWithGoogle,
      signInWithFacebook
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
