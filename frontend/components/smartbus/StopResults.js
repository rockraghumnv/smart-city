'use client';

import { MapPin, Bus, Users, Clock, Wifi, Car, Utensils, Building } from 'lucide-react';
import { getCrowdStatus, formatETA } from '@/data/smartbus/buses';

export default function StopResults({ stopData, busesAtStop = [], liveInstances = [] }) {
  const getCrowdBadgeColor = (crowd) => {
    switch(crowd) {
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'High': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getFacilityIcon = (facility) => {
    switch(facility.toLowerCase()) {
      case 'restroom': return '🚻';
      case 'food court': return <Utensils className="w-4 h-4" />;
      case 'atm': return '🏧';
      case 'waiting area': return '🪑';
      case 'shelter': return '🏠';
      case 'seating': return '💺';
      case 'metro connection': return '🚇';
      case 'shopping': return '🛍️';
      case 'parking': return <Car className="w-4 h-4" />;
      case 'wifi': return <Wifi className="w-4 h-4" />;
      case 'terminal': return <Building className="w-4 h-4" />;
      default: return '📍';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      {/* Stop Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            stopData.isTerminal ? 'bg-purple-100' : 'bg-green-100'
          }`}>
            <MapPin className={`w-6 h-6 ${
              stopData.isTerminal ? 'text-purple-600' : 'text-green-600'
            }`} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">{stopData.name}</h3>
            <div className="flex items-center space-x-3 mt-1">
              <p className="text-gray-600">{busesAtStop.length} buses available</p>
              {stopData.isTerminal && (
                <span className="inline-flex px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800">
                  Terminal
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${getCrowdBadgeColor(stopData.crowdLevel)}`}>
            <Users className="w-4 h-4 mr-1" />
            {stopData.crowdLevel} Crowd
          </div>
          <div className="text-sm text-gray-600 mt-1">
            Lat: {stopData.coordinates.lat.toFixed(4)}, Lng: {stopData.coordinates.lng.toFixed(4)}
          </div>
        </div>
      </div>

      {/* Facilities */}
      {stopData.facilities && stopData.facilities.length > 0 && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold mb-3">Facilities Available</h4>
          <div className="flex flex-wrap gap-2">
            {stopData.facilities.map((facility, index) => (
              <div key={index} className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg">
                <span className="text-sm">{getFacilityIcon(facility)}</span>
                <span className="text-sm font-medium text-gray-700">{facility}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Buses */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold mb-4 flex items-center">
          <Bus className="w-5 h-5 mr-2 text-gray-600" />
          Available Buses ({busesAtStop.length})
        </h4>
        
        {busesAtStop.length > 0 ? (
          <div className="space-y-3">
            {busesAtStop.map((bus) => {
              const liveInstance = liveInstances.find(instance => instance.busNumber === bus.number);
              const crowdStatus = liveInstance ? 
                getCrowdStatus(liveInstance.crowdCount, liveInstance.capacity) : 
                'Medium';

              return (
                <div key={bus.number} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Bus className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Bus {bus.number}</div>
                      <div className="text-sm text-gray-600">
                        To {bus.route[bus.route.length - 1]} • {bus.frequency}
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                          bus.type === 'AC Premium' ? 'bg-purple-100 text-purple-800' :
                          bus.type === 'Metro Feeder' ? 'bg-green-100 text-green-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {bus.type || 'Regular'}
                        </span>
                        <span className="text-xs text-gray-500">Fare: {bus.fare}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`inline-flex px-2 py-1 rounded text-xs font-medium mb-2 ${getCrowdBadgeColor(crowdStatus)}`}>
                      {crowdStatus}
                    </div>
                    <div className="flex items-center space-x-1 text-sm font-medium text-gray-900">
                      <Clock className="w-4 h-4" />
                      <span>
                        {liveInstance ? formatETA(parseInt(liveInstance.eta)) : bus.nextArrival || '-- min'}
                      </span>
                    </div>
                    {liveInstance && (
                      <div className="text-xs text-gray-600 mt-1">
                        {liveInstance.crowdCount}/{liveInstance.capacity} passengers
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Bus className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No buses currently available at this stop</p>
          </div>
        )}
      </div>

      {/* Real-time Updates */}
      <div className="border-t pt-4">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Live updates</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex space-x-3">
        <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium">
          View on Map
        </button>
        <button className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium">
          Get Directions
        </button>
        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
          Share Location
        </button>
      </div>
    </div>
  );
}
