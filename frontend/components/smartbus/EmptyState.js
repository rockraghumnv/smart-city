'use client';

import { AlertCircle, Search, Bus, MapPin, RefreshCw } from 'lucide-react';

export default function EmptyState({ 
  type = 'search', // 'search', 'notfound', 'error', 'loading'
  searchType = 'bus',
  onRetry = () => {},
  onReset = () => {}
}) {
  const getStateConfig = () => {
    switch(type) {
      case 'search':
        return {
          icon: Search,
          title: 'Start Your Journey',
          description: 'Search for a bus number or stop name to get real-time information',
          actionText: 'Search Now',
          actionIcon: Search,
          showSuggestions: true
        };
      
      case 'notfound':
        return {
          icon: AlertCircle,
          title: searchType === 'bus' ? 'Bus Not Found' : 'Stop Not Found',
          description: searchType === 'bus' 
            ? 'No bus found with that number. Please check the number and try again.'
            : 'No stop found with that name. Please check the spelling and try again.',
          actionText: 'Try Again',
          actionIcon: RefreshCw,
          showSuggestions: true
        };
      
      case 'error':
        return {
          icon: AlertCircle,
          title: 'Something Went Wrong',
          description: 'We couldn\'t load the bus information. Please check your connection and try again.',
          actionText: 'Retry',
          actionIcon: RefreshCw,
          showSuggestions: false
        };
      
      case 'loading':
        return {
          icon: Bus,
          title: 'Loading...',
          description: 'Fetching real-time bus information for you',
          actionText: null,
          actionIcon: null,
          showSuggestions: false
        };
      
      default:
        return {
          icon: Search,
          title: 'Welcome to GreenCommute',
          description: 'Your smart bus tracking companion',
          actionText: 'Get Started',
          actionIcon: Search,
          showSuggestions: true
        };
    }
  };

  const config = getStateConfig();
  const IconComponent = config.icon;

  const popularBuses = ['360', 'G3', '365', 'AC-125', '500C'];
  const popularStops = ['Majestic', 'Brigade Road', 'MG Road', 'Electronic City', 'Airport'];

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 text-center">
      {/* Icon */}
      <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 ${
        type === 'loading' ? 'bg-blue-100' :
        type === 'error' || type === 'notfound' ? 'bg-red-100' :
        'bg-gray-100'
      }`}>
        <IconComponent className={`w-10 h-10 ${
          type === 'loading' ? 'text-blue-600 animate-pulse' :
          type === 'error' || type === 'notfound' ? 'text-red-600' :
          'text-gray-600'
        }`} />
      </div>

      {/* Title */}
      <h3 className="text-2xl font-bold text-gray-900 mb-3">
        {config.title}
      </h3>

      {/* Description */}
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        {config.description}
      </p>

      {/* Loading Animation */}
      {type === 'loading' && (
        <div className="flex items-center justify-center space-x-2 mb-6">
          <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      )}

      {/* Action Button */}
      {config.actionText && (
        <button
          onClick={type === 'notfound' || type === 'error' ? onRetry : onReset}
          className={`inline-flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
            type === 'error' || type === 'notfound'
              ? 'bg-red-600 text-white hover:bg-red-700'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {config.actionIcon && <config.actionIcon className="w-5 h-5" />}
          <span>{config.actionText}</span>
        </button>
      )}

      {/* Suggestions */}
      {config.showSuggestions && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-4">
            {type === 'notfound' ? 'Try searching for:' : 'Popular searches:'}
          </p>
          
          {/* Bus Suggestions */}
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-2 flex items-center justify-center">
              <Bus className="w-4 h-4 mr-1" />
              Popular Buses
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {popularBuses.map((bus) => (
                <button
                  key={bus}
                  onClick={() => onReset({ type: 'bus', query: bus })}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors"
                >
                  {bus}
                </button>
              ))}
            </div>
          </div>

          {/* Stop Suggestions */}
          <div>
            <p className="text-xs text-gray-500 mb-2 flex items-center justify-center">
              <MapPin className="w-4 h-4 mr-1" />
              Popular Stops
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {popularStops.map((stop) => (
                <button
                  key={stop}
                  onClick={() => onReset({ type: 'stop', query: stop })}
                  className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm hover:bg-green-200 transition-colors"
                >
                  {stop}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Help Text */}
      {type === 'search' && (
        <div className="mt-6 text-xs text-gray-500">
          💡 Tip: Use the search tabs above to switch between bus numbers and stop names
        </div>
      )}

      {type === 'notfound' && (
        <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
          <div className="flex items-center justify-center space-x-2 text-yellow-800">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Search Tips</span>
          </div>
          <ul className="text-xs text-yellow-700 mt-2 space-y-1">
            <li>• Check spelling of stop names</li>
            <li>• Use exact bus numbers (e.g., "360", not "360A")</li>
            <li>• Try popular destinations from the suggestions above</li>
          </ul>
        </div>
      )}
    </div>
  );
}
