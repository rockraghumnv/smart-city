'use client';

import { useState } from 'react';
import { ArrowLeft, Search, MapPin, Clock, Users, Navigation } from 'lucide-react';
import Link from 'next/link';

export default function SmartBusPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoute, setSelectedRoute] = useState(null);

  // Mock bus data
  const busRoutes = [
    {
      id: 1,
      number: 'V-500C',
      name: 'Kempegowda Bus Station to Electronic City',
      crowdLevel: 'Low',
      crowdColor: 'green',
      nextArrival: '5 min',
      stops: ['Kempegowda Bus Station', 'Banashankari', 'BTM Layout', 'Silk Board', 'Electronic City']
    },
    {
      id: 2,
      number: 'G-9',
      name: 'Majestic to Whitefield',
      crowdLevel: 'High',
      crowdColor: 'red',
      nextArrival: '12 min',
      stops: ['Majestic', 'MG Road', 'Brigade Road', 'Indiranagar', 'Marathahalli', 'Whitefield']
    },
    {
      id: 3,
      number: 'AC-125',
      name: 'Airport to City Centre',
      crowdLevel: 'Medium',
      crowdColor: 'yellow',
      nextArrival: '8 min',
      stops: ['Kempegowda Airport', 'Hebbal', 'Yeshwanthpur', 'Malleswaram', 'City Centre']
    }
  ];

  const nearbyStops = [
    { name: 'Brigade Road', distance: '200m', buses: ['G-9', 'AC-40'] },
    { name: 'MG Road Metro', distance: '350m', buses: ['V-356', 'G-9'] },
    { name: 'Commercial Street', distance: '500m', buses: ['AC-125', 'V-500C'] }
  ];

  const filteredRoutes = busRoutes.filter(route => 
    route.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    route.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCrowdBadgeColor = (level) => {
    switch(level) {
      case 'Low': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'High': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center mb-8">
        <Link href="/" className="mr-4 p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Green Commute</h1>
          <p className="text-gray-600">Real-time bus tracking and crowd monitoring</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Search and Routes */}
        <div className="lg:col-span-2 space-y-6">
          {/* Search Bar */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Search by bus number or route name..."
              />
            </div>
          </div>

          {/* Bus Routes */}
          <div className="space-y-4">
            {filteredRoutes.map((route) => (
              <div key={route.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{route.number}</h3>
                    <p className="text-gray-600">{route.name}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getCrowdBadgeColor(route.crowdLevel)}`}>
                      {route.crowdLevel} Crowd
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-blue-600">
                      <Clock className="w-4 h-4 mr-1" />
                      <span className="text-sm font-medium">{route.nextArrival}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Users className="w-4 h-4 mr-1" />
                      <span className="text-sm">{route.crowdLevel}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedRoute(route)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    View Route
                  </button>
                </div>

                {selectedRoute && selectedRoute.id === route.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-2">Route Stops:</h4>
                    <div className="space-y-2">
                      {route.stops.map((stop, index) => (
                        <div key={index} className="flex items-center text-sm text-gray-600">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                          {stop}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Live Map Placeholder */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Navigation className="w-5 h-5 mr-2 text-blue-600" />
              Live Map
            </h3>
            <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <MapPin className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">Interactive map will load here</p>
                <p className="text-xs">Showing real-time bus locations</p>
              </div>
            </div>
          </div>

          {/* Nearby Stops */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Nearby Stops</h3>
            <div className="space-y-3">
              {nearbyStops.map((stop, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{stop.name}</p>
                    <p className="text-sm text-gray-600">{stop.distance} away</p>
                  </div>
                  <div className="text-right">
                    <div className="flex space-x-1">
                      {stop.buses.map((bus, busIndex) => (
                        <span key={busIndex} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          {bus}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Today's Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Buses Tracked</span>
                <span className="font-semibold">1,247</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Active Routes</span>
                <span className="font-semibold">89</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Avg Wait Time</span>
                <span className="font-semibold">8 min</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
