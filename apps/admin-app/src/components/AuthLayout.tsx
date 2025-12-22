import React from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { Toaster, Button } from '@myorg/ui';
import { useAuth } from '@myorg/auth';

interface AuthLayoutProps {
  isAuthenticated: boolean;
}

export default function AuthLayout({ isAuthenticated }: AuthLayoutProps) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  if (!isAuthenticated) {
    console.log('Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />

      <header className="bg-white border-b border-gray-200">
        <div className="container flex items-center justify-between py-3 px-4 sm:px-6">
          <div className="flex items-center space-x-3">
            <div className="text-primary-600 font-bold text-lg">Admin</div>
            <div className="hidden sm:block text-sm text-gray-500">Control panel</div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" label="Profile" onClick={() => navigate('/profile')} />
            <Button variant="secondary" size="sm" label="Logout" onClick={handleLogout} />
          </div>
        </div>
      </header>

      <main className="p-4 sm:p-6">
        <Outlet />
      </main>
    </div>
  );
}