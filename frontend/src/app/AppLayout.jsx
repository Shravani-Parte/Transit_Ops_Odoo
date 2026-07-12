import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useUI } from '../store/uiStore';

const TITLES = {
  '/dashboard': 'Dashboard',
  '/fleet': 'Fleet Registry',
  '/drivers': 'Driver Management',
  '/trips': 'Trip Management',
  '/maintenance': 'Maintenance',
  '/fuel-expenses': 'Fuel & Expenses',
  '/analytics': 'Analytics & Reports',
  '/settings': 'Settings',
};

export default function AppLayout() {
  const { sidebarOpen } = useUI();
  const title = TITLES[window.location.pathname] || 'TransitOps';

  return (
    <div className="min-h-screen">
      <Sidebar />
      <Topbar title={title} />
      <main className={`pt-16 min-h-screen transition-all ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
