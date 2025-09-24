import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'citizen' | 'urban_planner' | 'ngo' | 'government_admin';
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole,
  adminOnly = false 
}) => {
  const { user, profile, loading } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary-glow" />
          <p className="text-muted-foreground">Loading Earth Resilience..</p>
        </div>
      </div>
    );
  }

  // Redirect to auth if not logged in
  if (!user || !profile) {
    return <Navigate to="/auth" replace />;
  }

  // Check admin requirement
  if (adminOnly && !profile.is_admin) {
    return <Navigate to="/dashboard" replace />;
  }

  // Check role requirement
  if (requiredRole && profile.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;