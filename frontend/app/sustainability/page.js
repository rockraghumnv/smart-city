'use client';

import { useState } from 'react';
import { ArrowLeft, Droplets, Zap, Car, Leaf } from 'lucide-react';
import Link from 'next/link';

export default function SustainabilityPage() {
  const [formData, setFormData] = useState({
    water: '',
    electricity: '',
    transport: 'bus'
  });

  const [stats] = useState({
    waterSaved: 245,
    energySaved: 180,
    carbonReduced: 85,
    weeklyGoal: 300
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically save to a database
    alert('Daily impact logged successfully!');
    setFormData({ water: '', electricity: '', transport: 'bus' });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center mb-8">
        <Link href="/" className="mr-4 p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Impact</h1>
          <p className="text-gray-600">Track your daily sustainability habits</p>
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
                />
              </div>
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
                  <option value="bus">Public Bus</option>
                  <option value="metro">Metro</option>
                  <option value="bike">Bicycle</option>
                  <option value="walk">Walking</option>
                  <option value="car">Private Car</option>
                  <option value="motorcycle">Motorcycle</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Log Today's Impact
            </button>
          </form>
        </div>

        {/* Stats Dashboard */}
        <div className="space-y-6">
          {/* Weekly Progress */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Weekly Progress</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Sustainability Score</span>
                  <span>{stats.carbonReduced}/{stats.weeklyGoal}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${(stats.carbonReduced / stats.weeklyGoal) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Impact Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Water Saved</p>
                  <p className="text-2xl font-bold text-blue-700">{stats.waterSaved}L</p>
                </div>
                <Droplets className="w-8 h-8 text-blue-500" />
              </div>
            </div>

            <div className="bg-yellow-50 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-600 text-sm font-medium">Energy Saved</p>
                  <p className="text-2xl font-bold text-yellow-700">{stats.energySaved} kWh</p>
                </div>
                <Zap className="w-8 h-8 text-yellow-500" />
              </div>
            </div>

            <div className="bg-green-50 rounded-xl p-4 sm:col-span-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">CO₂ Reduced</p>
                  <p className="text-2xl font-bold text-green-700">{stats.carbonReduced} kg</p>
                  <p className="text-green-600 text-xs">This month</p>
                </div>
                <Leaf className="w-8 h-8 text-green-500" />
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Today's Tip</h3>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-green-800 text-sm">
                💡 Switch to LED bulbs to reduce electricity consumption by up to 80% 
                compared to traditional incandescent bulbs!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
