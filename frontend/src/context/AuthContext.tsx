import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, LoginResponse } from '../types';
import { apiClient } from '../api/client';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const res = await apiClient.get('/auth/me');
          if (res.data && res.data.success && res.data.data) {
            setUser(res.data.data);
            localStorage.setItem('user', JSON.stringify(res.data.data));
          } else {
            logout();
          }
        } catch (e) {
          console.warn("Session check failed", e);
          logout();
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    const res = await apiClient.post<any>('/auth/login', credentials);
    if (res.data && res.data.success) {
      const data: LoginResponse = res.data.data;
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
  };

  const hasRole = (role: string): boolean => {
    if (!user || !user.roles) return false;
    return user.roles.some((r: any) => {
      if (typeof r === 'string') return r === role;
      return r && r.code === role;
    });
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    if (hasRole('SUPER_ADMIN')) return true;
    if (!user.permissions) return false;
    return user.permissions.includes(permission);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
        hasRole,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
