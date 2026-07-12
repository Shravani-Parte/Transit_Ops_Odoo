import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';
import LoadingSpinner from '../common/components/LoadingSpinner';

export default function RequireAuth({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}
