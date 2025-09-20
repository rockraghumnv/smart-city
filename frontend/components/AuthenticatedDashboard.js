'use client';

import { useAuth } from '@/contexts/AuthContext';
import DashboardCard from '@/components/DashboardCard';
import Link from 'next/link';
import { Bus, Shield, Leaf, Recycle, Star, TrendingUp, Calendar, Award } from 'lucide-react';

export default function AuthenticatedDashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();

  const dashboardCards = [
    {
      title: "Green Commute",
      subtitle: "Track buses & crowd levels",
      icon: <Bus className="w-8 h-8" />,
      href: "/smartbus",
      gradientClass: "gradient-blue"
    },
    {
      title: "City Safety",
      subtitle: "AI event monitoring & alerts",
      icon: <Shield className="w-8 h-8" />,
      href: "/crowdguard",
      gradientClass: "gradient-red"
    },
    {
      title: "My Impact",
      subtitle: "Daily sustainability tracker",
      icon: <Leaf className="w-8 h-8" />,
      href: "/sustainability",
      gradientClass: "gradient-green"
    },
    {
      title: "Recycle Hub",
      subtitle: "Request pickups & earn rewards",
      icon: <Recycle className="w-8 h-8" />,
      href: "/recycle",
      gradientClass: "gradient-teal"
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section for Non-Authenticated Users */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Welcome to <span className="text-green-600">GreenShift</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Your comprehensive smart city toolkit for sustainable living, safe commuting, 
            and environmental responsibility in Bengaluru.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register"
              className="px-8 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-teal-700 transition-all duration-200"
            >
              Get Started Free
            </Link>
            <Link
              href="/auth/login"
              className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          {dashboardCards.map((card, index) => (
            <div
              key={index}
              className="relative group bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300"
            >
              <div className={`absolute inset-0 opacity-10 ${card.gradientClass}`}></div>
              <div className="relative p-8">
                <div className="flex items-center mb-4">
                  <div className="text-gray-700">{card.icon}</div>
                  <div className="ml-4">
                    <h3 className="text-xl font-bold text-gray-900">{card.title}</h3>
                    <p className="text-gray-600">{card.subtitle}</p>
                  </div>
                </div>
                <div className="text-sm text-gray-500 mb-4">
                  Sign in to access this feature
                </div>
                <Link
                  href="/auth/login"
                  className="inline-flex items-center text-green-600 hover:text-green-700 font-medium"
                >
                  Get Started →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <div className="text-3xl font-bold text-green-600 mb-2">50K+</div>
            <div className="text-gray-600">Active Users</div>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <div className="text-3xl font-bold text-blue-600 mb-2">25K</div>
            <div className="text-gray-600">CO₂ Saved (kg)</div>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <div className="text-3xl font-bold text-teal-600 mb-2">15K</div>
            <div className="text-gray-600">Items Recycled</div>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated Dashboard
  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    const firstName = user.name.split(' ')[0];
    
    if (hour < 12) return `Good morning, ${firstName}!`;
    if (hour < 17) return `Good afternoon, ${firstName}!`;
    return `Good evening, ${firstName}!`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Personalized Welcome Section */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl p-8 text-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {getWelcomeMessage()}
              </h1>
              <p className="text-green-100 text-lg">
                Ready to make a positive impact today?
              </p>
            </div>
            <div className="mt-4 md:mt-0 bg-white/20 rounded-xl p-4 backdrop-blur-sm">
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{user.profile?.points || 0}</div>
                  <div className="text-sm text-green-100">EcoPoints</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{user.profile?.level || 'Bronze'}</div>
                  <div className="text-sm text-green-100">Level</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg p-4 shadow-md">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Bus className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">12</div>
              <div className="text-sm text-gray-600">Trips This Week</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-md">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Leaf className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">85kg</div>
              <div className="text-sm text-gray-600">CO₂ Saved</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-md">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
              <Recycle className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">23</div>
              <div className="text-sm text-gray-600">Items Recycled</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-md">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Award className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">7</div>
              <div className="text-sm text-gray-600">Achievements</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-8">
        {dashboardCards.map((card, index) => (
          <DashboardCard
            key={index}
            title={card.title}
            subtitle={card.subtitle}
            icon={card.icon}
            href={card.href}
            gradientClass={card.gradientClass}
          />
        ))}
      </div>

      {/* Recent Activity */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-blue-600" />
            Recent Activity
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-3 bg-green-50 rounded-lg">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Recycle className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900">Recycling pickup completed</div>
                <div className="text-sm text-gray-600">5kg plastic bottles • +150 points</div>
              </div>
              <div className="text-sm text-gray-500">2 hours ago</div>
            </div>
            
            <div className="flex items-center space-x-4 p-3 bg-blue-50 rounded-lg">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Bus className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900">Eco-friendly commute</div>
                <div className="text-sm text-gray-600">Used public transport • +25 points</div>
              </div>
              <div className="text-sm text-gray-500">Yesterday</div>
            </div>
            
            <div className="flex items-center space-x-4 p-3 bg-yellow-50 rounded-lg">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <Star className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900">Achievement unlocked</div>
                <div className="text-sm text-gray-600">Eco Warrior badge earned</div>
              </div>
              <div className="text-sm text-gray-500">3 days ago</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
