import React, { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext({
  user: null,
  login: () => {},
  logout: () => {},
  setUser: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const raw = sessionStorage.getItem('user');
      console.log(raw)
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  });

  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'user') {
        setUser(e.newValue ? JSON.parse(e.newValue) : null);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const login = (userObj, tokens = {}) => {
    if (tokens.access) sessionStorage.setItem('access_token', tokens.access);
    if (tokens.refresh) sessionStorage.setItem('refresh_token', tokens.refresh);
    if (userObj) {
      sessionStorage.setItem('user', JSON.stringify(userObj));
      if (userObj.role) sessionStorage.setItem('role', userObj.role);
    }
    setUser(userObj);
  };

  const logout = () => {
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('refresh_token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('role');
    setUser(null);
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;