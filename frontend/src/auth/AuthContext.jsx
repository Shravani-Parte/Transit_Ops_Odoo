<<<<<<< HEAD
import React, { createContext, useEffect, useMemo, useState } from "react";
import { getAuth, setAuth, clearAuth } from "@/store/authStore";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getAuth());

  const login = (u) => { setAuth(u); setUser(u); };
  const logout = () => { clearAuth(); setUser(null); };

  useEffect(() => {
    const onStorage = () => setUser(getAuth());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const value = useMemo(() => ({ user, login, logout }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
=======
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as authApi from './authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('transitops_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('transitops_token');
    if (token) {
      authApi.getMe()
        .then((u) => { setUser(u); localStorage.setItem('transitops_user', JSON.stringify(u)); })
        .catch(() => { localStorage.removeItem('transitops_token'); localStorage.removeItem('transitops_user'); setUser(null); })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await authApi.login(email, password);
    localStorage.setItem('transitops_token', data.access_token);
    localStorage.setItem('transitops_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('transitops_token');
    localStorage.removeItem('transitops_user');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
}
