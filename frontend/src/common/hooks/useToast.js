<<<<<<< HEAD
import { useContext } from "react";
import { ToastContext } from "@/app/AppProviders";

export default function useToast() {
  const ctx = useContext(ToastContext);
  return ctx || { push: () => {} };
=======
import { useState, useCallback } from 'react';

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);

  const success = useCallback((msg) => addToast(msg, 'success'), [addToast]);
  const error = useCallback((msg) => addToast(msg, 'error'), [addToast]);

  return { toasts, addToast, success, error };
>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
}
