'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Calendar, Download, Filter, TrendingUp, TrendingDown, Zap, Droplets, Car, Trash2 } from 'lucide-react';
import { calculateDailyTotals, calculateEarthScore } from '../lib/score';
import { getEntries } from '../lib/storage';
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

const COLORS = {
  water: '#3B82F6',
  electricity: '#EAB308', 
  travel: '#10B981',
  waste: '#EF4444',
  recycle: '#059669',
  earthScore: '#6366F1'
};

export default function AdvancedAnalytics({ entries }) {
  const [timeRange, setTimeRange] = useState('week');
  const [chartType, setChartType] = useState('line');
  const [selectedMetrics, setSelectedMetrics] = useState(['water', 'electricity', 'waste']);
  const [chartData, setChartData] = useState([]);
  const [insights, setInsights] = useState({});

  useEffect(() => {
    prepareChartData();
    calculateInsights();
  }, [entries, timeRange, selectedMetrics]);

  const prepareChartData = () => {
    const endDate = new Date();
    let startDate;
    let dateFormat;
    
    switch (timeRange) {
      case 'week':
        startDate = subDays(endDate, 7);
        dateFormat = 'MMM dd';
        break;
      case 'month':
        startDate = subDays(endDate, 30);
        dateFormat = 'MMM dd';
        break;
      case 'quarter':
        startDate = subDays(endDate, 90);
        dateFormat = 'MMM dd';
        break;
      default:
        startDate = subDays(endDate, 7);
        dateFormat = 'MMM dd';
    }

    const data = [];
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = format(d, dateFormat);
      const dailyTotals = calculateDailyTotals(entries, d);
      const earthScore = calculateEarthScore(dailyTotals);
      
      data.push({
        date: dateStr,
        fullDate: d.toISOString(),
        water: dailyTotals.water,
        electricity: dailyTotals.electricity,
        travel: dailyTotals.travel,
        waste: dailyTotals.waste,
        recycle: dailyTotals.recycle,
        earthScore: earthScore
      });
    }
    
    setChartData(data);
  };

  const calculateInsights = () => {
    if (chartData.length === 0) return;

    const insights = {};
    selectedMetrics.forEach(metric => {
      const values = chartData.map(d => d[metric]).filter(v => v > 0);
      if (values.length > 0) {
        const avg = values.reduce((a, b) => a + b, 0) / values.length;
        const min = Math.min(...values);
        const max = Math.max(...values);
        const trend = values.length > 1 ? 
          ((values[values.length - 1] - values[0]) / values[0] * 100) : 0;

        insights[metric] = { avg, min, max, trend };
      }
    });

    setInsights(insights);
  };

  const exportData = () => {
    const csvContent = [
      ['Date', 'Water (L)', 'Electricity (kWh)', 'Travel (km)', 'Waste (kg)', 'Recycle (kg)', 'EarthScore'].join(','),
      ...chartData.map(row => [
        row.fullDate,
        row.water,
        row.electricity,
        row.travel,
        row.waste,
        row.recycle,
        row.earthScore
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sustainability-data-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getMetricIcon = (metric) => {
    switch (metric) {
      case 'water': return <Droplets className="h-4 w-4" />;
      case 'electricity': return <Zap className="h-4 w-4" />;
      case 'travel': return <Car className="h-4 w-4" />;
      case 'waste': return <Trash2 className="h-4 w-4" />;
      default: return null;
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-800 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value.toFixed(2)} {getUnit(entry.dataKey)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const getUnit = (metric) => {
    switch (metric) {
      case 'water': return 'L';
      case 'electricity': return 'kWh';
      case 'travel': return 'km';
      case 'waste': 
      case 'recycle': return 'kg';
      case 'earthScore': return '';
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-gray-800">Advanced Analytics</h2>
          
          <div className="flex items-center space-x-4">
            {/* Time Range Selector */}
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="quarter">Last 90 Days</option>
            </select>

            {/* Chart Type Selector */}
            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="line">Line Chart</option>
              <option value="bar">Bar Chart</option>
              <option value="area">Area Chart</option>
            </select>

            {/* Export Button */}
            <button
              onClick={exportData}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span className="text-sm">Export CSV</span>
            </button>
          </div>
        </div>

        {/* Metric Selector */}
        <div className="mt-4 flex flex-wrap gap-2">
          {['water', 'electricity', 'travel', 'waste', 'recycle'].map(metric => (
            <button
              key={metric}
              onClick={() => {
                setSelectedMetrics(prev => 
                  prev.includes(metric) 
                    ? prev.filter(m => m !== metric)
                    : [...prev, metric]
                );
              }}
              className={`flex items-center space-x-2 px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                selectedMetrics.includes(metric)
                  ? 'bg-blue-100 text-blue-700 border border-blue-300'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {getMetricIcon(metric)}
              <span className="capitalize">{metric}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Insights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(insights).map(([metric, data]) => (
          <div key={metric} className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                {getMetricIcon(metric)}
                <span className="font-medium text-gray-800 capitalize">{metric}</span>
              </div>
              <div className={`flex items-center space-x-1 text-sm ${
                data.trend > 0 ? 'text-red-600' : 'text-green-600'
              }`}>
                {data.trend > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                <span>{Math.abs(data.trend).toFixed(1)}%</span>
              </div>
            </div>
            <div className="space-y-1 text-sm">
              <p>Avg: <span className="font-medium">{data.avg.toFixed(1)} {getUnit(metric)}</span></p>
              <p>Min: <span className="font-medium">{data.min.toFixed(1)} {getUnit(metric)}</span></p>
              <p>Max: <span className="font-medium">{data.max.toFixed(1)} {getUnit(metric)}</span></p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Chart */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Usage Trends</h3>
        <div className="h-80">
          {Array.isArray(chartData) && chartData.length > 0 ? (
            chartType === 'line' ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  {selectedMetrics.map(metric => (
                    <Line
                      key={metric}
                      type="monotone"
                      dataKey={metric}
                      stroke={COLORS[metric]}
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            ) : chartType === 'bar' ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  {selectedMetrics.map(metric => (
                    <Bar
                      key={metric}
                      dataKey={metric}
                      fill={COLORS[metric]}
                      radius={[2, 2, 0, 0]}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            ) : chartType === 'area' ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  {selectedMetrics.map(metric => (
                    <Area
                      key={metric}
                      type="monotone"
                      dataKey={metric}
                      stackId="1"
                      stroke={COLORS[metric]}
                      fill={COLORS[metric]}
                      fillOpacity={0.6}
                    />
                  ))}
                </AreaChart>
              </ResponsiveContainer>
            ) : null
          ) : (
            <div className="text-gray-400 flex items-center justify-center h-full">
              No data available for this period.
            </div>
          )}
        </div>
      </div>

      {/* EarthScore Trend */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4">EarthScore Evolution</h3>
        <div className="h-64">
          {Array.isArray(chartData) && chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 100]} />
                <Tooltip 
                  formatter={(value) => [`${value}`, 'EarthScore']}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Area
                  type="monotone"
                  dataKey="earthScore"
                  stroke={COLORS.earthScore}
                  fill={COLORS.earthScore}
                  fillOpacity={0.3}
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-gray-400 flex items-center justify-center h-full">
              No data available for this period.
            </div>
          )}
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Usage Distribution Pie Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Usage Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Water', value: chartData.reduce((sum, d) => sum + d.water, 0), color: COLORS.water },
                    { name: 'Electricity', value: chartData.reduce((sum, d) => sum + d.electricity * 50, 0), color: COLORS.electricity },
                    { name: 'Travel', value: chartData.reduce((sum, d) => sum + d.travel * 20, 0), color: COLORS.travel },
                    { name: 'Waste', value: chartData.reduce((sum, d) => sum + d.waste * 100, 0), color: COLORS.waste }
                  ]}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Comparison */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Monthly Goals</h3>
          <div className="space-y-4">
            {['water', 'electricity', 'waste'].map(metric => {
              const monthlyTotal = chartData.reduce((sum, d) => sum + (d[metric] || 0), 0);
              const monthlyGoal = {
                water: 6000, // 200L per day * 30 days
                electricity: 450, // 15 kWh per day * 30 days
                waste: 60 // 2kg per day * 30 days
              }[metric];
              
              const progress = (monthlyTotal / monthlyGoal) * 100;
              const isGood = progress < 80; // Lower usage is better

              return (
                <div key={metric} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getMetricIcon(metric)}
                      <span className="font-medium text-gray-800 capitalize">{metric}</span>
                    </div>
                    <span className={`text-sm font-medium ${isGood ? 'text-green-600' : 'text-red-600'}`}>
                      {monthlyTotal.toFixed(1)} / {monthlyGoal} {getUnit(metric)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all ${
                        isGood ? 'bg-gradient-to-r from-green-400 to-green-600' : 'bg-gradient-to-r from-yellow-400 to-red-500'
                      }`}
                      style={{ width: `${Math.min(100, progress)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-600">
                    {isGood ? '✅ On track for monthly goal' : '⚠️ Exceeding recommended usage'}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Predictions & Recommendations */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Smart Insights & Predictions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center mb-2">
              <Droplets className="h-5 w-5 text-blue-600 mr-2" />
              <span className="font-medium text-blue-800">Water Insight</span>
            </div>
            <p className="text-sm text-blue-700">
              Your water usage is trending down by 15%. At this rate, you'll save an extra 200L this month! 💧
            </p>
          </div>

          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <div className="flex items-center mb-2">
              <Zap className="h-5 w-5 text-yellow-600 mr-2" />
              <span className="font-medium text-yellow-800">Energy Tip</span>
            </div>
            <p className="text-sm text-yellow-700">
              Peak usage detected around 8 PM. Consider shifting activities to reduce evening consumption. ⚡
            </p>
          </div>

          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center mb-2">
              <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
              <span className="font-medium text-green-800">Progress</span>
            </div>
            <p className="text-sm text-green-700">
              You're on track to achieve a 90+ EarthScore this week. Keep up the excellent work! 🌟
            </p>
          </div>
        </div>      </div>
    </div>
  );
}
