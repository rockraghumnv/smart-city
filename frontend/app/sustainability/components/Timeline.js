'use client';

import { useState } from 'react';
import { format, isToday, isYesterday, parseISO } from 'date-fns';
import { 
  Droplets, 
  Zap, 
  Car, 
  Trash2, 
  Recycle, 
  Edit2, 
  Trash, 
  Bus,
  Bike,
  MapPin
} from 'lucide-react';

const getTypeIcon = (type) => {
  const icons = {
    water: Droplets,
    electricity: Zap,
    travel: Car,
    waste: Trash2,
    recycle: Recycle
  };
  return icons[type] || Car;
};

const getTravelIcon = (mode) => {
  const icons = {
    car: Car,
    bus: Bus,
    bike: Bike,
    walk: MapPin
  };
  return icons[mode] || Car;
};

const getTypeColor = (type) => {
  const colors = {
    water: 'text-blue-600 bg-blue-50',
    electricity: 'text-yellow-600 bg-yellow-50',
    travel: 'text-purple-600 bg-purple-50',
    waste: 'text-red-600 bg-red-50',
    recycle: 'text-green-600 bg-green-50'
  };
  return colors[type] || 'text-gray-600 bg-gray-50';
};

const formatDateHeader = (dateStr) => {
  const date = parseISO(dateStr);
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  return format(date, 'EEEE, MMM d');
};

const formatTime = (dateStr) => {
  return format(parseISO(dateStr), 'HH:mm');
};

const getImpactMessage = (entry) => {
  const { type, value, meta } = entry;
  
  switch (type) {
    case 'water':
      if (value <= 30) return '🌟 Great water conservation!';
      if (value <= 50) return '👍 Good water usage';
      return '💧 Consider shorter showers';
    
    case 'electricity':
      if (value <= 2) return '⚡ Excellent energy savings!';
      if (value <= 5) return '💡 Good energy habits';
      return '🔌 Try unplugging devices';
    
    case 'travel':
      if (meta?.mode === 'walk') return '🚶 Amazing for health & planet!';
      if (meta?.mode === 'bike') return '🚴 Eco-friendly choice!';
      if (meta?.mode === 'bus') return '🚌 Smart public transport use';
      return '🚗 Consider eco alternatives';
    
    case 'recycle':
      return '♻️ Thanks for recycling!';
    
    case 'waste':
      if (value <= 0.3) return '🌱 Minimal waste, great job!';
      return '🗑️ Every bit of reduction helps';
    
    default:
      return '✨ Every action counts!';
  }
};

export default function Timeline({ entries, onEditEntry, onDeleteEntry }) {
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');

  // Group entries by date
  const groupedEntries = entries.reduce((groups, entry) => {
    const dateKey = format(parseISO(entry.date), 'yyyy-MM-dd');
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(entry);
    return groups;
  }, {});

  // Sort dates newest first
  const sortedDates = Object.keys(groupedEntries).sort((a, b) => b.localeCompare(a));

  const handleEdit = (entry) => {
    setEditingId(entry.id);
    setEditValue(entry.value.toString());
  };

  const handleSaveEdit = (entry) => {
    const newValue = parseFloat(editValue);
    if (newValue > 0) {
      onEditEntry(entry.id, { ...entry, value: newValue });
    }
    setEditingId(null);
    setEditValue('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditValue('');
  };

  if (entries.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 text-center">
        <div className="text-gray-400 mb-4">
          <Droplets className="h-12 w-12 mx-auto" />
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">No activities yet</h3>
        <p className="text-gray-500">Start logging your daily activities to track your impact!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activities</h3>
      
      <div className="space-y-4">
        {sortedDates.map(dateKey => {
          const dateEntries = groupedEntries[dateKey];
          
          return (
            <div key={dateKey}>
              {/* Date Header */}
              <div className="sticky top-0 bg-gray-50 -mx-6 px-6 py-2 border-b border-gray-100">
                <h4 className="font-medium text-gray-700">
                  {formatDateHeader(dateEntries[0].date)}
                </h4>
              </div>
              
              {/* Entries for this date */}
              <div className="space-y-3 pt-3">
                {dateEntries
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .map(entry => {
                    const TypeIcon = entry.type === 'travel' && entry.meta?.mode 
                      ? getTravelIcon(entry.meta.mode)
                      : getTypeIcon(entry.type);
                    
                    return (
                      <div key={entry.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                        {/* Icon */}
                        <div className={`p-2 rounded-full ${getTypeColor(entry.type)}`}>
                          <TypeIcon className="h-4 w-4" />
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-800 capitalize">
                              {entry.type}
                            </span>
                            {entry.meta?.mode && (
                              <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                                {entry.meta.mode}
                              </span>
                            )}
                          </div>
                          
                          {editingId === entry.id ? (
                            <div className="flex items-center gap-2 mt-1">
                              <input
                                type="number"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                className="w-20 px-2 py-1 text-sm border border-gray-300 rounded"
                                step="0.1"
                                min="0"
                                autoFocus
                              />
                              <span className="text-sm text-gray-600">{entry.unit}</span>
                              <button
                                onClick={() => handleSaveEdit(entry)}
                                className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                              >
                                Save
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="text-xs bg-gray-400 text-white px-2 py-1 rounded hover:bg-gray-500"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-sm font-semibold text-gray-900">
                                  {entry.value} {entry.unit}
                                </span>
                                <p className="text-xs text-gray-600 mt-1">
                                  {getImpactMessage(entry)}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Time and Actions */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">
                            {formatTime(entry.date)}
                          </span>
                          
                          {editingId !== entry.id && (
                            <div className="flex gap-1">
                              <button
                                onClick={() => handleEdit(entry)}
                                className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                title="Edit entry"
                              >
                                <Edit2 className="h-3 w-3" />
                              </button>
                              <button
                                onClick={() => onDeleteEntry(entry.id)}
                                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                title="Delete entry"
                              >
                                <Trash className="h-3 w-3" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
