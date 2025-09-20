'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, Leaf, Settings, Droplets, Zap, Car, Trash2, Recycle } from 'lucide-react';
import { calculateDailyTotals, calculateEarthScore } from '../lib/score';
import { getEntries, getSettings } from '../lib/storage';

// Type configuration for each sustainability metric
const TYPE_CONFIG = {
  water: {
    label: 'Water',
    color: '#3B82F6',
    icon: Droplets
  },
  electricity: {
    label: 'Electricity',
    color: '#EAB308',
    icon: Zap
  },
  travel: {
    label: 'Travel',
    color: '#10B981',
    icon: Car
  },
  waste: {
    label: 'Waste',
    color: '#EF4444',
    icon: Trash2
  },
  recycle: {
    label: 'Recycling',
    color: '#059669',
    icon: Recycle
  }
};

export default function ScoreCard({ entries, onRefresh }) {
  const [score, setScore] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettingsData] = useState(null);

  useEffect(() => {
    calculateScore();
  }, [entries]);

  const calculateScore = () => {
    const today = new Date();
    const dailyTotals = calculateDailyTotals(entries, today);
    const scoreData = calculateEarthScore(dailyTotals);
    const settingsData = getSettings();
    
    setScore(scoreData);
    setSettingsData(settingsData);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBackground = (score) => {
    if (score >= 80) return 'from-green-400 to-emerald-500';
    if (score >= 60) return 'from-yellow-400 to-orange-500';
    if (score >= 40) return 'from-orange-400 to-red-500';
    return 'from-red-400 to-red-600';
  };

  const getScoreMessage = (score) => {
    if (score >= 80) return 'Excellent! Keep up the great work!';
    if (score >= 60) return 'Good progress! Room for improvement.';
    if (score >= 40) return 'Making an effort! Try to do better.';
    return 'Let\'s work on improving your impact!';
  };

  if (!score) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-16 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Leaf className="w-6 h-6 text-green-500 mr-3" />
          <h2 className="text-xl font-bold text-gray-900">EarthScore</h2>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Settings className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Score Display */}
      <div className="text-center mb-6">
        <div className="relative w-32 h-32 mx-auto mb-4">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-gray-200"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 40}`}
              strokeDashoffset={`${2 * Math.PI * 40 * (1 - score.score / 100)}`}
              className={getScoreColor(score.score)}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-3xl font-bold ${getScoreColor(score.score)}`}>
              {score.score}
            </span>
          </div>
        </div>
        
        <div className={`inline-block px-4 py-2 rounded-full text-white font-medium bg-gradient-to-r ${getScoreBackground(score.score)}`}>
          {getScoreMessage(score.score)}
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Today's Impact</h4>
        {Object.entries(score.breakdown).map(([key, value]) => {
          if (key === 'bonus') {
            return (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">🌟 Bonus Points</span>
                <span className="font-medium text-green-600">+{value.toFixed(1)}</span>
              </div>
            );
          }
          
          const typeConfig = TYPE_CONFIG[key];
          if (!typeConfig) return null;
          
          const IconComponent = typeConfig.icon;
          return (
            <div key={key} className="flex items-center justify-between">
              <div className="flex items-center">
                <IconComponent className={`w-4 h-4 mr-2 ${
                  typeConfig.color === 'blue' ? 'text-blue-500' :
                  typeConfig.color === 'yellow' ? 'text-yellow-500' :
                  typeConfig.color === 'green' ? 'text-green-500' :
                  typeConfig.color === 'red' ? 'text-red-500' :
                  'text-emerald-500'
                }`} />
                <span className="text-sm text-gray-600 capitalize">{typeConfig.label}</span>
              </div>
              <span className="font-medium text-gray-900">{value.toFixed(1)} pts</span>
            </div>
          );
        })}
      </div>

      {/* Settings Panel */}
      {showSettings && settings && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="font-medium text-gray-900 mb-3">Score Calculation</h4>
          <div className="text-xs text-gray-600 space-y-1">
            <div><strong>Baselines (daily):</strong></div>
            <div>• Water: {settings.baselines.waterPerDay}L</div>
            <div>• Electricity: {settings.baselines.electricityPerDay}kWh</div>
            <div>• Travel: {settings.baselines.travelKmPerDay}km</div>
            <div>• Waste: {settings.baselines.wasteKgPerDay}kg</div>
            <div className="pt-2"><strong>Weights:</strong></div>
            <div>• Electricity: {(settings.weights.electricity * 100).toFixed(0)}%</div>
            <div>• Travel: {(settings.weights.travel * 100).toFixed(0)}%</div>
            <div>• Water: {(settings.weights.water * 100).toFixed(0)}%</div>
            <div>• Waste: {(settings.weights.waste * 100).toFixed(0)}%</div>
          </div>
        </div>
      )}
    </div>
  );
}
