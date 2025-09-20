'use client';

import { useState, useEffect } from 'react';
import { Lightbulb, Target, TrendingDown, Star, Calendar, CheckCircle } from 'lucide-react';
import { calculateDailyTotals, calculateEarthScore } from '../lib/score';
import { getEntries, getSettings } from '../lib/storage';
import { format, subDays, isAfter } from 'date-fns';

// Smart recommendation engine
const generateRecommendations = (entries, userStats) => {
  const recommendations = [];
  const recentDays = 7;
  const recentEntries = entries.filter(entry => 
    isAfter(new Date(entry.date), subDays(new Date(), recentDays))
  );

  // Calculate recent averages
  const recentAverages = {
    water: 0,
    electricity: 0,
    travel: 0,
    waste: 0
  };

  if (recentEntries.length > 0) {
    const dailyTotals = [];
    for (let i = 0; i < recentDays; i++) {
      const date = subDays(new Date(), i);
      dailyTotals.push(calculateDailyTotals(entries, date));
    }

    Object.keys(recentAverages).forEach(key => {
      recentAverages[key] = dailyTotals.reduce((sum, day) => sum + day[key], 0) / recentDays;
    });
  }

  // Water recommendations
  if (recentAverages.water > 150) {
    recommendations.push({
      id: 'water-high',
      type: 'water',
      priority: 'high',
      title: 'Reduce Water Consumption',
      description: 'Your daily water usage is above recommended levels. Try shorter showers and fix leaky faucets.',
      impact: 'Save 30-50L per day',
      difficulty: 'Easy',
      icon: '💧',
      actions: [
        'Take 5-minute showers instead of 10+ minutes',
        'Turn off tap while brushing teeth',
        'Use a bucket instead of hose for car washing',
        'Install water-efficient fixtures'
      ],
      savings: { water: 40, co2: 0.2, money: 15 }
    });
  } else if (recentAverages.water < 100) {
    recommendations.push({
      id: 'water-excellent',
      type: 'water',
      priority: 'low',
      title: 'Excellent Water Conservation!',
      description: 'You\'re doing amazing with water usage. Keep up the great work!',
      impact: 'Maintain current habits',
      difficulty: 'Easy',
      icon: '🌟',
      actions: ['Continue current practices', 'Share tips with family/friends'],
      savings: { water: 0, co2: 0, money: 0 }
    });
  }

  // Electricity recommendations
  if (recentAverages.electricity > 15) {
    recommendations.push({
      id: 'electricity-high',
      type: 'electricity',
      priority: 'high',
      title: 'Optimize Energy Usage',
      description: 'Your electricity consumption is high. Focus on energy-efficient practices.',
      impact: 'Save 3-5 kWh daily',
      difficulty: 'Medium',
      icon: '⚡',
      actions: [
        'Switch to LED bulbs',
        'Unplug electronics when not in use',
        'Use fans instead of AC when possible',
        'Set AC to 24°C instead of 18°C'
      ],
      savings: { electricity: 4, co2: 2, money: 120 }
    });
  }

  // Travel recommendations
  const ecoTravelRatio = recentEntries.filter(e => 
    e.type === 'travel' && ['walk', 'bike', 'bus'].includes(e.meta?.mode)
  ).length / Math.max(1, recentEntries.filter(e => e.type === 'travel').length);

  if (ecoTravelRatio < 0.6) {
    recommendations.push({
      id: 'travel-eco',
      type: 'travel',
      priority: 'medium',
      title: 'Choose Greener Transportation',
      description: 'Consider eco-friendly transport options for your daily commute.',
      impact: 'Reduce 5-10kg CO₂ weekly',
      difficulty: 'Medium',
      icon: '🚲',
      actions: [
        'Walk or bike for distances under 3km',
        'Use public transport for longer trips',
        'Carpool with colleagues',
        'Work from home when possible'
      ],
      savings: { travel: 10, co2: 8, money: 200 }
    });
  }

  // Waste recommendations
  if (recentAverages.waste > 2) {
    recommendations.push({
      id: 'waste-reduce',
      type: 'waste',
      priority: 'medium',
      title: 'Minimize Waste Generation',
      description: 'Your waste production is above average. Focus on reduction and recycling.',
      impact: 'Reduce 0.5-1kg daily waste',
      difficulty: 'Easy',
      icon: '♻️',
      actions: [
        'Start composting organic waste',
        'Use reusable bags and containers',
        'Buy products with minimal packaging',
        'Repair items instead of throwing away'
      ],
      savings: { waste: 0.7, co2: 1, money: 50 }
    });
  }

  // Seasonal recommendations
  const month = new Date().getMonth();
  if (month >= 3 && month <= 5) { // Summer months
    recommendations.push({
      id: 'summer-tips',
      type: 'seasonal',
      priority: 'low',
      title: 'Summer Energy Savings',
      description: 'Beat the heat while saving energy during summer months.',
      impact: 'Save 20-30% on cooling costs',
      difficulty: 'Easy',
      icon: '🌞',
      actions: [
        'Use ceiling fans to feel 4°C cooler',
        'Close curtains during day to block heat',
        'Set AC timer to turn off at night',
        'Wear light, breathable clothing'
      ],
      savings: { electricity: 6, co2: 3, money: 180 }
    });
  }

  // Goal-based recommendations
  if (userStats.earthScore < 50) {
    recommendations.push({
      id: 'score-improve',
      type: 'goal',
      priority: 'high',
      title: 'Boost Your EarthScore',
      description: 'Focus on these key areas to significantly improve your environmental impact.',
      impact: 'Increase EarthScore by 20-30 points',
      difficulty: 'Medium',
      icon: '🎯',
      actions: [
        'Log activities consistently every day',
        'Focus on your highest consumption areas',
        'Set daily targets for each category',
        'Review progress weekly'
      ],
      savings: { earthScore: 25, co2: 5, money: 100 }
    });
  }

  return recommendations.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
};

