'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, AlertTriangle, Shield, TrendingUp, Users, Filter, Search, Download, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminIncidentRow from '@/components/crowdguard/AdminIncidentRow';
import { 
  getForwardedIncidents, 
  getMediaReports, 
  getEvents, 
  forwardIncident,
  initializeStorage 
} from '../lib/storage';

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute>
      <AdminDashboardContent />
    </ProtectedRoute>
  );
}

function AdminDashboardContent() {
  const [incidents, setIncidents] = useState([]);
  const [allReports, setAllReports] = useState([]);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    initializeStorage();
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      const forwardedIncidents = getForwardedIncidents();
      const mediaReports = getMediaReports();
      const eventsData = getEvents();
      
      // Combine forwarded incidents with all media reports for admin view
      const allIncidents = [
        ...forwardedIncidents,
        ...mediaReports.filter(report => !forwardedIncidents.find(inc => inc.id === report.id))
      ];
      
      setIncidents(allIncidents);
      setAllReports(mediaReports);
      setEvents(eventsData);
      setIsLoading(false);
    }, 500);
  };

  const handleResolveIncident = (incidentId) => {
    setIncidents(prev => 
      prev.map(incident => 
        incident.id === incidentId 
          ? { ...incident, resolved: true, resolvedAt: new Date().toISOString() }
          : incident
      )
    );
  };

  const handleDismissIncident = (incidentId) => {
    setIncidents(prev => prev.filter(incident => incident.id !== incidentId));
  };

  const handleForwardIncident = (report) => {
    const forwardedReport = forwardIncident(report);
    setIncidents(prev => {
      const existing = prev.find(inc => inc.id === report.id);
      if (existing) {
        return prev.map(inc => inc.id === report.id ? forwardedReport : inc);
      } else {
        return [...prev, forwardedReport];
      }
    });
  };

  const getFilteredIncidents = () => {
    return incidents.filter(incident => {
      const matchesSeverity = filterSeverity === 'all' || incident.severity === filterSeverity;
      const matchesStatus = filterStatus === 'all' || 
        (filterStatus === 'resolved' && incident.resolved) ||
        (filterStatus === 'unresolved' && !incident.resolved) ||
        (filterStatus === 'forwarded' && incident.forwarded);
      const matchesSearch = searchTerm === '' || 
        incident.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        incident.eventId?.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesSeverity && matchesStatus && matchesSearch;
    });
  };

  const getStatsCards = () => {
    const totalIncidents = incidents.length;
    const unresolvedIncidents = incidents.filter(inc => !inc.resolved).length;
    const highSeverityIncidents = incidents.filter(inc => inc.severity === 'high').length;
    const forwardedIncidents = incidents.filter(inc => inc.forwarded).length;

    return [
      {
        title: 'Total Incidents',
        value: totalIncidents,
        icon: AlertTriangle,
        color: 'from-blue-500 to-blue-600',
        subtitle: `${unresolvedIncidents} unresolved`
      },
      {
        title: 'High Priority',
        value: highSeverityIncidents,
        icon: AlertTriangle,
        color: 'from-red-500 to-red-600',
        subtitle: 'requires immediate attention'
      },
      {
        title: 'Forwarded',
        value: forwardedIncidents,
        icon: Shield,
        color: 'from-purple-500 to-purple-600',
        subtitle: 'to local authorities'
      },
      {
        title: 'Active Events',
        value: events.length,
        icon: Users,
        color: 'from-green-500 to-green-600',
        subtitle: 'being monitored'
      }
    ];
  };

  const handleExportData = () => {
    const dataToExport = {
      incidents: getFilteredIncidents(),
      exportedAt: new Date().toISOString(),
      filters: { severity: filterSeverity, status: filterStatus, search: searchTerm }
    };
    
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `crowdguard-incidents-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const filteredIncidents = getFilteredIncidents();
  const statsCards = getStatsCards();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/crowdguard" className="mr-4 p-2 hover:bg-gray-100 rounded-lg">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
                <p className="text-gray-600">
                  Monitor and manage incidents across all events
                </p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={loadDashboardData}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </button>
              <button
                onClick={handleExportData}
                className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-2 rounded-lg font-medium hover:from-red-600 hover:to-orange-600 transition-all duration-200 flex items-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={index}
                className={`bg-gradient-to-br ${stat.color} rounded-xl p-6 text-white shadow-lg`}
              >
                <div className="flex items-center justify-between mb-3">
                  <IconComponent className="w-8 h-8" />
                  <div className="text-right">
                    <div className="text-2xl font-bold">{stat.value}</div>
                  </div>
                </div>
                <h3 className="font-semibold mb-1">{stat.title}</h3>
                <p className="text-sm opacity-90">{stat.subtitle}</p>
              </div>
            );
          })}
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-500" />
                <span className="font-medium text-gray-700">Filters:</span>
              </div>
              
              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="all">All Severities</option>
                <option value="high">High Severity</option>
                <option value="medium">Medium Severity</option>
                <option value="low">Low Severity</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="unresolved">Unresolved</option>
                <option value="resolved">Resolved</option>
                <option value="forwarded">Forwarded</option>
              </select>
            </div>

            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search incidents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent w-64"
              />
            </div>
          </div>
        </div>

        {/* Incidents List */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Incident Reports ({filteredIncidents.length})
            </h2>
            
            {filteredIncidents.length > 0 && (
              <div className="text-sm text-gray-600">
                Showing {filteredIncidents.length} of {incidents.length} incidents
              </div>
            )}
          </div>

          {filteredIncidents.length > 0 ? (
            <div className="space-y-4">
              {filteredIncidents
                .sort((a, b) => {
                  // Sort by severity (high first) then by date (newest first)
                  const severityOrder = { high: 3, medium: 2, low: 1 };
                  const severityDiff = severityOrder[b.severity] - severityOrder[a.severity];
                  if (severityDiff !== 0) return severityDiff;
                  
                  const dateA = new Date(a.uploadedAt || a.forwardedAt || 0);
                  const dateB = new Date(b.uploadedAt || b.forwardedAt || 0);
                  return dateB - dateA;
                })
                .map((incident) => (
                  <AdminIncidentRow
                    key={incident.id}
                    incident={incident}
                    onResolve={handleResolveIncident}
                    onDismiss={handleDismissIncident}
                  />
                ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <AlertTriangle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No Incidents Found</h3>
              <p className="text-gray-600 mb-6">
                {incidents.length === 0 
                  ? 'No incidents have been reported yet.'
                  : 'No incidents match your current filters.'
                }
              </p>
              {incidents.length > 0 && (
                <button
                  onClick={() => {
                    setFilterSeverity('all');
                    setFilterStatus('all');
                    setSearchTerm('');
                  }}
                  className="text-red-600 hover:text-red-700 font-medium"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Additional Actions */}
        {allReports.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Pending Review</h2>
            <div className="space-y-3">
              {allReports
                .filter(report => !report.forwarded && report.severity === 'medium')
                .slice(0, 3)
                .map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">Medium Priority Report</div>
                      <div className="text-sm text-gray-600">Event ID: {report.eventId}</div>
                      <div className="text-xs text-gray-500">{report.description}</div>
                    </div>
                    <button
                      onClick={() => handleForwardIncident(report)}
                      className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm"
                    >
                      Forward to Authorities
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
