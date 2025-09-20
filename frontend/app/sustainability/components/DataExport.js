'use client';

import { useState } from 'react';
import { Download, FileText, Table, BarChart3, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { calculateEarthScore, calculateDailyTotals } from '../lib/score';
import { getEntries, getBadges, getSettings } from '../lib/storage';

export default function DataExport({ entries }) {
  const [exportFormat, setExportFormat] = useState('csv');
  const [exportType, setExportType] = useState('all');
  const [dateRange, setDateRange] = useState('month');

  const exportData = () => {
    const badges = getBadges();
    const settings = getSettings();
    
    let exportContent = '';
    let filename = '';
    let mimeType = '';

    switch (exportFormat) {
      case 'csv':
        exportContent = generateCSV();
        filename = `sustainability-data-${format(new Date(), 'yyyy-MM-dd')}.csv`;
        mimeType = 'text/csv';
        break;
      case 'json':
        exportContent = generateJSON();
        filename = `sustainability-data-${format(new Date(), 'yyyy-MM-dd')}.json`;
        mimeType = 'application/json';
        break;
      case 'report':
        exportContent = generateReport();
        filename = `sustainability-report-${format(new Date(), 'yyyy-MM-dd')}.html`;
        mimeType = 'text/html';
        break;
    }

    const blob = new Blob([exportContent], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const generateCSV = () => {
    const headers = ['Date', 'Time', 'Type', 'Value', 'Unit', 'Mode', 'EarthScore', 'Notes'];
    const rows = [headers.join(',')];

    entries.forEach(entry => {
      const date = new Date(entry.date);
      const dailyTotals = calculateDailyTotals(entries, date);
      const earthScore = calculateEarthScore(dailyTotals);
      
      rows.push([
        format(date, 'yyyy-MM-dd'),
        format(date, 'HH:mm:ss'),
        entry.type,
        entry.value,
        entry.unit,
        entry.meta?.mode || '',
        earthScore.toFixed(1),
        entry.notes || ''
      ].join(','));
    });

    return rows.join('\n');
  };

  const generateJSON = () => {
    const data = {
      exportDate: new Date().toISOString(),
      totalEntries: entries.length,
      dateRange: {
        from: entries.length > 0 ? entries[0].date : null,
        to: entries.length > 0 ? entries[entries.length - 1].date : null
      },
      entries: entries.map(entry => ({
        ...entry,
        earthScore: calculateEarthScore(calculateDailyTotals(entries, new Date(entry.date)))
      })),
      badges: getBadges(),
      settings: getSettings(),
      summary: generateSummaryStats()
    };

    return JSON.stringify(data, null, 2);
  };

  const generateReport = () => {
    const summary = generateSummaryStats();
    const badges = getBadges();
    
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sustainability Report - ${format(new Date(), 'MMMM yyyy')}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; background: #f8f9fa; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #22c55e; padding-bottom: 20px; }
        .stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 30px 0; }
        .stat-card { background: #f1f5f9; padding: 20px; border-radius: 8px; border-left: 4px solid #22c55e; }
        .badge-list { display: flex; flex-wrap: wrap; gap: 10px; margin: 20px 0; }
        .badge { background: #dbeafe; color: #1e40af; padding: 8px 16px; border-radius: 20px; font-size: 14px; }
        .chart-placeholder { background: #f8fafc; height: 200px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #64748b; }
        h1 { color: #22c55e; margin: 0; }
        h2 { color: #374151; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px; }
        .metric { font-size: 24px; font-weight: bold; color: #22c55e; }
        .unit { font-size: 14px; color: #6b7280; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🌱 MyImpact Sustainability Report</h1>
            <p>Generated on ${format(new Date(), 'MMMM dd, yyyy')}</p>
        </div>

        <h2>📊 Monthly Summary</h2>
        <div class="stat-grid">
            <div class="stat-card">
                <div class="metric">${summary.totalWater}L</div>
                <div class="unit">Water Used</div>
            </div>
            <div class="stat-card">
                <div class="metric">${summary.totalElectricity} kWh</div>
                <div class="unit">Electricity Used</div>
            </div>
            <div class="stat-card">
                <div class="metric">${summary.totalWaste} kg</div>
                <div class="unit">Waste Generated</div>
            </div>
            <div class="stat-card">
                <div class="metric">${summary.averageEarthScore}</div>
                <div class="unit">Average EarthScore</div>
            </div>
        </div>

        <h2>🏆 Achievements</h2>
        <div class="badge-list">
            ${badges.map(badge => `<div class="badge">${badge.name}</div>`).join('')}
        </div>

        <h2>📈 Trends</h2>
        <div class="chart-placeholder">
            📊 Visual charts would appear here in a full implementation
        </div>

        <h2>💡 Insights</h2>
        <ul>
            <li>You've logged sustainability data for ${entries.length} activities this month</li>
            <li>Your average EarthScore is ${summary.averageEarthScore}, which is ${summary.averageEarthScore > 70 ? 'excellent' : summary.averageEarthScore > 50 ? 'good' : 'needs improvement'}</li>
            <li>Most active day: ${summary.mostActiveDay}</li>
            <li>Environmental impact: Equivalent to planting ${Math.floor(summary.totalCO2Saved / 20)} trees 🌳</li>
        </ul>

        <div style="margin-top: 40px; text-align: center; color: #6b7280; font-size: 12px;">
            Generated by MyImpact Sustainability Tracker
        </div>
    </div>
</body>
</html>`;
  };

  const generateSummaryStats = () => {
    if (entries.length === 0) {
      return {
        totalWater: 0,
        totalElectricity: 0,
        totalWaste: 0,
        averageEarthScore: 0,
        mostActiveDay: 'N/A',
        totalCO2Saved: 0
      };
    }

    const dailyScores = {};
    const dailyTotals = {};
    
    entries.forEach(entry => {
      const dateKey = format(new Date(entry.date), 'yyyy-MM-dd');
      if (!dailyTotals[dateKey]) {
        dailyTotals[dateKey] = calculateDailyTotals(entries, new Date(entry.date));
        dailyScores[dateKey] = calculateEarthScore(dailyTotals[dateKey]);
      }
    });

    const totalWater = Object.values(dailyTotals).reduce((sum, day) => sum + day.water, 0);
    const totalElectricity = Object.values(dailyTotals).reduce((sum, day) => sum + day.electricity, 0);
    const totalWaste = Object.values(dailyTotals).reduce((sum, day) => sum + day.waste, 0);
    const averageEarthScore = Object.values(dailyScores).reduce((sum, score) => sum + score, 0) / Object.values(dailyScores).length;
    
    // Find most active day (day with most entries)
    const dayActivity = {};
    entries.forEach(entry => {
      const dayName = format(new Date(entry.date), 'EEEE');
      dayActivity[dayName] = (dayActivity[dayName] || 0) + 1;
    });
    const mostActiveDay = Object.entries(dayActivity).reduce((max, [day, count]) => 
      count > max.count ? { day, count } : max, { day: 'Monday', count: 0 }).day;

    return {
      totalWater: totalWater.toFixed(1),
      totalElectricity: totalElectricity.toFixed(1),
      totalWaste: totalWaste.toFixed(1),
      averageEarthScore: averageEarthScore.toFixed(1),
      mostActiveDay,
      totalCO2Saved: (totalWater * 0.001 + totalElectricity * 0.5 + totalWaste * 0.1).toFixed(1)
    };
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
        <Download className="h-5 w-5 mr-2 text-blue-600" />
        Export Data
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Export Format */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
          <div className="space-y-2">
            {[
              { id: 'csv', label: 'CSV (Spreadsheet)', icon: <Table className="h-4 w-4" /> },
              { id: 'json', label: 'JSON (Raw Data)', icon: <FileText className="h-4 w-4" /> },
              { id: 'report', label: 'HTML Report', icon: <BarChart3 className="h-4 w-4" /> }
            ].map(format => (
              <label key={format.id} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="format"
                  value={format.id}
                  checked={exportFormat === format.id}
                  onChange={(e) => setExportFormat(e.target.value)}
                  className="text-blue-600"
                />
                <div className="flex items-center space-x-2">
                  {format.icon}
                  <span className="text-sm">{format.label}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Export Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Data Type</label>
          <div className="space-y-2">
            {[
              { id: 'all', label: 'All Data' },
              { id: 'activities', label: 'Activities Only' },
              { id: 'summary', label: 'Summary Only' }
            ].map(type => (
              <label key={type.id} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  value={type.id}
                  checked={exportType === type.id}
                  onChange={(e) => setExportType(e.target.value)}
                  className="text-blue-600"
                />
                <span className="text-sm">{type.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Date Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Time Range</label>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="quarter">Last 90 Days</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>

      {/* Export Preview */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="font-medium text-gray-800 mb-2">Export Preview</h3>
        <div className="text-sm text-gray-600 space-y-1">
          <p>📊 Format: {exportFormat.toUpperCase()}</p>
          <p>📅 Range: {dateRange}</p>
          <p>📝 Entries: {entries.length} activities</p>
          <p>💾 Estimated size: {exportFormat === 'report' ? '~50KB' : exportFormat === 'json' ? '~15KB' : '~5KB'}</p>
        </div>
      </div>

      {/* Export Button */}
      <button
        onClick={exportData}
        disabled={entries.length === 0}
        className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg hover:from-blue-700 hover:to-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Download className="h-5 w-5" />
        <span>Export Data</span>
      </button>

      {entries.length === 0 && (
        <p className="text-center text-gray-500 text-sm mt-4">
          No data available to export. Start logging activities to export your sustainability data.
        </p>
      )}
    </div>
  );
}
