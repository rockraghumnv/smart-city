'use client';

import { useState, useEffect } from 'react';
import { Trophy, Star, Target, TrendingUp } from 'lucide-react';
import { calculateEarthScore, calculateDailyTotals } from '../lib/score';
import { getEntries } from '../lib/storage';

// Level system configuration
const LEVEL_CONFIG = {
  1: { threshold: 0, title: 'Eco Newcomer', color: 'gray', icon: '🌱' },
  2: { threshold: 500, title: 'Green Explorer', color: 'green', icon: '🌿' },
  3: { threshold: 1500, title: 'Sustainability Hero', color: 'blue', icon: '🌍' },
  4: { threshold: 3000, title: 'Earth Guardian', color: 'purple', icon: '🌟' },
  5: { threshold: 5000, title: 'Climate Champion', color: 'gold', icon: '🏆' },
  6: { threshold: 8000, title: 'Eco Legend', color: 'emerald', icon: '👑' }
};

function calculateUserLevel(totalScore) {
  let level = 1;
  Object.entries(LEVEL_CONFIG).forEach(([levelNum, config]) => {
    if (totalScore >= config.threshold) {
      level = parseInt(levelNum);
    }
  });
  return level;
}

function calculateProgress(totalScore, currentLevel) {
  const nextLevel = currentLevel + 1;
  if (!LEVEL_CONFIG[nextLevel]) return 100; // Max level reached
  
  const currentThreshold = LEVEL_CONFIG[currentLevel].threshold;
  const nextThreshold = LEVEL_CONFIG[nextLevel].threshold;
  const progress = ((totalScore - currentThreshold) / (nextThreshold - currentThreshold)) * 100;
  
  return Math.min(100, Math.max(0, progress));
}

export default function LevelSystem({ entries }) {
  const [levelStats, setLevelStats] = useState({
    totalScore: 0,
    level: 1,
    progress: 0,
    nextLevelScore: 500
  });

  useEffect(() => {
    calculateLevelStats();
  }, [entries]);

  const calculateLevelStats = () => {
    // Calculate total EarthScore from all entries
    let totalScore = 0;
    const dailyScores = {};

    entries.forEach(entry => {
      const dateKey = entry.date.split('T')[0];
      if (!dailyScores[dateKey]) {
        const dayTotals = calculateDailyTotals(entries, new Date(entry.date));
        dailyScores[dateKey] = calculateEarthScore(dayTotals);
      }
    });

    totalScore = Object.values(dailyScores).reduce((sum, score) => sum + score, 0);
    
    const level = calculateUserLevel(totalScore);
    const progress = calculateProgress(totalScore, level);
    const nextLevelScore = LEVEL_CONFIG[level + 1]?.threshold || totalScore;

    setLevelStats({
      totalScore: Math.round(totalScore),
      level,
      progress: Math.round(progress),
      nextLevelScore
    });
  };

  const currentLevelConfig = LEVEL_CONFIG[levelStats.level];
  const nextLevelConfig = LEVEL_CONFIG[levelStats.level + 1];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      {/* Level Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">Level Progress</h2>
        <div className="flex items-center space-x-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          <span className="text-sm font-medium text-gray-600">
            Total Score: {levelStats.totalScore}
          </span>
        </div>
      </div>

      {/* Current Level Display */}
      <div className="text-center mb-6">
        <div className="text-6xl mb-2">{currentLevelConfig.icon}</div>
        <h3 className="text-2xl font-bold text-gray-800 mb-1">
          Level {levelStats.level}
        </h3>
        <p className={`text-lg font-medium text-${currentLevelConfig.color}-600 mb-4`}>
          {currentLevelConfig.title}
        </p>
        
        {/* Progress Bar */}
        {nextLevelConfig && (
          <div className="max-w-md mx-auto">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Current Level</span>
              <span>Next Level ({nextLevelConfig.title})</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <div 
                className={`h-3 bg-gradient-to-r from-${currentLevelConfig.color}-400 to-${currentLevelConfig.color}-600 rounded-full transition-all duration-500`}
                style={{ width: `${levelStats.progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600">
              {levelStats.nextLevelScore - levelStats.totalScore} points to next level
            </p>
          </div>
        )}
      </div>

      {/* Level Benefits */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 mb-6">
        <h4 className="font-medium text-gray-800 mb-3 flex items-center">
          <Star className="h-4 w-4 mr-2 text-yellow-500" />
          Level Perks
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="flex items-center text-green-700">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            Advanced analytics unlocked
          </div>
          <div className="flex items-center text-blue-700">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
            Weekly reports enabled
          </div>
          {levelStats.level >= 3 && (
            <>
              <div className="flex items-center text-purple-700">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                Community features unlocked
              </div>
              <div className="flex items-center text-orange-700">
                <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                Export data feature
              </div>
            </>
          )}
          {levelStats.level >= 5 && (
            <div className="flex items-center text-pink-700 sm:col-span-2">
              <div className="w-2 h-2 bg-pink-500 rounded-full mr-2"></div>
              Elite environmental impact dashboard
            </div>
          )}
        </div>
      </div>

      {/* Level History */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {Object.entries(LEVEL_CONFIG).slice(0, levelStats.level + 1).map(([levelNum, config]) => (
          <div 
            key={levelNum}
            className={`text-center p-3 rounded-lg border-2 transition-all ${
              parseInt(levelNum) === levelStats.level
                ? `border-${config.color}-300 bg-${config.color}-50 shadow-md`
                : parseInt(levelNum) < levelStats.level
                ? 'border-gray-200 bg-gray-50'
                : 'border-gray-100 bg-gray-25 opacity-50'
            }`}
          >
            <div className="text-2xl mb-1">{config.icon}</div>
            <div className="text-xs font-medium text-gray-700">
              Level {levelNum}
            </div>
            {parseInt(levelNum) === levelStats.level && (
              <div className="text-xs text-green-600 font-medium mt-1">Current</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
