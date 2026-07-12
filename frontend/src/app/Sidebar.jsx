import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Truck, Users, Route, Wrench, Fuel, BarChart3, Settings, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { useAuth } from '../auth/useAuth';
import { useUI } from '../store/uiStore';
import { getNavItems } from '../config/permissions';

const ICONS = { LayoutDashboard, Truck, Users, Route, Wrench, Fuel, BarChart3, Settings };

export default function Sidebar() {
  const { user } = useAuth();
  const { sidebarOpen, setSidebarOpen } = useUI();
  const location = useLocation();
  const navItems = getNavItems(user);

  return (
    <aside className={`fixed left-0 top-0 h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 z-40 transition-all ${sidebarOpen ? 'w-64' : 'w-16'}`}>
      <div className="flex items-center gap-2 p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="p-1.5 bg-brand-600 rounded-lg text-white shrink-0"><Truck size={20} /></div>
        {sidebarOpen && <span className="font-bold text-lg">TransitOps</span>}
      </div>
      <nav className="p-3 space-y-1">
        {navItems.map((item) => {
          const Icon = ICONS[item.icon];
          const active = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.key}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${active ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
            >
              <Icon size={20} className="shrink-0" />
              {sidebarOpen && item.label}
            </Link>
          );
        })}
      </nav>
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="absolute -right-3 top-20 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-full p-1 shadow-sm"
      >
        {sidebarOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
      </button>
    </aside>
  );
}
