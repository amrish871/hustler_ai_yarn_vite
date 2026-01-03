import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AUTH_TOKEN_KEY = 'authToken';

export interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  setToken: (token: string | null) => void;
  setUser: (user: any) => void;
  getUser: () => any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [token, setTokenState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(AUTH_TOKEN_KEY);
      if (saved) setTokenState(saved);
    } catch (e) {
      // localStorage may be unavailable in SSR - ignore
    }
    setLoading(false);
  }, []);

  const login = (newToken: string) => {
    try {
      localStorage.setItem(AUTH_TOKEN_KEY, newToken);
    } catch (e) {
      // ignore
    }
    setTokenState(newToken);
  };

  const logout = () => {
    try {
      localStorage.removeItem(AUTH_TOKEN_KEY);
    } catch (e) {
      // ignore
    }
    setTokenState(null);
  };

  const setToken = (t: string | null) => {
    if (t) login(t);
    else logout();
  };

  const value = useMemo(
    () => ({ token, isAuthenticated: !!token, login, logout, setToken }),
    [token]
  );

  if (loading) {
    // Optionally, render a loading spinner or null while checking localStorage
    return null;
  }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};

export default AuthProvider;
