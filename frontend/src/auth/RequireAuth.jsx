<<<<<<< HEAD
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import useAuth from "./useAuth";

export default function RequireAuth({ children }) {
  const { user } = useAuth();
  const loc = useLocation();
  if (!user) return <Navigate to="/login" state={{ from: loc }} replace />;
=======
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';
import LoadingSpinner from '../common/components/LoadingSpinner';

export default function RequireAuth({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;
>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
  return children;
}
