import { createContext, useContext, useState, useEffect } from 'react';

const UIContext = createContext(null);

export function UIProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('transitops_dark') === 'true');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('transitops_dark', darkMode);
  }, [darkMode]);

  return (
    <UIContext.Provider value={{ darkMode, setDarkMode, sidebarOpen, setSidebarOpen }}>
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  return useContext(UIContext);
}
