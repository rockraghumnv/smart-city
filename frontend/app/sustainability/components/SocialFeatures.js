'use client';

import { useState, useEffect } from 'react';
import { Users, Share2, MessageCircle, Heart, Award, Globe, Trophy, Target } from 'lucide-react';
import { calculateEarthScore, calculateDailyTotals } from '../lib/score';
import { getEntries } from '../lib/storage';

// Mock community data
const COMMUNITY_DATA = [
  {
    id: 'u1',
    name: 'Alex Johnson',
    avatar: '👨‍💼',
    earthScore: 89,
    level: 4,
    streak: 12,
    location: 'Mumbai',
    badges: ['🏆', '💧', '⚡'],
    recentActivity: 'Saved 50L water today!'
  },
  {
    id: 'u2', 
    name: 'Priya Sharma',
    avatar: '👩‍🔬',
    earthScore: 85,
    level: 3,
    streak: 8,
    location: 'Delhi',
    badges: ['🌱', '🚴', '♻️'],
    recentActivity: 'Cycled 15km this week!'
  },
  {
    id: 'u3',
    name: 'Rajesh Kumar',
    avatar: '👨‍🌾',
    earthScore: 92,
    level: 5,
    streak: 25,
    location: 'Bangalore',
    badges: ['👑', '🌟', '🌍', '💚'],
    recentActivity: 'Achieved zero waste day!'
  }
];

const CHALLENGES = [
  {
    id: 'c1',
    title: 'Zero Waste Week',
    description: 'Generate less than 1kg of waste daily for 7 days',
    participants: 234,
    deadline: '2024-01-15',
    reward: '🏆 Waste Warrior Badge',
    difficulty: 'Hard',
    progress: 45
  },
  {
    id: 'c2', 
    title: 'Water Conservation Challenge',
    description: 'Use less than 100L of water daily for 5 days',
    participants: 156,
    deadline: '2024-01-10',
    reward: '💧 Water Guardian Badge',
    difficulty: 'Medium',
    progress: 78
  },
  {
    id: 'c3',
    title: 'Green Commute Month',
    description: 'Use only eco-friendly transport for 30 days',
    participants: 89,
    deadline: '2024-01-31',
    reward: '🚴 Eco Commuter Badge',
    difficulty: 'Easy',
    progress: 23
  }
];

