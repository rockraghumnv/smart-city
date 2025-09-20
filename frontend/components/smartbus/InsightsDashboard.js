'use client';

import { MapPin, Route, Clock, Users, TrendingUp, Navigation, BarChart3, AlertCircle, Zap, Activity } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function InsightsDashboard({ buses = [], liveInstances = [] }) {
  // Calculate insights from the data
  const insights = [
    {
      title: "Most Connected Stop",
      value: "Majestic",
      description: "1200+ buses/day",
      icon: MapPin,
      gradient: "from-blue-500 to-purple-600",
      trend: "+12%",
      trendUp: true
    },
    {
      title: "Longest Route",
      value: "365",
      description: "18 stops coverage",
      icon: Route,
      gradient: "from-green-500 to-teal-600",
      trend: "2.5 hrs",
      trendUp: null
    },
    {
      title: "Peak Hours",
      value: "8AM - 10AM",
      description: "Highest traffic",
      icon: Clock,
      gradient: "from-orange-500 to-red-500",
      trend: "85% capacity",
      trendUp: false
    },
    {
      title: "Safest Choice",
      value: "Route G3",
      description: "Less crowded",
      icon: Users,
      gradient: "from-purple-500 to-pink-500",
      trend: "45% avg",
      trendUp: true
    }
  ];

  const additionalStats = [
    {
      title: "On-time Performance",
      value: "98.5%",
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Daily Passengers",
      value: "45,000+",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Active Routes",
      value: "250+",
      icon: Navigation,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    }
  ];

  // Real-time metrics from live instances
  const liveMetrics = {
    totalBuses: liveInstances.length,
    movingBuses: liveInstances.filter(bus => bus.isMoving).length,
    averageSpeed: liveInstances.length > 0 
      ? Math.round(liveInstances.reduce((sum, bus) => sum + bus.speed, 0) / liveInstances.length)
      : 0,
    totalPassengers: liveInstances.reduce((sum, bus) => sum + bus.crowdCount, 0),
    totalCapacity: liveInstances.reduce((sum, bus) => sum + bus.capacity, 0),
    onTimePercentage: liveInstances.length > 0
      ? Math.round((liveInstances.filter(bus => Math.abs(bus.delay) <= 2).length / liveInstances.length) * 100)
      : 0
  };

  const occupancyRate = liveMetrics.totalCapacity > 0 
    ? Math.round((liveMetrics.totalPassengers / liveMetrics.totalCapacity) * 100)
    : 0;

  // Add client-only time for hydration-safe rendering
  const [lastUpdated, setLastUpdated] = useState('');
  useEffect(() => {
    const update = () => setLastUpdated(new Date().toLocaleTimeString());
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Live Insights Dashboard</h2>
          <p className="text-gray-600">Real-time bus network analytics and performance metrics</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span>Live Updates</span>
        </div>
      </div>

      {/* Live Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-1">
            <Activity className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Active Buses</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{liveMetrics.totalBuses}</div>
          <div className="text-xs text-gray-600">{liveMetrics.movingBuses} moving</div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-1">
            <Zap className="w-5 h-5 text-orange-600" />
            <span className="text-sm font-medium text-gray-700">Avg Speed</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{liveMetrics.averageSpeed}</div>
          <div className="text-xs text-gray-600">km/h</div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-1">
            <Users className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-gray-700">Occupancy</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{occupancyRate}%</div>
          <div className="text-xs text-gray-600">{liveMetrics.totalPassengers}/{liveMetrics.totalCapacity}</div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-1">
            <Clock className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-gray-700">On Time</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{liveMetrics.onTimePercentage}%</div>
          <div className="text-xs text-gray-600">performance</div>
        </div>
      </div>

      {/* Main Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {insights.map((insight, index) => {
          const IconComponent = insight.icon;
          return (
            <div
              key={index}
              className={`bg-gradient-to-br ${insight.gradient} rounded-xl p-6 text-white transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl`}
            >
              <div className="flex items-center justify-between mb-4">
                <IconComponent className="w-8 h-8" />
                <div className="flex items-center space-x-1">
                  {insight.trendUp === true && <TrendingUp className="w-4 h-4" />}
                  {insight.trendUp === false && <TrendingUp className="w-4 h-4 transform rotate-180" />}
                  <BarChart3 className="w-4 h-4 opacity-70" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">{insight.title}</h3>
              <div className="text-2xl font-bold mb-1">{insight.value}</div>
              <div className="flex items-center justify-between">
                <p className="text-sm opacity-90">{insight.description}</p>
                <span className={`text-xs px-2 py-1 rounded-full bg-white/20 ${
                  insight.trendUp === true ? 'text-green-100' :
                  insight.trendUp === false ? 'text-red-100' :
                  'text-white'
                }`}>
                  {insight.trend}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Additional Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {additionalStats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div key={index} className={`${stat.bgColor} rounded-xl p-6 text-center`}>
              <IconComponent className={`w-12 h-12 ${stat.color} mx-auto mb-3`} />
              <h3 className="text-xl font-bold text-gray-900 mb-2">{stat.value}</h3>
              <p className="text-gray-600">{stat.title}</p>
            </div>
          );
        })}
      </div>

      {/* Route Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Routes */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <Route className="w-5 h-5 mr-2 text-blue-600" />
            Popular Routes Today
          </h3>
          <div className="space-y-3">
            {buses.slice(0, 5).map((bus, index) => (
              <div key={bus.number} className="flex items-center justify-between p-3 bg-white rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-600">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Bus {bus.number}</div>
                    <div className="text-sm text-gray-600">{bus.route[0]} → {bus.route[bus.route.length - 1]}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">{bus.frequency}</div>
                  <div className="text-xs text-gray-600">{bus.fare}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Alerts */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 text-orange-600" />
            Live Alerts & Status
          </h3>
          <div className="space-y-3">
            {liveInstances.slice(0, 5).map((instance, index) => (
              <div key={instance.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    instance.delay > 5 ? 'bg-red-500' :
                    instance.delay > 0 ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`}></div>
                  <div>
                    <div className="font-medium text-gray-900">Bus {instance.busNumber}</div>
                    <div className="text-sm text-gray-600">
                      {instance.isMoving ? '🚌 Moving' : '⏸️ Stopped'} at {instance.currentStop}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-medium ${
                    instance.crowdStatus === 'Low' ? 'text-green-600' :
                    instance.crowdStatus === 'Medium' ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {instance.crowdStatus}
                  </div>
                  <div className="text-xs text-gray-600">{instance.eta}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <span>Last updated: {lastUpdated}</span>
            <span>•</span>
            <span>Next update in: 30s</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>All systems operational</span>
          </div>
        </div>
      </div>
    </div>
  );
}
