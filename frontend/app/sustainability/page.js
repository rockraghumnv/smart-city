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
import LevelSystem from './components/LevelSystem';
import SocialFeatures from './components/SocialFeatures';
import AdvancedAnalytics from './components/AdvancedAnalytics';
import SmartRecommendations from './components/SmartRecommendations';
import DataExport from './components/DataExport';

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
  const [activeTab, setActiveTab] = useState('overview');
  const [entries, setEntries] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedEntries = getEntries();
        setEntries(storedEntries);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Calculate current stats
  const today = new Date();
  const dailyTotals = calculateDailyTotals(entries, today);
  const earthScore = calculateEarthScore(dailyTotals);
  const weeklyData = calculateWeeklyAggregates(entries);  // Tab navigation
  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'log', label: 'Log Activity', icon: '📝' },
    { id: 'charts', label: 'Analytics', icon: '📈' },
    { id: 'badges', label: 'Achievements', icon: '🏆' },
    { id: 'level', label: 'Level Progress', icon: '🎯' },
    { id: 'social', label: 'Community', icon: '👥' },
    { id: 'recommendations', label: 'Smart Tips', icon: '💡' },
    { id: 'advanced', label: 'Insights', icon: '🔬' },
    { id: 'timeline', label: 'History', icon: '📅' },
    { id: 'export', label: 'Export', icon: '💾' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your impact data...</p>
        </div>
      </div>
    );
  }

  // Show empty state if no entries exist
  if (entries.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center mb-6">
            <Link href="/" className="mr-4">
              <ArrowLeft className="h-6 w-6 text-gray-600 hover:text-gray-800" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">MyImpact</h1>
          </div>
          <EmptyState onDataLoaded={() => setEntries(getEntries())} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Link href="/" className="mr-4">
              <ArrowLeft className="h-6 w-6 text-gray-600 hover:text-gray-800" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">MyImpact</h1>
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-white/50"
          >
            <Settings className="h-5 w-5" />
          </button>
        </div>        {/* Tab Navigation */}
        <div className="mb-6">
          {/* Primary tabs - always visible */}
          <div className="flex flex-wrap gap-1 mb-2 bg-white/50 p-1 rounded-xl">
            {tabs.slice(0, 5).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-0 px-3 py-2 rounded-lg font-medium transition-all text-xs sm:text-sm ${
                  activeTab === tab.id
                    ? 'bg-white text-green-700 shadow-md'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-white/30'
                }`}
              >
                <span className="text-xs">{tab.icon}</span>
                <span className="ml-1 hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
          
          {/* Secondary tabs - collapsible */}
          <div className="flex flex-wrap gap-1 bg-white/30 p-1 rounded-xl">
            {tabs.slice(5).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1 rounded-md font-medium transition-all text-xs ${
                  activeTab === tab.id
                    ? 'bg-white text-green-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                }`}
              >
                <span className="text-xs mr-1">{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <ScoreCard 
                  score={earthScore} 
                  dailyTotals={dailyTotals}
                  showSettings={showSettings}
                  onSettingsChange={() => setEntries(getEntries())}
                />
              </div>
              <div>
                <TipsCarousel />
              </div>
            </div>
            <ChartsPanel weeklyData={weeklyData} />
          </div>
        )}

        {activeTab === 'log' && (
          <LogForm onEntryAdded={() => setEntries(getEntries())} />
        )}

        {activeTab === 'charts' && (
          <ChartsPanel weeklyData={weeklyData} detailed={true} />
        )}

        {activeTab === 'badges' && (
          <Badges entries={entries} />
        )}        {activeTab === 'timeline' && (
          <Timeline 
            entries={entries} 
            onEntriesChange={() => setEntries(getEntries())}
          />
        )}

        {activeTab === 'level' && (
          <LevelSystem entries={entries} />
        )}

        {activeTab === 'social' && (
          <SocialFeatures 
            entries={entries} 
            userStats={{ earthScore, streak: 5 }} 
          />
        )}        {activeTab === 'advanced' && (
          <AdvancedAnalytics entries={entries} />
        )}

        {activeTab === 'recommendations' && (
          <SmartRecommendations 
            entries={entries} 
            userStats={{ earthScore, streak: 5 }} 
          />
        )}

        {activeTab === 'export' && (
          <DataExport entries={entries} />
        )}
      </div>
    </div>
  );
}
