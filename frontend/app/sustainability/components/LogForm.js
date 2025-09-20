'use client';

import { useState } from 'react';
import { Plus, Droplets, Zap, Car, Trash, Recycle, X } from 'lucide-react';
import { addEntry, withDelay } from '../lib/storage';
import { PRESETS } from '../data/sampleData';

const TYPE_CONFIG = {
  water: { icon: Droplets, label: 'Water', color: 'blue', unit: 'L' },
  electricity: { icon: Zap, label: 'Electricity', color: 'yellow', unit: 'kWh' },
  travel: { icon: Car, label: 'Travel', color: 'green', unit: 'km' },
  waste: { icon: Trash, label: 'Waste', color: 'red', unit: 'kg' },
  recycle: { icon: Recycle, label: 'Recycle', color: 'emerald', unit: 'kg' }
};

export default function LogForm({ onEntryAdded }) {
  const [selectedType, setSelectedType] = useState(null);
  const [value, setValue] = useState('');
  const [travelMode, setTravelMode] = useState('walk');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handlePresetClick = (preset) => {
    setValue(preset.value.toString());
    if (preset.mode) {
      setTravelMode(preset.mode);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedType || !value || parseFloat(value) <= 0) return;

    setIsSubmitting(true);
    
    try {
      await withDelay(() => {
        const entry = {
          type: selectedType,
          value: parseFloat(value),
          unit: TYPE_CONFIG[selectedType].unit,
          ...(selectedType === 'travel' && { meta: { mode: travelMode } })
        };
        
        const newEntry = addEntry(entry);
        onEntryAdded && onEntryAdded(newEntry);
      });
      
      // Show success animation
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setSelectedType(null);
        setValue('');
      }, 1500);
      
    } catch (error) {
      console.error('Error adding entry:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center animate-scale-in">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              ✓
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Entry Saved!</h3>
          <p className="text-gray-600">Your sustainability action has been logged.</p>
        </div>
      </div>
    );
  }

  if (!selectedType) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center mb-4">
          <Plus className="w-6 h-6 text-green-500 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900">Quick Log</h3>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {Object.entries(TYPE_CONFIG).map(([type, config]) => {
            const IconComponent = config.icon;
            return (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`p-4 rounded-lg border-2 border-dashed hover:border-solid transition-all duration-200 hover:shadow-md group ${
                  config.color === 'blue' ? 'border-blue-300 hover:border-blue-500 hover:bg-blue-50' :
                  config.color === 'yellow' ? 'border-yellow-300 hover:border-yellow-500 hover:bg-yellow-50' :
                  config.color === 'green' ? 'border-green-300 hover:border-green-500 hover:bg-green-50' :
                  config.color === 'red' ? 'border-red-300 hover:border-red-500 hover:bg-red-50' :
                  'border-emerald-300 hover:border-emerald-500 hover:bg-emerald-50'
                }`}
              >
                <IconComponent className={`w-6 h-6 mx-auto mb-2 ${
                  config.color === 'blue' ? 'text-blue-500 group-hover:text-blue-600' :
                  config.color === 'yellow' ? 'text-yellow-500 group-hover:text-yellow-600' :
                  config.color === 'green' ? 'text-green-500 group-hover:text-green-600' :
                  config.color === 'red' ? 'text-red-500 group-hover:text-red-600' :
                  'text-emerald-500 group-hover:text-emerald-600'
                }`} />
                <div className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                  {config.label}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  const currentConfig = TYPE_CONFIG[selectedType];
  const IconComponent = currentConfig.icon;
  const presets = PRESETS[selectedType] || [];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <IconComponent className={`w-6 h-6 mr-3 ${
            currentConfig.color === 'blue' ? 'text-blue-500' :
            currentConfig.color === 'yellow' ? 'text-yellow-500' :
            currentConfig.color === 'green' ? 'text-green-500' :
            currentConfig.color === 'red' ? 'text-red-500' :
            'text-emerald-500'
          }`} />
          <h3 className="text-lg font-semibold text-gray-900">Log {currentConfig.label}</h3>
        </div>
        <button
          onClick={() => setSelectedType(null)}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Presets */}
        {presets.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Quick Presets</label>
            <div className="grid grid-cols-1 gap-2">
              {presets.map((preset, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handlePresetClick(preset)}
                  className="text-left p-3 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  <div className="font-medium text-sm">{preset.label}</div>
                  <div className="text-xs text-gray-500">
                    {preset.value} {currentConfig.unit}
                    {preset.mode && ` • ${preset.mode}`}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Value Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount ({currentConfig.unit})
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder={`Enter ${currentConfig.unit.toLowerCase()}...`}
            required
          />
        </div>

        {/* Travel Mode Selection */}
        {selectedType === 'travel' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Travel Mode</label>
            <div className="grid grid-cols-2 gap-2">
              {['walk', 'bike', 'bus', 'car'].map(mode => (
                <label key={mode} className="cursor-pointer">
                  <input
                    type="radio"
                    name="travelMode"
                    value={mode}
                    checked={travelMode === mode}
                    onChange={(e) => setTravelMode(e.target.value)}
                    className="sr-only"
                  />
                  <div className={`p-3 border-2 rounded-lg text-center transition-all ${
                    travelMode === mode 
                      ? 'border-green-500 bg-green-50 text-green-700' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <div className="font-medium text-sm capitalize">{mode}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {mode === 'walk' && '🚶‍♂️ Eco-friendly'}
                      {mode === 'bike' && '🚲 Zero emission'}
                      {mode === 'bus' && '🚌 Shared transport'}
                      {mode === 'car' && '🚗 Private vehicle'}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!value || parseFloat(value) <= 0 || isSubmitting}
          className="w-full bg-gradient-to-r from-green-400 to-emerald-600 text-white py-3 px-4 rounded-lg font-medium hover:from-green-500 hover:to-emerald-700 transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-5 h-5 mr-2" />
          {isSubmitting ? 'Saving...' : 'Log Activity'}
        </button>
      </form>
    </div>
  );
}
