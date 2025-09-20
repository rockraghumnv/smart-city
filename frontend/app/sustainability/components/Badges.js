'use client';

import { useState, useEffect } from 'react';
import { 
  Award, 
  Star, 
  Target, 
  Flame, 
  Trophy,
  Calendar,
  CheckCircle,
  Lock,
  Droplets,
  Zap,
  Car,
  Trash2,
  Recycle
} from 'lucide-react';

const badgeIcons = {
  waterSaver: Droplets,
  energyEfficient: Zap,
  ecoTraveler: Car,
  wasteWarrior: Trash2,
  recycleChamp: Recycle,
  weekStreak: Flame,
  perfectDay: Star,
  earlyAdopter: Award,
  consistent: Calendar,
  greenMaster: Trophy
};

const BadgeCard = ({ badge, isUnlocked, progress = 0, onClick }) => {
  const IconComponent = badgeIcons[badge.id] || Award;
  
  return (
    <div 
      className={`
        relative p-4 rounded-xl border-2 transition-all cursor-pointer
        ${isUnlocked 
          ? 'border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-md' 
          : 'border-gray-200 bg-gray-50 opacity-60 hover:opacity-80'
        }
      `}
      onClick={() => onClick(badge)}
    >
      {/* Badge Icon */}
      <div className={`
        w-12 h-12 rounded-full flex items-center justify-center mb-3 mx-auto
        ${isUnlocked 
          ? 'bg-green-500 text-white' 
          : 'bg-gray-300 text-gray-500'
        }
      `}>
        {isUnlocked ? (
          <IconComponent className="h-6 w-6" />
        ) : (
          <Lock className="h-5 w-5" />
        )}
      </div>
      
      {/* Badge Info */}
      <div className="text-center">
        <h4 className={`font-semibold text-sm mb-1 ${
          isUnlocked ? 'text-gray-800' : 'text-gray-500'
        }`}>
          {badge.name}
        </h4>
        <p className="text-xs text-gray-600 mb-2 line-clamp-2">
          {badge.description}
        </p>
        
        {/* Progress Bar (for locked badges with progress) */}
        {!isUnlocked && progress > 0 && (
          <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
            <div 
              className="bg-green-400 h-1.5 rounded-full transition-all"
              style={{ width: `${Math.min(progress * 100, 100)}%` }}
            />
          </div>
        )}
        
        {/* Badge Status */}
        <div className="flex items-center justify-center gap-1">
          {isUnlocked ? (
            <>
              <CheckCircle className="h-3 w-3 text-green-600" />
              <span className="text-xs font-medium text-green-600">Unlocked</span>
            </>
          ) : (
            <span className="text-xs text-gray-500">
              {progress > 0 ? `${Math.round(progress * 100)}% complete` : 'Locked'}
            </span>
          )}
        </div>
      </div>
      
      {/* Unlock Animation Overlay */}
      {isUnlocked && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-2 right-2">
            <Star className="h-4 w-4 text-yellow-400 animate-pulse" />
          </div>
        </div>
      )}
    </div>
  );
};

const BadgeModal = ({ badge, isOpen, onClose, isUnlocked }) => {
  if (!isOpen || !badge) return null;
  
  const IconComponent = badgeIcons[badge.id] || Award;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
        {/* Header */}
        <div className="text-center mb-6">
          <div className={`
            w-20 h-20 rounded-full flex items-center justify-center mb-4 mx-auto
            ${isUnlocked 
              ? 'bg-gradient-to-br from-green-400 to-green-600 text-white' 
              : 'bg-gray-200 text-gray-400'
            }
          `}>
            {isUnlocked ? (
              <IconComponent className="h-10 w-10" />
            ) : (
              <Lock className="h-8 w-8" />
            )}
          </div>
          
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            {badge.name}
          </h3>
          
          {isUnlocked && (
            <div className="flex items-center justify-center gap-2 text-green-600 mb-2">
              <CheckCircle className="h-5 w-5" />
              <span className="font-semibold">Unlocked!</span>
            </div>
          )}
        </div>
        
        {/* Description */}
        <div className="text-center mb-6">
          <p className="text-gray-600 mb-4">
            {badge.description}
          </p>
          
          {isUnlocked ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-sm text-green-700">
                <strong>Congratulations!</strong> You've earned this badge through your sustainable actions. Keep up the great work!
              </p>
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <p className="text-sm text-gray-600">
                Complete the requirements above to unlock this badge and earn points toward your EarthScore!
              </p>
            </div>
          )}
        </div>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
        >
          {isUnlocked ? 'Awesome!' : 'Got it'}
        </button>
      </div>
    </div>
  );
};

export default function Badges({ badges = [], badgeProgress = {} }) {
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [filter, setFilter] = useState('all'); // all, unlocked, locked

  const unlockedCount = badges.filter(badge => badge.unlocked).length;
  const totalCount = badges.length;

  const filteredBadges = badges.filter(badge => {
    if (filter === 'unlocked') return badge.unlocked;
    if (filter === 'locked') return !badge.unlocked;
    return true;
  });

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Achievements</h3>
          <p className="text-sm text-gray-600">
            {unlockedCount} of {totalCount} badges earned
          </p>
        </div>
        
        {/* Progress Ring */}
        <div className="relative w-16 h-16">
          <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="currentColor"
              className="text-gray-200"
              strokeWidth="4"
              fill="none"
            />
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="currentColor"
              className="text-green-500"
              strokeWidth="4"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 28}`}
              strokeDashoffset={`${2 * Math.PI * 28 * (1 - unlockedCount / totalCount)}`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-bold text-gray-700">
              {Math.round((unlockedCount / totalCount) * 100)}%
            </span>
          </div>
        </div>
      </div>
      
      {/* Filter Tabs */}
      <div className="flex gap-2 mb-4">
        {[
          { key: 'all', label: 'All', count: totalCount },
          { key: 'unlocked', label: 'Unlocked', count: unlockedCount },
          { key: 'locked', label: 'Locked', count: totalCount - unlockedCount }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`
              px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
              ${filter === tab.key
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }
            `}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>
      
      {/* Badges Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredBadges.map(badge => (
          <BadgeCard
            key={badge.id}
            badge={badge}
            isUnlocked={badge.unlocked}
            progress={badgeProgress[badge.id]}
            onClick={setSelectedBadge}
          />
        ))}
      </div>
      
      {filteredBadges.length === 0 && (
        <div className="text-center py-8">
          <Award className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">
            {filter === 'unlocked' ? 'No badges unlocked yet' : 'No locked badges'}
          </p>
        </div>
      )}
      
      {/* Badge Modal */}
      <BadgeModal
        badge={selectedBadge}
        isOpen={!!selectedBadge}
        onClose={() => setSelectedBadge(null)}
        isUnlocked={selectedBadge?.unlocked}
      />
    </div>
  );
}
