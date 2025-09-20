'use client';

import { useEffect, useState } from 'react';
import { Plus, Calendar, Shield, Users, AlertTriangle, TrendingUp, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import EventCard from '@/components/crowdguard/EventCard';
import { initializeStorage, getEvents, isEventUpcoming, getEventStatus } from './lib/storage';

export default function CrowdGuardPage() {
  return (
    <ProtectedRoute>
      <CrowdGuardContent />
    </ProtectedRoute>
  );
}

function CrowdGuardContent() {
  const [events, setEvents] = useState([]);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeStorage();
    loadEvents();
  }, []);

  const loadEvents = () => {
    setIsLoading(true);
    // Simulate loading delay
    setTimeout(() => {
      const allEvents = getEvents();
      setEvents(allEvents);
      setIsLoading(false);
    }, 500);
  };

  const upcomingEvents = events.filter(event => isEventUpcoming(event));
  const pastEvents = events.filter(event => !isEventUpcoming(event));
  const ongoingEvents = events.filter(event => getEventStatus(event) === 'ongoing');

  const getStatsCards = () => {
    const totalAttendees = events.reduce((sum, event) => sum + event.attendees.length, 0);
    const totalCapacity = events.reduce((sum, event) => sum + event.capacity, 0);
    const avgOccupancy = totalCapacity > 0 ? Math.round((totalAttendees / totalCapacity) * 100) : 0;

    return [
      {
        title: 'Total Events',
        value: events.length,
        icon: Calendar,
        color: 'blue',
        subtitle: `${ongoingEvents.length} ongoing`
      },
      {
        title: 'Total Attendees',
        value: totalAttendees.toLocaleString(),
        icon: Users,
        color: 'green',
        subtitle: `${totalCapacity.toLocaleString()} capacity`
      },
      {
        title: 'Avg Occupancy',
        value: `${avgOccupancy}%`,
        icon: TrendingUp,
        color: avgOccupancy > 80 ? 'red' : avgOccupancy > 60 ? 'yellow' : 'green',
        subtitle: 'across all events'
      },
      {
        title: 'Safety Status',
        value: 'All Clear',
        icon: Shield,
        color: 'green',
        subtitle: 'No active alerts'
      }
    ];
  };

  const statsCards = getStatsCards();

  const getColorClasses = (color) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      red: 'from-red-500 to-red-600',
      yellow: 'from-yellow-500 to-orange-500'
    };
    return colors[color] || colors.blue;
  };

  const filteredEvents = activeTab === 'upcoming' ? upcomingEvents : pastEvents;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading events...</p>
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
              <Link href="/" className="mr-4 p-2 hover:bg-gray-100 rounded-lg">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">CrowdGuard</h1>
                <p className="text-gray-600">
                  Smart crowd management and safety monitoring for public events
                </p>
              </div>
            </div>
            <Link
              href="/crowdguard/create-event"
              className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:from-red-600 hover:to-orange-600 transition-all duration-200 flex items-center shadow-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Event
            </Link>
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
                className={`bg-gradient-to-br ${getColorClasses(stat.color)} rounded-xl p-6 text-white shadow-lg`}
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

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link
            href="/crowdguard/admin"
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-red-500"
          >
            <div className="flex items-center">
              <AlertTriangle className="w-6 h-6 text-red-500 mr-3" />
              <div>
                <h3 className="font-medium text-gray-900">Admin Dashboard</h3>
                <p className="text-sm text-gray-600">Monitor incidents & alerts</p>
              </div>
            </div>
          </Link>

          <Link
            href="/crowdguard/qr-scan"
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-blue-500"
          >
            <div className="flex items-center">
              <Shield className="w-6 h-6 text-blue-500 mr-3" />
              <div>
                <h3 className="font-medium text-gray-900">QR Validator</h3>
                <p className="text-sm text-gray-600">Validate event tickets</p>
              </div>
            </div>
          </Link>

          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-500">
            <div className="flex items-center">
              <Shield className="w-6 h-6 text-green-500 mr-3" />
              <div>
                <h3 className="font-medium text-gray-900">System Status</h3>
                <p className="text-sm text-green-600">All systems operational</p>
              </div>
            </div>
          </div>
        </div>

        {/* Events Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          {/* Tabs */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === 'upcoming'
                    ? 'bg-white text-red-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Upcoming ({upcomingEvents.length})
              </button>
              <button
                onClick={() => setActiveTab('past')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === 'past'
                    ? 'bg-white text-red-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Past ({pastEvents.length})
              </button>
            </div>

            <Link
              href="/crowdguard/create-event"
              className="text-red-600 hover:text-red-700 font-medium text-sm flex items-center"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Event
            </Link>
          </div>

          {/* Events Grid */}
          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                {activeTab === 'upcoming' ? 'No Upcoming Events' : 'No Past Events'}
              </h3>
              <p className="text-gray-600 mb-6">
                {activeTab === 'upcoming' 
                  ? 'Create your first event to get started with crowd management'
                  : 'No past events to display yet'
                }
              </p>
              {activeTab === 'upcoming' && (
                <Link
                  href="/crowdguard/create-event"
                  className="inline-flex items-center bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:from-red-600 hover:to-orange-600 transition-all duration-200"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create Your First Event
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