export default function SmartRecommendations({ entries, userStats }) {
  const [recommendations, setRecommendations] = useState([]);
  const [completedActions, setCompletedActions] = useState(new Set());
  const [showOnlyActionable, setShowOnlyActionable] = useState(false);

  useEffect(() => {
    const recs = generateRecommendations(entries, userStats);
    setRecommendations(recs);
  }, [entries, userStats]);

  const toggleActionCompletion = (recommendationId, actionIndex) => {
    const actionKey = `${recommendationId}-${actionIndex}`;
    const newCompleted = new Set(completedActions);
    
    if (newCompleted.has(actionKey)) {
      newCompleted.delete(actionKey);
    } else {
      newCompleted.add(actionKey);
    }
    
    setCompletedActions(newCompleted);
    
    // Store in localStorage
    localStorage.setItem('completedActions', JSON.stringify([...newCompleted]));
  };

  useEffect(() => {
    // Load completed actions from localStorage
    const saved = localStorage.getItem('completedActions');
    if (saved) {
      setCompletedActions(new Set(JSON.parse(saved)));
    }
  }, []);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-50 border-red-200 text-red-800';
      case 'medium': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'low': return 'bg-green-50 border-green-200 text-green-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600';
      case 'Medium': return 'text-yellow-600';
      case 'Hard': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const filteredRecommendations = showOnlyActionable 
    ? recommendations.filter(rec => rec.priority !== 'low')
    : recommendations;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
            Smart Recommendations
          </h2>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showOnlyActionable}
              onChange={(e) => setShowOnlyActionable(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-600">Show actionable only</span>
          </label>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600">{recommendations.length}</div>
            <div className="text-sm text-blue-700">Total Recommendations</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600">{completedActions.size}</div>
            <div className="text-sm text-green-700">Actions Completed</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {recommendations.filter(r => r.priority === 'high').length}
            </div>
            <div className="text-sm text-yellow-700">High Priority</div>
          </div>
        </div>
      </div>

      {/* Recommendations List */}
      <div className="space-y-4">
        {filteredRecommendations.map((rec) => (
          <div key={rec.id} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-3">
                <div className="text-3xl">{rec.icon}</div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{rec.title}</h3>
                  <p className="text-gray-600 text-sm">{rec.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(rec.priority)}`}>
                  {rec.priority.toUpperCase()}
                </span>
                <span className={`text-xs font-medium ${getDifficultyColor(rec.difficulty)}`}>
                  {rec.difficulty}
                </span>
              </div>
            </div>

            {/* Impact & Savings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-sm font-medium text-gray-700 mb-1">Expected Impact</div>
                <div className="text-gray-800">{rec.impact}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-sm font-medium text-gray-700 mb-1">Potential Savings</div>
                <div className="text-gray-800 text-sm">
                  {rec.savings.water > 0 && `💧 ${rec.savings.water}L/day`}
                  {rec.savings.electricity > 0 && ` ⚡ ${rec.savings.electricity}kWh/day`}
                  {rec.savings.co2 > 0 && ` 🌱 ${rec.savings.co2}kg CO₂/day`}
                  {rec.savings.money > 0 && ` 💰 ₹${rec.savings.money}/month`}
                </div>
              </div>
            </div>

            {/* Action Items */}
            <div>
              <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                <Target className="h-4 w-4 mr-2 text-blue-600" />
                Action Steps
              </h4>
              <div className="space-y-2">
                {rec.actions.map((action, index) => {
                  const actionKey = `${rec.id}-${index}`;
                  const isCompleted = completedActions.has(actionKey);
                  
                  return (
                    <label 
                      key={index}
                      className="flex items-start space-x-3 cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={isCompleted}
                        onChange={() => toggleActionCompletion(rec.id, index)}
                        className="mt-1 rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span className={`text-sm flex-1 ${isCompleted ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                        {action}
                      </span>
                      {isCompleted && (
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      )}
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Progress</span>
                <span>
                  {rec.actions.filter((_, index) => completedActions.has(`${rec.id}-${index}`)).length} / {rec.actions.length}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all"
                  style={{ 
                    width: `${(rec.actions.filter((_, index) => completedActions.has(`${rec.id}-${index}`)).length / rec.actions.length) * 100}%` 
                  }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredRecommendations.length === 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Great Job!</h3>
          <p className="text-gray-600">
            {showOnlyActionable 
              ? "No high-priority recommendations at the moment. You're doing excellent!"
              : "You're following all our recommendations. Keep up the fantastic work!"
            }
          </p>
        </div>
      )}

      {/* Weekly Challenge */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl shadow-lg p-6 border border-purple-200">
        <h3 className="text-lg font-bold text-purple-800 mb-3 flex items-center">
          <Star className="h-5 w-5 mr-2 text-purple-600" />
          Weekly Challenge
        </h3>
        <div className="bg-white rounded-lg p-4">
          <h4 className="font-medium text-gray-800 mb-2">Zero Waste Wednesday</h4>
          <p className="text-gray-600 text-sm mb-3">
            Challenge yourself to generate zero waste this Wednesday. Plan meals, use reusable containers, and avoid single-use items.
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-purple-600 font-medium">Reward: 🏆 Waste Warrior Badge</span>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition-colors">
              Accept Challenge
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
