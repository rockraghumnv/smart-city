'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Bus } from 'lucide-react';
import Link from 'next/link';

// Import modular components
import SearchBar from '@/components/smartbus/SearchBar';
import BusResults from '@/components/smartbus/BusResults';
import StopResults from '@/components/smartbus/StopResults';
import BusMap from '@/components/smartbus/BusMap';
import InsightsDashboard from '@/components/smartbus/InsightsDashboard';
import EmptyState from '@/components/smartbus/EmptyState';

// Import data and utilities
import { busRoutes, liveBusInstances, busStops, simulateBusMovement } from '@/data/smartbus/buses';

export default function GreenCommutePage() {
  const [searchResults, setSearchResults] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedBus, setSelectedBus] = useState(null);
  const [liveInstances, setLiveInstances] = useState(liveBusInstances);
  const [showMap, setShowMap] = useState(false);
  // Simulate live bus updates every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveInstances(prevInstances => 
        prevInstances.map(instance => simulateBusMovement(instance))
      );
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleSearch = async ({ type, query }) => {
    setIsSearching(true);
    setShowResults(false);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      if (type === 'bus') {
        const foundBus = busRoutes.find(bus => 
          bus.number.toLowerCase() === query.toLowerCase()
        );
        
        if (foundBus) {
          const liveInstance = liveInstances.find(instance => 
            instance.busNumber === foundBus.number
          );
          setSearchResults({ type: 'bus', data: foundBus, liveInstance });
        } else {
          setSearchResults({ type: 'notfound', searchType: 'bus', query });
        }
      } else {
        const normalizedQuery = query.toLowerCase();
        const foundStop = Object.keys(busStops).find(stop => 
          stop.toLowerCase() === normalizedQuery
        );
        
        if (foundStop) {
          const stopData = busStops[foundStop];
          const busesAtStop = stopData.buses.map(busNumber => 
            busRoutes.find(bus => bus.number === busNumber)
          ).filter(Boolean);
          
          setSearchResults({ 
            type: 'stop', 
            data: { ...stopData, name: foundStop }, 
            busesAtStop,
            liveInstances: liveInstances.filter(instance => 
              stopData.buses.includes(instance.busNumber)
            )
          });
        } else {
          setSearchResults({ type: 'notfound', searchType: 'stop', query });
        }
      }
    } catch (error) {
      setSearchResults({ type: 'error' });
    } finally {
      setIsSearching(false);
      setShowResults(true);
    }
  };

  const handleBusSelect = (busNumber) => {
    setSelectedBus(busNumber);
    setShowMap(true);
  };

  const handleReset = (searchParams) => {
    setShowResults(false);
    setSearchResults(null);
    setShowMap(false);
    setSelectedBus(null);
    
    if (searchParams) {
      handleSearch(searchParams);
    }
  };
      gradient: "from-purple-500 to-pink-500"
    }
  ];

  const handleSearch = () => {
    if (!searchQuery.trim()) return;

    if (searchType === 'bus') {
      const foundBus = buses.find(bus => 
        bus.number.toLowerCase() === searchQuery.toLowerCase()
      );
      if (foundBus) {
        setSearchResults({ type: 'bus', data: foundBus });
      } else {
        setSearchResults({ type: 'notfound', searchType: 'bus' });
      }
    } else {
      const stopName = searchQuery.toLowerCase();
      const foundStop = Object.keys(stops).find(stop => 
        stop.toLowerCase() === stopName
      );
      if (foundStop) {
        const busesAtStop = stops[foundStop].map(busNumber => 
          buses.find(bus => bus.number === busNumber)
        ).filter(Boolean);
        setSearchResults({ type: 'stop', data: { name: foundStop, buses: busesAtStop } });
      } else {
        setSearchResults({ type: 'notfound', searchType: 'stop' });
      }
    }
    setShowResults(true);
  };

  const getCrowdBadgeColor = (crowd) => {
    switch(crowd) {
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'High': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const BusResultCard = ({ bus }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Bus className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Bus {bus.number}</h3>
            <p className="text-gray-600">{bus.frequency}</p>
          </div>
        </div>
        <div className="text-right">
          <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${getCrowdBadgeColor(bus.crowd)}`}>
            {bus.crowd} Crowd
          </div>
          <div className="text-sm text-gray-600 mt-1">Next: {bus.nextArrival}</div>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-lg font-semibold mb-3">Route</h4>
        <div className="flex flex-wrap items-center gap-2">
          {bus.route.map((stop, index) => (
            <div key={stop} className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-green-500' : index === bus.route.length - 1 ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                <span className="text-sm font-medium">{stop}</span>
              </div>
              {index < bus.route.length - 1 && (
                <div className="w-8 h-0.5 bg-gray-300 mx-2"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-sm text-gray-600">Fare</div>
          <div className="text-lg font-bold text-gray-900">{bus.fare}</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-sm text-gray-600">Frequency</div>
          <div className="text-lg font-bold text-gray-900">{bus.frequency}</div>
        </div>
      </div>
    </div>
  );

  const StopResultCard = ({ stopData }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
          <MapPin className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900">{stopData.name}</h3>
          <p className="text-gray-600">{stopData.buses.length} buses available</p>
        </div>
      </div>

      <h4 className="text-lg font-semibold mb-3">Available Buses</h4>
      <div className="space-y-3">
        {stopData.buses.map((bus) => (
          <div key={bus.number} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Bus className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <div className="font-medium">Bus {bus.number}</div>
                <div className="text-sm text-gray-600">To {bus.route[bus.route.length - 1]}</div>
              </div>
            </div>
            <div className="text-right">
              <div className={`inline-flex px-2 py-1 rounded text-xs font-medium ${getCrowdBadgeColor(bus.crowd)}`}>
                {bus.crowd}
              </div>
              <div className="text-xs text-gray-600 mt-1">{bus.nextArrival}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const NotFoundCard = ({ searchType }) => (
    <div className="bg-white rounded-xl shadow-lg p-8 text-center mb-6">
      <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-xl font-bold text-gray-700 mb-2">
        {searchType === 'bus' ? 'Bus not found' : 'Stop not found'}
      </h3>
      <p className="text-gray-600 mb-4">
        {searchType === 'bus' 
          ? 'No bus found with that number. Try another number.' 
          : 'This stop has no buses right now.'}
      </p>
      <button
        onClick={() => {
          setShowResults(false);
          setSearchQuery('');
          setSearchResults(null);
        }}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
        Go Back to Search
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Dashboard
            </Link>
            <div className="flex items-center space-x-3">
              <Bus className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">GreenCommute</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Find Your Bus</h2>
          
          {/* Search Type Tabs */}
          <div className="flex justify-center mb-6">
            <div className="bg-gray-100 rounded-lg p-1 flex">
              <button
                onClick={() => setSearchType('bus')}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  searchType === 'bus'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}>
                Search by Bus Number
              </button>
              <button
                onClick={() => setSearchType('stop')}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  searchType === 'stop'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}>
                Search by Stop Name
              </button>
            </div>
          </div>

          {/* Search Input */}
          <div className="max-w-lg mx-auto">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder={
                  searchType === 'bus' 
                    ? 'Enter bus number (e.g., 360, G3)' 
                    : 'Enter stop name (e.g., Majestic, Brigade Road)'
                }
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              />
              <Search className="absolute right-3 top-3 w-6 h-6 text-gray-400" />
            </div>
            <button
              onClick={handleSearch}
              className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 shadow-lg font-semibold">
              Search Now
            </button>
          </div>
        </div>

        {/* Results Section */}
        {showResults && searchResults && (
          <div className="mb-8">
            {searchResults.type === 'bus' && <BusResultCard bus={searchResults.data} />}
            {searchResults.type === 'stop' && <StopResultCard stopData={searchResults.data} />}
            {searchResults.type === 'notfound' && <NotFoundCard searchType={searchResults.searchType} />}
          </div>
        )}

        {/* Insights Dashboard */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Insights of the Day</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {insights.map((insight, index) => {
              const IconComponent = insight.icon;
              return (
                <div
                  key={index}
                  className={`bg-gradient-to-br ${insight.gradient} rounded-xl p-6 text-white transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl`}>
                  <div className="flex items-center justify-between mb-4">
                    <IconComponent className="w-8 h-8" />
                    <BarChart3 className="w-6 h-6 opacity-70" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{insight.title}</h3>
                  <div className="text-2xl font-bold mb-1">{insight.value}</div>
                  <p className="text-sm opacity-90">{insight.description}</p>
                </div>
              );
            })}
          </div>

          {/* Additional Stats */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-xl p-6 text-center">
              <TrendingUp className="w-12 h-12 text-green-600 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">98.5%</h3>
              <p className="text-gray-600">On-time Performance</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 text-center">
              <Users className="w-12 h-12 text-blue-600 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">45,000+</h3>
              <p className="text-gray-600">Daily Passengers</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 text-center">
              <Navigation className="w-12 h-12 text-purple-600 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">250+</h3>
              <p className="text-gray-600">Active Routes</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
