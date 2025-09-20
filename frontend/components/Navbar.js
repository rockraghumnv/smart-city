'use client';

import Link from 'next/link';
import { Bell, Menu, MapPin, User, LogOut, Settings, Trophy } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect, useRef } from 'react';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  const getUserTypeLabel = (userType) => {
    switch (userType) {
      case 'individual': return 'Individual';
      case 'hostel': return 'Hostel/PG';
      case 'company': return 'Company';
      case 'vendor': return 'Vendor/NGO';
      default: return 'User';
    }
  };

  const getUserTypeColor = (userType) => {
    switch (userType) {
      case 'individual': return 'bg-blue-100 text-blue-800';
      case 'hostel': return 'bg-orange-100 text-orange-800';
      case 'company': return 'bg-purple-100 text-purple-800';
      case 'vendor': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  return (
    <nav className="sticky top-0 z-50 bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">G</span>
              </div>
              <span className="text-xl font-bold text-gray-900">GreenShift</span>
            </Link>
          </div>

          {/* City Selector */}
          <div className="hidden md:flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-2">
            <MapPin className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Bengaluru</span>
          </div>          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {isAuthenticated && (
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
            )}            {isAuthenticated ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-3 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-teal-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="hidden md:block text-left">
                    <div className="text-sm font-medium text-gray-900">{user?.name}</div>
                    <div className={`text-xs px-2 py-0.5 rounded-full ${getUserTypeColor(user?.userType)}`}>
                      {getUserTypeLabel(user?.userType)}
                    </div>
                  </div>
                </button>

                {/* User Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="font-medium text-gray-900">{user?.name}</div>
                      <div className="text-sm text-gray-600">{user?.email}</div>
                      {user?.organizationName && (
                        <div className="text-xs text-gray-500 mt-1">{user?.organizationName}</div>
                      )}
                      <div className="flex items-center mt-2">
                        <Trophy className="w-4 h-4 text-yellow-500 mr-1" />
                        <span className="text-sm font-medium text-gray-700">
                          {user?.profile?.points || 0} points • {user?.profile?.level || 'Bronze'}
                        </span>
                      </div>
                    </div>
                    
                    <Link
                      href="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <User className="w-4 h-4 mr-3" />
                      View Profile
                    </Link>
                    
                    <Link
                      href="/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Settings className="w-4 h-4 mr-3" />
                      Settings
                    </Link>
                    
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/auth/login"
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  className="px-4 py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:from-green-700 hover:to-teal-700 transition-all duration-200"
                >
                  Get Started
                </Link>
              </div>
            )}

            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors md:hidden">
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