export default function SocialFeatures({ entries, userStats }) {
  const [activeTab, setActiveTab] = useState('leaderboard');
  const [userRank, setUserRank] = useState(null);

  useEffect(() => {
    calculateUserRank();
  }, [entries]);

  const calculateUserRank = () => {
    // Calculate user's current EarthScore
    const today = new Date();
    const dailyTotals = calculateDailyTotals(entries, today);
    const userScore = calculateEarthScore(dailyTotals);
    
    // Simulate ranking
    const usersWithScore = [...COMMUNITY_DATA, { 
      id: 'current-user', 
      name: 'You',
      earthScore: userScore,
      level: Math.floor(userScore / 20) + 1,
      streak: userStats?.streak || 0
    }].sort((a, b) => b.earthScore - a.earthScore);
    
    const rank = usersWithScore.findIndex(user => user.id === 'current-user') + 1;
    setUserRank(rank);
  };

  const shareProgress = () => {
    const today = new Date();
    const dailyTotals = calculateDailyTotals(entries, today);
    const score = calculateEarthScore(dailyTotals);
    
    const message = `🌱 Just achieved an EarthScore of ${score} today! Join me in tracking sustainability habits with MyImpact! #EcoFriendly #Sustainability`;
    
    if (navigator.share) {
      navigator.share({
        title: 'My EarthScore Progress',
        text: message,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(message);
      alert('Progress copied to clipboard! Share it on social media 🌱');
    }
  };

  const tabs = [
    { id: 'leaderboard', label: 'Leaderboard', icon: <Trophy className="h-4 w-4" /> },
    { id: 'challenges', label: 'Challenges', icon: <Target className="h-4 w-4" /> },
    { id: 'community', label: 'Community', icon: <Users className="h-4 w-4" /> }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <Globe className="h-5 w-5 mr-2 text-blue-600" />
          Community
        </h2>
        <button
          onClick={shareProgress}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
        >
          <Share2 className="h-4 w-4" />
          <span className="text-sm">Share Progress</span>
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-md font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {tab.icon}
            <span className="text-sm">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'leaderboard' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-800 font-medium">Your Current Rank</p>
                <p className="text-2xl font-bold text-orange-900">#{userRank}</p>
                <p className="text-sm text-orange-700">Keep improving to climb higher!</p>
              </div>
              <div className="text-3xl">🎯</div>
            </div>
          </div>

          <div className="space-y-3">
            {COMMUNITY_DATA.map((user, index) => (
              <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-bold text-sm">
                    #{index + 1}
                  </div>
                  <div className="text-2xl">{user.avatar}</div>
                  <div>
                    <p className="font-medium text-gray-800">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.location}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">{user.earthScore}</p>
                  <div className="flex space-x-1">
                    {user.badges.slice(0, 3).map((badge, i) => (
                      <span key={i} className="text-sm">{badge}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'challenges' && (
        <div className="space-y-4">
          {CHALLENGES.map((challenge) => (
            <div key={challenge.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-medium text-gray-800 mb-1">{challenge.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{challenge.description}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>👥 {challenge.participants} participants</span>
                    <span>📅 Until {challenge.deadline}</span>
                    <span className={`px-2 py-1 rounded-full ${
                      challenge.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                      challenge.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {challenge.difficulty}
                    </span>
                  </div>
                </div>
                <div className="text-2xl">{challenge.reward.split(' ')[0]}</div>
              </div>
              
              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress</span>
                  <span>{challenge.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${challenge.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">🎁 {challenge.reward}</span>
                <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm font-medium hover:bg-blue-200 transition-colors">
                  Join Challenge
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'community' && (
        <div className="space-y-4">
          {/* Recent Activities */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-800 mb-3">Recent Community Activities</h3>
            {COMMUNITY_DATA.map((user) => (
              <div key={user.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="text-xl">{user.avatar}</div>
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-medium text-gray-800">{user.name}</span>
                    <span className="text-gray-600 ml-1">{user.recentActivity}</span>
                  </p>
                  <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                    <span>🔥 {user.streak} day streak</span>
                    <span>📍 {user.location}</span>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <button className="p-1 text-gray-400 hover:text-red-500 transition-colors">
                    <Heart className="h-4 w-4" />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-blue-500 transition-colors">
                    <MessageCircle className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* City Impact */}
          <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4 border border-blue-200">
            <h3 className="font-medium text-gray-800 mb-3 flex items-center">
              <Globe className="h-4 w-4 mr-2 text-blue-600" />
              Mumbai Community Impact
            </h3>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-blue-600">2.5M</p>
                <p className="text-sm text-gray-600">Liters Saved</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">1,240</p>
                <p className="text-sm text-gray-600">Active Users</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-600">500</p>
                <p className="text-sm text-gray-600">kWh Saved</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">89kg</p>
                <p className="text-sm text-gray-600">CO₂ Reduced</p>
              </div>
            </div>
          </div>

          {/* Friends Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-800">Your Eco Friends</h3>
              <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                Add Friends
              </button>
            </div>
            <div className="space-y-2">
              {COMMUNITY_DATA.slice(0, 2).map((friend) => (
                <div key={friend.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="text-xl">{friend.avatar}</div>
                    <div>
                      <p className="font-medium text-gray-800">{friend.name}</p>
                      <p className="text-sm text-gray-600">EarthScore: {friend.earthScore}</p>
                    </div>
                  </div>
                  <button className="px-3 py-1 bg-green-100 text-green-700 rounded-md text-sm font-medium hover:bg-green-200 transition-colors">
                    Compare
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
