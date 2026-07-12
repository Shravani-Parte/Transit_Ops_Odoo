import { LogOut, Moon, Sun, Bell } from 'lucide-react';
import { useAuth } from '../auth/useAuth';
import { useUI } from '../store/uiStore';
import Button from '../common/components/Button';

export default function Topbar({ title }) {
  const { user, logout } = useAuth();
  const { darkMode, setDarkMode, sidebarOpen } = useUI();

  return (
    <header className={`fixed top-0 right-0 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur border-b border-slate-200 dark:border-slate-700 z-30 flex items-center justify-between px-6 transition-all ${sidebarOpen ? 'left-64' : 'left-16'}`}>
      <h1 className="text-lg font-semibold">{title}</h1>
      <div className="flex items-center gap-3">
        <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 relative">
          <Bell size={18} />
        </button>
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium">{user?.full_name}</p>
          <p className="text-xs text-slate-400">{user?.role_name}</p>
        </div>
        <Button variant="ghost" size="sm" onClick={logout}><LogOut size={16} /></Button>
      </div>
    </header>
  );
}
