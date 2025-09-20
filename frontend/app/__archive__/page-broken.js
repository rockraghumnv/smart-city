'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, BarChart3 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';

// Import components
import LogForm from './components/LogForm';
import ScoreCard from './components/ScoreCard';
import Timeline from './components/Timeline';
import ChartsPanel from './components/ChartsPanel';
import Badges from './components/Badges';
import TipsCarousel from './components/TipsCarousel';
import EmptyState from './components/EmptyState';

// Import data and utilities
import { sampleData } from './data/sampleData';
import { 
  getEntries, 
  addEntry, 
  updateEntry, 
  deleteEntry,
  getBadges,
  saveBadges
} from './lib/storage';
import { 
  calculateEarthScore, 
  checkAndAwardBadges,
  calculateDailyTotals 
} from './lib/score';
import { isDemoDataLoaded, clearAllData } from './lib/demo';

export default function SustainabilityPage() {
  return (
    <ProtectedRoute>
      <SustainabilityContent />
    </ProtectedRoute>
  );
}

function SustainabilityContent() {
  const router = useRouter();
  const [entries, setEntries] = useState([]);
  const [badges, setBadges] = useState([]);  const [tips, setTips] = useState([]);
  const [showLogForm, setShowLogForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState('overview'); // overview, charts, badges
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {        // Load entries
        const savedEntries = getEntries();
        setEntries(savedEntries);

        // Load badges
        const savedBadges = getBadges();
        setBadges(savedBadges);        // Load tips
        setTips(sampleData.tips);

        // Check if demo mode
        setIsDemoMode(isDemoDataLoaded());

        setIsLoading(false);
      } catch (error) {
        console.error('Error loading sustainability data:', error);
        setIsLoading(false);
      }
    };

    loadData();
  }, []);
  // Update badges when entries change
  useEffect(() => {
    if (entries.length > 0) {
      const updatedBadges = checkAndAwardBadges(entries);
      if (JSON.stringify(updatedBadges) !== JSON.stringify(badges)) {
        setBadges(updatedBadges);
        saveBadges(updatedBadges);
      }
    }
  }, [entries]);
  const handleAddEntry = (entryData) => {
    const newEntry = addEntry(entryData);
    setEntries(prev => [newEntry, ...prev]);
    setShowLogForm(false);
  };

  const handleEditEntry = (id, updatedData) => {
    const updated = updateEntry(id, updatedData);
    if (updated) {
      setEntries(prev => prev.map(entry => 
        entry.id === id ? updated : entry
      ));
    }
  };

  const handleDeleteEntry = (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      deleteEntry(id);
      setEntries(prev => prev.filter(entry => entry.id !== id));
    }
  };
  const calculateCurrentScore = () => {
    const dailyTotals = calculateDailyTotals(entries, new Date().toISOString().split('T')[0]);
    return calculateEarthScore(dailyTotals);
  };

  const calculateBadgeProgressData = () => {
    // For now, return empty object since we don't have this function
    return {};
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your sustainability data...</p>
        </div>
      </div>
    );
  }

  // Show empty state if no entries
  if (entries.length === 0 && !showLogForm) {
    return <EmptyState onStartLogging={() => setShowLogForm(true)} />;
  }

  const currentScore = calculateCurrentScore();
  const badgeProgress = calculateBadgeProgressData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/dashboard')}
              className="p-2 hover:bg-white hover:shadow-md rounded-lg transition-all"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                MyImpact {isDemoMode && <span className="text-sm bg-blue-100 text-blue-600 px-2 py-1 rounded-full ml-2">Demo Mode</span>}
              </h1>
              <p className="text-gray-600">Track your environmental footprint</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {isDemoMode && (
              <button
                onClick={() => {
                  clearAllData();
                  window.location.reload();
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded-lg font-medium text-sm transition-colors"
              >
                Reset Demo
              </button>
            )}
            <button
              onClick={() => setShowLogForm(true)}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-lg"
            >
              <Plus className="h-4 w-4" />
              Log Activity
            </button>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex gap-2 mb-6">
          {[
            { key: 'overview', label: 'Overview', icon: null },
            { key: 'charts', label: 'Analytics', icon: BarChart3 },
            { key: 'badges', label: 'Achievements', icon: null }
          ].map(view => (
            <button
              key={view.key}
              onClick={() => setCurrentView(view.key)}
              className={`
                px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors
                ${currentView === view.key
                  ? 'bg-white text-green-600 shadow-md'
                  : 'text-gray-600 hover:bg-white hover:shadow-sm'
                }
              `}
            >
              {view.icon && <view.icon className="h-4 w-4" />}
              {view.label}
            </button>
          ))}
        </div>

        {/* Main Content */}
        {currentView === 'overview' && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Score and Tips */}
            <div className="lg:col-span-1 space-y-6">
              <ScoreCard score={currentScore} entries={entries} />
              <TipsCarousel tips={tips} />
            </div>
            
            {/* Right Column - Timeline */}
            <div className="lg:col-span-2">
              <Timeline 
                entries={entries}
                onEditEntry={handleEditEntry}
                onDeleteEntry={handleDeleteEntry}
              />
            </div>
          </div>
        )}

        {currentView === 'charts' && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Score Card */}
            <div className="lg:col-span-1">
              <ScoreCard score={currentScore} entries={entries} />
            </div>
            
            {/* Right Column - Charts */}
            <div className="lg:col-span-2">
              <ChartsPanel entries={entries} />
            </div>
          </div>
        )}

        {currentView === 'badges' && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Score Card */}
            <div className="lg:col-span-1">
              <ScoreCard score={currentScore} entries={entries} />
            </div>
            
            {/* Right Column - Badges */}
            <div className="lg:col-span-2">
              <Badges 
                badges={badges}
                badgeProgress={badgeProgress}
              />
            </div>
          </div>
        )}

        {/* Log Form Modal */}
        {showLogForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
              <LogForm 
                onSubmit={handleAddEntry}
                onCancel={() => setShowLogForm(false)}
                presets={sampleData.presets}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
