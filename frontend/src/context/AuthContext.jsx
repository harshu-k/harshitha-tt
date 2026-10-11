import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('ssims_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('ssims_token'));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token && !user) {
      authApi.getCurrentUser()
        .then((res) => {
          if (res.data) {
            setUser(res.data);
            localStorage.setItem('ssims_user', JSON.stringify(res.data));
          }
        })
        .catch(() => {
          logout();
        });
    }
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await authApi.login({ email, password });
      const authData = res.data;
      setToken(authData.token);
      setUser(authData);
      localStorage.setItem('ssims_token', authData.token);
      localStorage.setItem('ssims_user', JSON.stringify(authData));
      return authData;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await authApi.register(userData);
      const authData = res.data;
      setToken(authData.token);
      setUser(authData);
      localStorage.setItem('ssims_token', authData.token);
      localStorage.setItem('ssims_user', JSON.stringify(authData));
      return authData;
    } finally {
      setLoading(false);
    }
  };

  const quickDemoLogin = async (roleType) => {
    if (roleType === 'coordinator') {
      return login('admin@ssims.edu', 'admin123');
    } else {
      return login('student@ssims.edu', 'student123');
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('ssims_token');
    localStorage.removeItem('ssims_user');
  };

  const isCoordinator = user?.role === 'ROLE_COORDINATOR' || user?.role === 'ROLE_ADMIN';
  const isStudent = user?.role === 'ROLE_STUDENT';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token,
        isCoordinator,
        isStudent,
        login,
        register,
        quickDemoLogin,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

