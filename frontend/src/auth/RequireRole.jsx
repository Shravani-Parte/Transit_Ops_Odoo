import React from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import useAuth from "./useAuth";
import { can } from "@/config/permissions";

export default function RequireRole({ module, action = "view", children }) {
  const { user } = useAuth();
  const loc = useLocation();
  if (!user) return <Navigate to="/login" state={{ from: loc }} replace />;
  if (!can(user.role, module, action)) return <Navigate to="/dashboard" replace />;
  return children || <Outlet />;
}
