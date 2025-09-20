'use client';

import { Plus, TreePine, Users, Target } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description, action, color = 'green' }) => {
  const colorClasses = {
    green: 'from-green-400 to-emerald-500',
    blue: 'from-blue-400 to-cyan-500',
    purple: 'from-purple-400 to-indigo-500',
    orange: 'from-orange-400 to-amber-500'
  };

  return (
    <div className="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
      <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center mx-auto mb-4`}>
        <Icon className="h-8 w-8 text-white" />
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm mb-4">{description}</p>
      <button
        onClick={action}
        className={`bg-gradient-to-r ${colorClasses[color]} text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity`}
      >
        Get Started
      </button>
    </div>
  );
};

const StatCard = ({ number, label, sublabel, color = 'text-green-600' }) => {
  return (
    <div className="text-center">
      <div className={`text-3xl font-bold ${color} mb-1`}>{number}</div>
      <div className="text-sm font-medium text-gray-700">{label}</div>
      {sublabel && <div className="text-xs text-gray-500">{sublabel}</div>}
    </div>
  );
};

export default function EmptyState({ onStartLogging }) {
  const features = [
    {
      icon: Plus,
      title: 'Track Daily Impact',
      description: 'Log your water usage, energy consumption, travel, and waste to build awareness.',
      action: onStartLogging,
      color: 'green'
    },
    {
      icon: Target,
      title: 'Earn Your EarthScore',
      description: 'Get a personalized sustainability score from 0-100 based on your activities.',
      action: onStartLogging,
      color: 'blue'
    },
    {
      icon: TreePine,
      title: 'Unlock Achievements',
      description: 'Earn badges for consistent eco-friendly habits and reaching milestones.',
      action: onStartLogging,
      color: 'purple'
    },
    {
      icon: Users,
      title: 'Join the Movement',
      description: 'Be part of a community working together for a more sustainable future.',
      action: onStartLogging,
      color: 'orange'
    }
  ];

  const globalStats = [
    { number: '1.2M', label: 'Trees Saved', sublabel: 'by our community', color: 'text-green-600' },
    { number: '450K', label: 'Gallons Conserved', sublabel: 'this month', color: 'text-blue-600' },
    { number: '89%', label: 'Users Improved', sublabel: 'their habits', color: 'text-purple-600' },
    { number: '24/7', label: 'Impact Tracking', sublabel: 'never stops', color: 'text-orange-600' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <TreePine className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-3">
              Welcome to <span className="text-green-600">MyImpact</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Track your daily activities, measure your environmental impact, and join a community 
              committed to building a more sustainable future.
            </p>
          </div>
            {/* Primary CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onStartLogging}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl"
            >
              Start Tracking Your Impact
            </button>
            <button
              onClick={() => {
                // Load demo data for quick exploration
                const { initializeDemoData } = require('../lib/demo');
                initializeDemoData();
                window.location.reload();
              }}
              className="bg-white border-2 border-green-500 text-green-600 px-6 py-4 rounded-xl font-semibold text-lg hover:bg-green-50 transition-all shadow-lg hover:shadow-xl"
            >
              Try Demo Data
            </button>
          </div>
        </div>
        
        {/* Global Stats */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
            Our Community Impact
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {globalStats.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>
        </div>
        
        {/* Features Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
            How MyImpact Works
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
        
        {/* Getting Started Steps */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
            Getting Started is Easy
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                1
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Log Your First Activity</h3>
              <p className="text-gray-600 text-sm">
                Start by tracking something simple like your water usage or daily commute.
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                2
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Watch Your EarthScore</h3>
              <p className="text-gray-600 text-sm">
                See your sustainability score update in real-time as you log more activities.
              </p>
            </div>
            
            {/* Step 3 */}
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                3
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Build Sustainable Habits</h3>
              <p className="text-gray-600 text-sm">
                Use insights and tips to improve your daily choices and earn achievement badges.
              </p>
            </div>
          </div>
          
          {/* Final CTA */}
          <div className="text-center mt-8">
            <button
              onClick={onStartLogging}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all"
            >
              Begin Your Sustainability Journey
            </button>
          </div>
        </div>
        
        {/* Mission Statement */}
        <div className="text-center mt-12">
          <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
            <strong>Our Mission:</strong> To empower individuals with the tools and insights needed to make 
            sustainable choices every day. Together, we can create meaningful environmental change, 
            one small action at a time.
          </p>
        </div>
      </div>
    </div>
  );
}
