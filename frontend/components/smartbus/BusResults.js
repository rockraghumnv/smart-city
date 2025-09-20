'use client';

import { Bus, Users, Clock, MapPin, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { getCrowdStatus, formatETA } from '@/data/smartbus/buses';
import { useState } from 'react';

export default function BusResults({ bus, liveInstance = null, onTrackLive, onViewMap }) {
  const getCrowdBadgeColor = (crowd) => {
    switch(crowd) {
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'High': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDelayIcon = (delay) => {
    if (delay > 0) return <TrendingUp className="w-4 h-4 text-red-500" />;
    if (delay < 0) return <TrendingDown className="w-4 h-4 text-green-500" />;
    return <Minus className="w-4 h-4 text-gray-500" />;
  };

  const getDelayText = (delay) => {
    if (delay > 0) return `${delay} min delayed`;
    if (delay < 0) return `${Math.abs(delay)} min early`;
    return 'On time';
  };

  const crowdStatus = liveInstance ? 
    getCrowdStatus(liveInstance.crowdCount, liveInstance.capacity) : 
    bus.crowd || 'Medium';

  const [copied, setCopied] = useState(false);
  const handleShare = () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const shareText = `Check out Bus ${bus.number} on GreenCommute: ${url}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      {/* Bus Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Bus className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Bus {bus.number}</h3>
            <p className="text-gray-600">{bus.name || `Route ${bus.number}`}</p>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                bus.type === 'AC Premium' ? 'bg-purple-100 text-purple-800' :
                bus.type === 'Metro Feeder' ? 'bg-green-100 text-green-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {bus.type || 'Regular'}
              </span>
              <span className="text-sm text-gray-500">{bus.frequency}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${getCrowdBadgeColor(crowdStatus)}`}>
            <Users className="w-4 h-4 mr-1" />
            {crowdStatus} Crowd
          </div>
          {liveInstance && (
            <div className="text-sm text-gray-600 mt-1">
              {liveInstance.crowdCount}/{liveInstance.capacity} passengers
            </div>
          )}
        </div>
      </div>

      {/* Live Status */}
      {liveInstance && (
        <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${liveInstance.isMoving ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {liveInstance.isMoving ? 'Moving' : 'Stopped'} at {liveInstance.currentStop}
                </p>
                <p className="text-xs text-gray-600">
                  Next: {liveInstance.nextStop} • {liveInstance.direction}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-1 text-sm font-medium">
                <Clock className="w-4 h-4" />
                <span>{formatETA(parseInt(liveInstance.eta))}</span>
              </div>
              <div className="flex items-center space-x-1 text-xs text-gray-600 mt-1">
                {getDelayIcon(liveInstance.delay)}
                <span>{getDelayText(liveInstance.delay)}</span>
              </div>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-gray-600">
            <span>Speed: {liveInstance.speed} km/h</span>
            <span>Updated: {new Date(liveInstance.lastUpdated).toLocaleTimeString()}</span>
          </div>
        </div>
      )}

      {/* Route Visualization */}
      <div className="mb-4">
        <h4 className="text-lg font-semibold mb-3 flex items-center">
          <MapPin className="w-5 h-5 mr-2 text-gray-600" />
          Route
        </h4>
        <div className="flex flex-wrap items-center gap-2">
          {bus.route.map((stop, index) => {
            const isCurrentStop = liveInstance && liveInstance.currentStop === stop;
            const isNextStop = liveInstance && liveInstance.nextStop === stop;
            
            return (
              <div key={stop} className="flex items-center">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    isCurrentStop ? 'bg-blue-500 ring-2 ring-blue-200' :
                    isNextStop ? 'bg-orange-500 ring-2 ring-orange-200' :
                    index === 0 ? 'bg-green-500' : 
                    index === bus.route.length - 1 ? 'bg-red-500' : 
                    'bg-gray-400'
                  }`}></div>
                  <span className={`text-sm font-medium ${
                    isCurrentStop ? 'text-blue-600 font-bold' :
                    isNextStop ? 'text-orange-600 font-bold' :
                    'text-gray-700'
                  }`}>
                    {stop}
                  </span>
                  {(isCurrentStop || isNextStop) && (
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      isCurrentStop ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'
                    }`}>
                      {isCurrentStop ? 'Current' : 'Next'}
                    </span>
                  )}
                </div>
                {index < bus.route.length - 1 && (
                  <div className="w-8 h-0.5 bg-gray-300 mx-2"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bus Details Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-sm text-gray-600">Fare</div>
          <div className="text-lg font-bold text-gray-900">{bus.fare}</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-sm text-gray-600">Frequency</div>
          <div className="text-lg font-bold text-gray-900">{bus.frequency}</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-sm text-gray-600">Next Arrival</div>
          <div className="text-lg font-bold text-gray-900">
            {liveInstance ? formatETA(parseInt(liveInstance.eta)) : bus.nextArrival || '-- min'}
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-sm text-gray-600">Route Length</div>
          <div className="text-lg font-bold text-gray-900">{bus.route.length} stops</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex space-x-3">
        <button
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          onClick={() => onTrackLive && onTrackLive(bus.number)}
        >
          Track Live
        </button>
        <button
          className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          onClick={() => onViewMap && onViewMap(bus.number)}
        >
          View on Map
        </button>
        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors relative"
          onClick={handleShare}
        >
          {copied ? (
            <span className="text-green-600 font-semibold">Copied!</span>
          ) : (
            'Share Route'
          )}
        </button>
      </div>
    </div>
  );
}
