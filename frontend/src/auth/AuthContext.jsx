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
}
