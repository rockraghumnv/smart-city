'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import { calculateWeeklyAggregates, calculateDailyTotals, calculateEarthScore } from '../lib/score';

const COLORS = {
  water: '#3B82F6',
  electricity: '#EAB308',
  travel: '#10B981',
  waste: '#EF4444',
  recycle: '#059669'
};

const TRAVEL_COLORS = {
  walk: '#10B981',
  bike: '#059669',
  bus: '#3B82F6',
  car: '#EF4444'
};

export default function ChartsPanel({ weeklyData, detailed = false, entries }) {
  const [chartData, setChartData] = useState(null);
  const [activeChart, setActiveChart] = useState('overview');
  const [timeRange, setTimeRange] = useState('week'); // week, month, quarter

  useEffect(() => {
    prepareChartData();
  }, [entries]);

  const prepareChartData = () => {
    const weeklyData = calculateWeeklyAggregates(entries);
    
    // Prepare data for different chart types
    const overviewData = weeklyData.map(day => ({
      date: day.date,
      water: day.water,
      electricity: day.electricity * 10, // Scale for visibility
      travel: day.travel,
      waste: day.waste * 10, // Scale for visibility
      recycle: day.recycle * 10, // Scale for visibility
      earthScore: calculateEarthScore(day).score
    }));

    // Travel mode distribution
    const travelModeData = Object.entries(
      weeklyData.reduce((acc, day) => {
        Object.entries(day.travelModes).forEach(([mode, distance]) => {
          acc[mode] = (acc[mode] || 0) + distance;
        });
        return acc;
      }, {})
    ).map(([mode, value]) => ({
      name: mode.charAt(0).toUpperCase() + mode.slice(1),
      value: Math.round(value * 10) / 10,
      fill: TRAVEL_COLORS[mode]
    })).filter(item => item.value > 0);

    // EarthScore trend
    const scoreData = weeklyData.map(day => ({
      date: day.date,
      score: calculateEarthScore(day).score
    }));

    setChartData({
      overview: overviewData,
      travelModes: travelModeData,
      scores: scoreData
    });
  };

  if (!chartData) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <BarChart3 className="w-6 h-6 text-green-500 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900">Weekly Overview</h3>
        </div>
      </div>

      {/* Chart Type Selector */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-6">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'score', label: 'Score Trend', icon: TrendingUp },
          { id: 'travel', label: 'Travel Modes', icon: PieChartIcon }
        ].map(chart => {
          const IconComponent = chart.icon;
          return (
            <button
              key={chart.id}
              onClick={() => setActiveChart(chart.id)}
              className={`flex items-center px-3 py-2 rounded-md font-medium transition-colors ${
                activeChart === chart.id
                  ? 'bg-white text-green-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <IconComponent className="w-4 h-4 mr-2" />
              {chart.label}
            </button>
          );
        })}
      </div>

      {/* Chart Content */}
      <div className="h-64">
        {activeChart === 'overview' && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData.overview}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                fontSize={12}
                tick={{ fill: '#6B7280' }}
              />
              <YAxis 
                fontSize={12}
                tick={{ fill: '#6B7280' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="water" fill={COLORS.water} name="Water (L)" />
              <Bar dataKey="electricity" fill={COLORS.electricity} name="Electricity (kWh×10)" />
              <Bar dataKey="travel" fill={COLORS.travel} name="Travel (km)" />
              <Bar dataKey="waste" fill={COLORS.waste} name="Waste (kg×10)" />
              <Bar dataKey="recycle" fill={COLORS.recycle} name="Recycle (kg×10)" />
            </BarChart>
          </ResponsiveContainer>
        )}

        {activeChart === 'score' && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData.scores}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                fontSize={12}
                tick={{ fill: '#6B7280' }}
              />
              <YAxis 
                domain={[0, 100]}
                fontSize={12}
                tick={{ fill: '#6B7280' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#10B981" 
                strokeWidth={3}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                name="EarthScore"
              />
            </LineChart>
          </ResponsiveContainer>
        )}

        {activeChart === 'travel' && chartData.travelModes.length > 0 && (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData.travelModes}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}km`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.travelModes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )}

        {activeChart === 'travel' && chartData.travelModes.length === 0 && (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <PieChartIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p>No travel data to display</p>
              <p className="text-sm">Log some travel activities to see the breakdown</p>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      {activeChart === 'overview' && (
        <div className="mt-4 flex flex-wrap gap-4 text-xs">
          {Object.entries(COLORS).map(([key, color]) => (
            <div key={key} className="flex items-center">
              <div 
                className="w-3 h-3 rounded mr-2" 
                style={{ backgroundColor: color }}
              ></div>
              <span className="text-gray-600 capitalize">
                {key === 'electricity' ? 'Electricity (×10)' : 
                 key === 'waste' ? 'Waste (×10)' :
                 key === 'recycle' ? 'Recycle (×10)' :
                 key}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
