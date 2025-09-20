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
import ProtectedRoute from '@/components/ProtectedRoute';

// Import data and utilities
import { busRoutes, liveBusInstances, busStops, simulateBusMovement } from '@/data/smartbus/buses';

export default function GreenCommutePage() {
  return (
    <ProtectedRoute>
      <GreenCommuteContent />
    </ProtectedRoute>
  );
}

function GreenCommuteContent() {
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
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowMap(!showMap)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  showMap ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {showMap ? 'Hide Map' : 'Show Map'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search Section */}
        <SearchBar onSearch={handleSearch} isLoading={isSearching} />

        {/* Map Section */}
        {showMap && (
          <div className="mb-8">
            <BusMap
              buses={busRoutes}
              liveInstances={liveInstances}
              selectedBus={selectedBus}
              onBusSelect={handleBusSelect}
            />
          </div>
        )}

        {/* Loading State */}
        {isSearching && (
          <EmptyState type="loading" />
        )}

        {/* Results Section */}
        {showResults && searchResults && !isSearching && (
          <div className="mb-8">
            {searchResults.type === 'bus' && (
              <BusResults 
                bus={searchResults.data} 
                liveInstance={searchResults.liveInstance}
                onTrackLive={(busNumber) => {
                  setSelectedBus(busNumber);
                  setShowMap(true);
                }}
                onViewMap={(busNumber) => {
                  setSelectedBus(busNumber);
                  setShowMap(true);
                }}
              />
            )}
            {searchResults.type === 'stop' && (
              <StopResults 
                stopData={searchResults.data}
                busesAtStop={searchResults.busesAtStop}
                liveInstances={searchResults.liveInstances}
              />
            )}
            {(searchResults.type === 'notfound' || searchResults.type === 'error') && (
              <EmptyState 
                type={searchResults.type}
                searchType={searchResults.searchType}
                onRetry={() => handleSearch({ type: searchResults.searchType, query: searchResults.query })}
                onReset={handleReset}
              />
            )}
          </div>
        )}

        {/* Default Empty State */}
        {!showResults && !isSearching && (
          <div className="mb-8">
            <EmptyState type="search" onReset={handleReset} />
          </div>
        )}

        {/* Insights Dashboard */}
        <InsightsDashboard buses={busRoutes} liveInstances={liveInstances} />
      </div>
    </div>
  );
}
