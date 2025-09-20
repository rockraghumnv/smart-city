'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedRoute({ children, allowedUserTypes = [] }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        // Redirect to login if not authenticated
        router.push('/auth/login');
        return;
      }

      if (allowedUserTypes.length > 0 && !allowedUserTypes.includes(user.userType)) {
        // Redirect to dashboard if user type not allowed
        router.push('/');
        return;
      }
    }
  }, [user, isLoading, router, allowedUserTypes]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show nothing while redirecting
  if (!user || (allowedUserTypes.length > 0 && !allowedUserTypes.includes(user.userType))) {
    return null;
  }

  return children;
}
