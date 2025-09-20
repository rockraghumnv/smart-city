'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Settings } from 'lucide-react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';

// Import all advanced components
import LogForm from './components/LogForm';
import ScoreCard from './components/ScoreCard';
import ChartsPanel from './components/ChartsPanel';
import Timeline from './components/Timeline';
import Badges from './components/Badges';
import TipsCarousel from './components/TipsCarousel';
import EmptyState from './components/EmptyState';

// Import utilities
import { getEntries, getSettings, updateSettings } from './lib/storage';
import { calculateEarthScore, calculateDailyTotals, calculateWeeklyAggregates } from './lib/score';

export default function SustainabilityPage() {
  return (
    <ProtectedRoute>
      <SustainabilityContent />
    </ProtectedRoute>
  );
}

function SustainabilityContent() {
  const [formData, setFormData] = useState({
    water: '',
    electricity: '',
    transport: 'bus',
    waste: '' // new waste field
  });

  const [stats, setStats] = useState({
    waterSaved: 245,
    energySaved: 180,
    carbonReduced: 85,
    wasteReduced: 12, // new waste stat
    weeklyGoal: 300,
    earthScore: 72
  });

  // Streak and log tracking
  const [streak, setStreak] = useState(3); // Example: 3-day streak
  const [lastLogDate, setLastLogDate] = useState(null);
  const today = new Date().toISOString().slice(0, 10);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically save to a database
    alert('Daily impact logged successfully! 🌱');
    setFormData({ water: '', electricity: '', transport: 'bus', waste: '' });
    setLastLogDate(today);
    setStreak((prev) => (lastLogDate === today ? prev : prev + 1));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Link href="/" className="mr-4 p-2 hover:bg-white hover:shadow-md rounded-lg transition-all">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">MyImpact</h1>
              <p className="text-gray-600">Track your daily sustainability habits</p>
            </div>
          </div>
          
          {/* EarthScore Display */}
          <div className="bg-white rounded-xl shadow-lg p-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">{stats.earthScore}</div>
              <div className="text-sm text-gray-600">EarthScore</div>
              <div className="w-16 h-2 bg-gray-200 rounded-full mt-2">
                <div 
                  className="h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
                  style={{ width: `${stats.earthScore}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Daily Logger Form */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <Leaf className="w-5 h-5 mr-2 text-green-600" />
              Log Today's Usage
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Water Usage (Liters)
                </label>
                <div className="relative">
                  <Droplets className="absolute left-3 top-3 w-5 h-5 text-blue-500" />
                  <input
                    type="number"
                    name="water"
                    value={formData.water}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter liters used"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">💡 Tip: Average shower uses 60-80 liters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Electricity Usage (kWh)
                </label>
                <div className="relative">
                  <Zap className="absolute left-3 top-3 w-5 h-5 text-yellow-500" />
                  <input
                    type="number"
                    name="electricity"
                    value={formData.electricity}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter kWh used"
                    step="0.1"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">💡 Tip: LED bulbs use 80% less energy</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Waste Generated (kg)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="waste"
                    value={formData.waste}
                    onChange={handleInputChange}
                    className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter kg of waste"
                    step="0.01"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">💡 Tip: Composting reduces landfill waste!</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Transport Mode
                </label>
                <div className="relative">
                  <Car className="absolute left-3 top-3 w-5 h-5 text-blue-600" />
                  <select
                    name="transport"
                    value={formData.transport}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="walk">🚶 Walking</option>
                    <option value="bike">🚴 Bicycle</option>
                    <option value="bus">🚌 Public Bus</option>
                    <option value="metro">🚇 Metro</option>
                    <option value="car">🚗 Private Car</option>
                    <option value="motorcycle">🏍️ Motorcycle</option>
                  </select>
                </div>
                <p className="text-xs text-gray-500 mt-1">💡 Tip: Walking or cycling is best for the planet</p>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all font-medium shadow-lg hover:shadow-xl"
              >
                🌱 Log Today's Impact
              </button>
            </form>
            {/* Reminder if not logged today */}
            {lastLogDate !== today && (
              <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 rounded">
                Don’t forget to log your impact for today!
              </div>
            )}
          </div>

          {/* Stats Dashboard */}
          <div className="space-y-6">
            {/* Streak and Badges */}
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg font-semibold flex items-center">
                🔥 {streak}-day streak!
              </div>
              <div className="flex gap-2">
                <span title="Logged 5 days in a row" className="text-2xl">🏅</span>
                <span title="Low waste week" className="text-2xl">♻️</span>
                <span title="Energy saver" className="text-2xl">⚡</span>
              </div>
            </div>

            {/* Simple Analytics Bar Chart */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Weekly Usage Analytics</h3>
              <div className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="h-24 w-6 bg-blue-200 rounded relative flex items-end">
                    <div className="bg-blue-500 w-6 rounded-b" style={{ height: `${stats.waterSaved / 3}px` }}></div>
                  </div>
                  <span className="text-xs mt-2">Water</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="h-24 w-6 bg-yellow-200 rounded relative flex items-end">
                    <div className="bg-yellow-500 w-6 rounded-b" style={{ height: `${stats.energySaved / 3}px` }}></div>
                  </div>
                  <span className="text-xs mt-2">Electricity</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="h-24 w-6 bg-green-200 rounded relative flex items-end">
                    <div className="bg-green-500 w-6 rounded-b" style={{ height: `${stats.wasteReduced * 8}px` }}></div>
                  </div>
                  <span className="text-xs mt-2">Waste</span>
                </div>
              </div>
            </div>

            {/* Weekly Progress */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Weekly Progress</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>EarthScore Goal</span>
                    <span>{stats.earthScore}/100</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-emerald-500 h-3 rounded-full transition-all" 
                      style={{ width: `${stats.earthScore}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Great progress! You're doing amazing! 🌟</p>
                </div>
              </div>
            </div>

            {/* Impact Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 text-sm font-medium">Water Saved</p>
                    <p className="text-2xl font-bold text-blue-700">{stats.waterSaved}L</p>
                    <p className="text-xs text-blue-600">This month</p>
                  </div>
                  <Droplets className="w-8 h-8 text-blue-500" />
                </div>
              </div>

              <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-600 text-sm font-medium">Energy Saved</p>
                    <p className="text-2xl font-bold text-yellow-700">{stats.energySaved} kWh</p>
                    <p className="text-xs text-yellow-600">This month</p>
                  </div>
                  <Zap className="w-8 h-8 text-yellow-500" />
                </div>
              </div>

              <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 text-sm font-medium">Waste Reduced</p>
                    <p className="text-2xl font-bold text-green-700">{stats.wasteReduced} kg</p>
                    <p className="text-xs text-green-600">This month</p>
                  </div>
                  <Leaf className="w-8 h-8 text-green-500" />
                </div>
              </div>

              <div className="bg-green-50 rounded-xl p-4 sm:col-span-2 border border-green-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 text-sm font-medium">CO₂ Reduced</p>
                    <p className="text-2xl font-bold text-green-700">{stats.carbonReduced} kg</p>
                    <p className="text-green-600 text-xs">Equivalent to planting 2 trees! 🌳</p>
                  </div>
                  <Leaf className="w-8 h-8 text-green-500" />
                </div>
              </div>
            </div>

            {/* Achievement Badges */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Achievements</h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-green-50 rounded-lg border border-green-100">
                  <div className="text-2xl mb-1">🏆</div>
                  <div className="text-xs font-medium text-green-700">Water Saver</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="text-2xl mb-1">⚡</div>
                  <div className="text-xs font-medium text-blue-700">Energy Efficient</div>
                </div>
                <div className="text-center p-3 bg-gray-100 rounded-lg border border-gray-200">
                  <div className="text-2xl mb-1">🔒</div>
                  <div className="text-xs font-medium text-gray-500">Eco Master</div>
                </div>
              </div>
            </div>

            {/* Daily Tip */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">💡 Today's Eco Tip</h3>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-100">
                <p className="text-green-800 text-sm font-medium mb-2">
                  Switch to LED Bulbs
                </p>
                <p className="text-green-700 text-sm">
                  LED bulbs use up to 80% less electricity than traditional incandescent bulbs and last 25 times longer!
                </p>
                <div className="mt-3 text-xs text-green-600">
                  💚 Potential savings: 50-100 kWh per year
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
