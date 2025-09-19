'use client';

import { useState } from 'react';
import { ArrowLeft, Coins, Recycle, UtensilsCrossed, Leaf, Gift, Trophy, Star, TrendingUp, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function RecycleWallet() {
  const [userStats] = useState({
    totalPoints: 2450,
    itemsRecycled: 87,
    foodDonations: 23,
    carbonSaved: 156,
    currentMonth: {
      points: 340,
      recycled: 12,
      donated: 5
    }
  });

  const [transactions] = useState([
    { id: 1, type: 'earn', action: 'Plastic Recycling', points: 50, date: '2025-09-20', description: '5kg plastic bottles' },
    { id: 2, type: 'earn', action: 'Food Donation', points: 200, date: '2025-09-18', description: 'Cooked meals for 10 people' },
    { id: 3, type: 'earn', action: 'E-waste Recycling', points: 150, date: '2025-09-15', description: '3 electronic devices' },
    { id: 4, type: 'earn', action: 'Paper Recycling', points: 25, date: '2025-09-12', description: '5kg newspapers' },
    { id: 5, type: 'bonus', action: 'Weekly Bonus', points: 50, date: '2025-09-10', description: '5+ activities this week' },
  ]);

  const [rewards] = useState([
    { id: 1, name: 'Eco-friendly Water Bottle', points: 500, image: '🍃', description: 'Stainless steel water bottle', available: true },
    { id: 2, name: 'Plant Sapling Kit', points: 300, image: '🌱', description: '5 indoor plant saplings with pots', available: true },
    { id: 3, name: 'Organic Grocery Voucher', points: 1000, image: '🥬', description: '₹500 voucher for organic groceries', available: true },
    { id: 4, name: 'Solar Power Bank', points: 1500, image: '☀️', description: '10000mAh solar-powered power bank', available: false },
    { id: 5, name: 'Bamboo Cutlery Set', points: 400, image: '🥢', description: 'Eco-friendly bamboo cutlery', available: true },
    { id: 6, name: 'Zero Waste Starter Kit', points: 800, image: '♻️', description: 'Complete zero waste lifestyle kit', available: true },
  ]);

  const achievementLevels = [
    { level: 'Bronze', min: 0, max: 999, bonus: '5%', color: 'text-orange-600 bg-orange-100', current: false },
    { level: 'Silver', min: 1000, max: 2499, bonus: '10%', color: 'text-gray-600 bg-gray-100', current: false },
    { level: 'Gold', min: 2500, max: 4999, bonus: '15%', color: 'text-yellow-600 bg-yellow-100', current: true },
    { level: 'Platinum', min: 5000, max: 9999, bonus: '20%', color: 'text-purple-600 bg-purple-100', current: false },
    { level: 'Diamond', min: 10000, max: Infinity, bonus: '25%', color: 'text-blue-600 bg-blue-100', current: false },
  ];

  const currentLevel = achievementLevels.find(level => 
    userStats.totalPoints >= level.min && userStats.totalPoints <= level.max
  );

  const nextLevel = achievementLevels.find(level => level.min > userStats.totalPoints);
  const progressToNext = nextLevel ? 
    ((userStats.totalPoints - currentLevel.min) / (nextLevel.min - currentLevel.min)) * 100 : 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/recycle" className="flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Recycle Hub
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wallet</h1>
          <p className="text-gray-600">Track your points, rewards, and environmental impact</p>
        </div>

        {/* Points Balance Card */}
        <div className="bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-xl p-8 text-white mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium mb-2 opacity-90">Total Balance</h2>
              <div className="text-5xl font-bold mb-2">{userStats.totalPoints}</div>
              <div className="text-lg opacity-90">EcoPoints</div>
            </div>
            <div className="text-right">
              <Coins className="w-20 h-20 opacity-30 mb-4" />
              <div className="text-lg font-medium">
                +{userStats.currentMonth.points} this month
              </div>
            </div>
          </div>
        </div>

        {/* Achievement Level */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">Achievement Level</h3>
            <div className={`px-4 py-2 rounded-full ${currentLevel.color} font-bold flex items-center`}>
              <Trophy className="w-5 h-5 mr-2" />
              {currentLevel.level}
            </div>
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress to {nextLevel ? nextLevel.level : 'Max Level'}</span>
              <span>{userStats.totalPoints} / {nextLevel ? nextLevel.min : 'MAX'} points</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-green-500 to-teal-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progressToNext}%` }}
              ></div>
            </div>
          </div>
          
          <div className="text-sm text-gray-600">
            <strong>Current Bonus: {currentLevel.bonus}</strong> extra points on all activities
            {nextLevel && (
              <span> • Next level bonus: {nextLevel.bonus}</span>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Environmental Impact */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold mb-6 flex items-center">
                <Leaf className="w-6 h-6 mr-2 text-green-600" />
                Environmental Impact
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <Recycle className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium">Items Recycled</div>
                      <div className="text-sm text-gray-500">This month: {userStats.currentMonth.recycled}</div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-green-600">{userStats.itemsRecycled}</div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <UtensilsCrossed className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <div className="font-medium">Food Donations</div>
                      <div className="text-sm text-gray-500">This month: {userStats.currentMonth.donated}</div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-orange-600">{userStats.foodDonations}</div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-teal-600" />
                    </div>
                    <div>
                      <div className="font-medium">CO₂ Saved</div>
                      <div className="text-sm text-gray-500">Lifetime impact</div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-teal-600">{userStats.carbonSaved}kg</div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <div className="flex items-center text-green-800">
                  <Star className="w-5 h-5 mr-2" />
                  <span className="font-medium">Monthly Impact Summary</span>
                </div>
                <p className="text-green-700 text-sm mt-2">
                  You recycled {userStats.currentMonth.recycled} items and donated {userStats.currentMonth.donated} meals this month, 
                  contributing to a cleaner environment and helping those in need. Keep up the excellent work!
                </p>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold mb-6">Recent Transactions</h3>
              
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === 'earn' ? 'bg-green-100' : 'bg-blue-100'
                      }`}>
                        {transaction.type === 'earn' ? 
                          <Recycle className="w-5 h-5 text-green-600" /> :
                          <Gift className="w-5 h-5 text-blue-600" />
                        }
                      </div>
                      <div>
                        <div className="font-medium">{transaction.action}</div>
                        <div className="text-sm text-gray-500">{transaction.description}</div>
                        <div className="text-xs text-gray-400 flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {transaction.date}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">+{transaction.points}</div>
                      <div className="text-xs text-gray-500">points</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Rewards */}
          <div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold mb-6 flex items-center">
                <Gift className="w-6 h-6 mr-2 text-purple-600" />
                Available Rewards
              </h3>
              
              <div className="space-y-4">
                {rewards.map((reward) => (
                  <div key={reward.id} className={`p-4 border-2 rounded-lg transition-all ${
                    reward.available && userStats.totalPoints >= reward.points 
                      ? 'border-green-500 bg-green-50' 
                      : reward.available 
                        ? 'border-gray-200 hover:border-gray-300' 
                        : 'border-gray-200 bg-gray-50 opacity-60'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="text-3xl">{reward.image}</div>
                        <div>
                          <div className="font-medium">{reward.name}</div>
                          <div className="text-sm text-gray-600">{reward.description}</div>
                          <div className="text-lg font-bold text-purple-600 mt-1">{reward.points} points</div>
                        </div>
                      </div>
                      <div>
                        {!reward.available ? (
                          <span className="text-sm text-gray-500 bg-gray-200 px-3 py-1 rounded">
                            Coming Soon
                          </span>
                        ) : userStats.totalPoints >= reward.points ? (
                          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                            Redeem
                          </button>
                        ) : (
                          <span className="text-sm text-gray-500">
                            Need {reward.points - userStats.totalPoints} more points
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center text-purple-800 mb-2">
                  <Gift className="w-5 h-5 mr-2" />
                  <span className="font-medium">Coming Soon!</span>
                </div>
                <p className="text-purple-700 text-sm">
                  More exciting rewards including discounts at partner eco-stores, 
                  sustainable product vouchers, and exclusive experiences will be available soon!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
