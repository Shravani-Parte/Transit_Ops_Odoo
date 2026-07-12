<<<<<<< HEAD
import React, { createContext, useCallback, useState } from "react";
import { AuthProvider } from "@/auth/AuthContext";
import Toast from "@/common/components/Toast";

export const ToastContext = createContext(null);

export default function AppProviders({ children }) {
  const [toasts, setToasts] = useState([]);
  const push = useCallback((message, kind = "info") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, message, kind }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  }, []);

  return (
    <AuthProvider>
      <ToastContext.Provider value={{ push }}>
        {children}
        <Toast toasts={toasts} />
      </ToastContext.Provider>
    </AuthProvider>
=======
import { AuthProvider } from '../auth/AuthContext';
import { UIProvider } from '../store/uiStore';

export default function AppProviders({ children }) {
  return (
    <UIProvider>
      <AuthProvider>{children}</AuthProvider>
    </UIProvider>
>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
  );
}
