import { createBrowserRouter, Navigate } from 'react-router-dom';
import AppLayout from './app/AppLayout';
import LoginPage from './auth/LoginPage';
import RequireAuth from './auth/RequireAuth';
import DashboardPage from './modules/dashboard/DashboardPage';
import VehicleListPage from './modules/vehicles/VehicleListPage';
import VehicleDetailPage from './modules/vehicles/VehicleDetailPage';
import DriverListPage from './modules/drivers/DriverListPage';
import DriverDetailPage from './modules/drivers/DriverDetailPage';
import TripListPage from './modules/trips/TripListPage';
import TripCreatePage from './modules/trips/TripCreatePage';
import TripDetailPage from './modules/trips/TripDetailPage';
import MaintenanceListPage from './modules/maintenance/MaintenanceListPage';
import FuelLogPage from './modules/fuel-expense/FuelLogPage';
import ExpenseLogPage from './modules/fuel-expense/ExpenseLogPage';
import ReportsPage from './modules/reports/ReportsPage';
import GeneralSettingsPage from './modules/settings/GeneralSettingsPage';
import ProfilePage from './modules/settings/ProfilePage';
import RbacViewerPage from './modules/settings/RbacViewerPage';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: (
      <RequireAuth>
        <AppLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'vehicles', element: <VehicleListPage /> },
      { path: 'vehicles/:vehicleId', element: <VehicleDetailPage /> },
      { path: 'drivers', element: <DriverListPage /> },
      { path: 'drivers/:driverId', element: <DriverDetailPage /> },
      { path: 'trips', element: <TripListPage /> },
      { path: 'trips/new', element: <TripCreatePage /> },
      { path: 'trips/:tripId', element: <TripDetailPage /> },
      { path: 'maintenance', element: <MaintenanceListPage /> },
      { path: 'fuel-expenses', element: <FuelLogPage /> },
      { path: 'fuel-expenses/expenses', element: <ExpenseLogPage /> },
      { path: 'analytics', element: <ReportsPage /> },
      { path: 'settings', element: <GeneralSettingsPage /> },
      { path: 'settings/profile', element: <ProfilePage /> },
      { path: 'settings/rbac', element: <RbacViewerPage /> },
    ],
  },
]);

export default router;
