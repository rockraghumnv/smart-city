'use client';

import { Calendar, MapPin, Users, Clock, ArrowRight } from 'lucide-react';
import { formatDate, calculateOccupancy, getEventStatus } from '../../app/crowdguard/lib/storage';
import Link from 'next/link';

export default function EventCard({ event }) {
  const occupancy = calculateOccupancy(event);
  const status = getEventStatus(event);
  
  const getStatusBadge = () => {
    switch(status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ongoing':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'past':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getOccupancyColor = () => {
    if (occupancy >= 90) return 'text-red-600 bg-red-50';
    if (occupancy >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 overflow-hidden">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-red-500 to-orange-500 p-4 text-white">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold mb-1">{event.title}</h3>
            <p className="text-red-100 text-sm">{event.organizer}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium border bg-white/10 text-white`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
        
        <div className="space-y-3 mb-6">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{formatDate(event.startAt)}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2" />
            <span>{event.venue}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-600">
              <Users className="w-4 h-4 mr-2" />
              <span>{event.attendees.length} / {event.capacity} registered</span>
            </div>
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${getOccupancyColor()}`}>
              {occupancy}% full
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-3">
          <Link 
            href={`/crowdguard/event/${event.id}`}
            className="flex-1 bg-gradient-to-r from-red-500 to-orange-500 text-white text-center py-2 px-4 rounded-lg font-medium hover:from-red-600 hover:to-orange-600 transition-all duration-200 flex items-center justify-center"
          >
            View Details
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
          
          {status === 'upcoming' && occupancy < 100 && (
            <Link 
              href={`/crowdguard/event/${event.id}?register=true`}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Register
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
