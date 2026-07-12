import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./app/AppLayout";
import RequireAuth from "./auth/RequireAuth";
import RequireRole from "./auth/RequireRole";
import LoginPage from "./auth/LoginPage";
import DashboardPage from "./modules/dashboard/DashboardPage";
import VehicleListPage from "./modules/vehicles/VehicleListPage";
import VehicleDetailPage from "./modules/vehicles/VehicleDetailPage";
import DriverListPage from "./modules/drivers/DriverListPage";
import DriverDetailPage from "./modules/drivers/DriverDetailPage";
import TripListPage from "./modules/trips/TripListPage";
import TripCreatePage from "./modules/trips/TripCreatePage";
import TripDetailPage from "./modules/trips/TripDetailPage";
import MaintenanceListPage from "./modules/maintenance/MaintenanceListPage";
import FuelLogPage from "./modules/fuel-expense/FuelLogPage";
import ExpenseLogPage from "./modules/fuel-expense/ExpenseLogPage";
import ReportsPage from "./modules/reports/ReportsPage";
import GeneralSettingsPage from "./modules/settings/GeneralSettingsPage";
import RbacViewerPage from "./modules/settings/RbacViewerPage";
import ProfilePage from "./modules/settings/ProfilePage";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        element={
          <RequireAuth>
            <AppLayout />
          </RequireAuth>
        }
      >
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />

        <Route element={<RequireRole module="vehicles" action="view" />}>
          <Route path="/fleet" element={<VehicleListPage />} />
          <Route path="/fleet/:id" element={<VehicleDetailPage />} />
        </Route>

        <Route element={<RequireRole module="drivers" action="view" />}>
          <Route path="/drivers" element={<DriverListPage />} />
          <Route path="/drivers/:id" element={<DriverDetailPage />} />
        </Route>

        <Route element={<RequireRole module="trips" action="view" />}>
          <Route path="/trips" element={<TripListPage />} />
          <Route path="/trips/new" element={<TripCreatePage />} />
          <Route path="/trips/:id" element={<TripDetailPage />} />
        </Route>

        <Route element={<RequireRole module="maintenance" action="view" />}>
          <Route path="/maintenance" element={<MaintenanceListPage />} />
        </Route>

        <Route element={<RequireRole module="fuel_expense" action="view" />}>
          <Route path="/fuel" element={<FuelLogPage />} />
          <Route path="/expenses" element={<ExpenseLogPage />} />
        </Route>

        <Route element={<RequireRole module="reports" action="view" />}>
          <Route path="/analytics" element={<ReportsPage />} />
        </Route>

        <Route path="/settings" element={<GeneralSettingsPage />} />
        <Route path="/settings/rbac" element={<RbacViewerPage />} />
        <Route path="/settings/profile" element={<ProfilePage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
