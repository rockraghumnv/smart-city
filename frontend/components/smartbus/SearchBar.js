'use client';

import { useState } from 'react';
import { Search, MapPin, Bus } from 'lucide-react';

export default function SearchBar({ onSearch, isLoading = false }) {
  const [searchType, setSearchType] = useState('bus'); // 'bus' or 'stop'
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    onSearch({ type: searchType, query: searchQuery.trim() });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Find Your Bus</h2>
      
      {/* Search Type Tabs */}
      <div className="flex justify-center mb-6">
        <div className="bg-gray-100 rounded-lg p-1 flex">
          <button
            onClick={() => setSearchType('bus')}
            className={`px-6 py-2 rounded-md font-medium transition-colors flex items-center space-x-2 ${
              searchType === 'bus'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Bus className="w-4 h-4" />
            <span>Search by Bus Number</span>
          </button>
          <button
            onClick={() => setSearchType('stop')}
            className={`px-6 py-2 rounded-md font-medium transition-colors flex items-center space-x-2 ${
              searchType === 'stop'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Search by Stop Name</span>
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
            onKeyPress={handleKeyPress}
            placeholder={
              searchType === 'bus' 
                ? 'Enter bus number (e.g., 360, G3, AC-125)' 
                : 'Enter stop name (e.g., Majestic, Brigade Road)'
            }
            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            disabled={isLoading}
          />
          <Search className="absolute right-3 top-3 w-6 h-6 text-gray-400" />
        </div>
        
        <button
          onClick={handleSearch}
          disabled={isLoading || !searchQuery.trim()}
          className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 shadow-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Searching...</span>
            </div>
          ) : (
            'Search Now'
          )}
        </button>
      </div>

      {/* Quick Search Suggestions */}
      <div className="mt-6 max-w-lg mx-auto">
        <p className="text-sm text-gray-600 mb-3 text-center">Popular searches:</p>
        <div className="flex flex-wrap justify-center gap-2">
          {searchType === 'bus' ? (
            <>
              {['360', 'G3', '365', 'AC-125', '500C'].map((bus) => (
                <button
                  key={bus}
                  onClick={() => {
                    setSearchQuery(bus);
                    onSearch({ type: 'bus', query: bus });
                  }}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                >
                  {bus}
                </button>
              ))}
            </>
          ) : (
            <>
              {['Majestic', 'Brigade Road', 'MG Road', 'Electronic City', 'Airport'].map((stop) => (
                <button
                  key={stop}
                  onClick={() => {
                    setSearchQuery(stop);
                    onSearch({ type: 'stop', query: stop });
                  }}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                >
                  {stop}
                </button>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
