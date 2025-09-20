'use client';

import { useState } from 'react';
import { Calendar, MapPin, Users, Building, Save, X, Clock } from 'lucide-react';
import { generateId, saveEvent } from '../../app/crowdguard/lib/storage';
import { useRouter } from 'next/navigation';

export default function EventForm({ onCancel, initialData = null }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    venue: initialData?.venue || '',
    startAt: initialData?.startAt ? new Date(initialData.startAt).toISOString().slice(0, 16) : '',
    endAt: initialData?.endAt ? new Date(initialData.endAt).toISOString().slice(0, 16) : '',
    capacity: initialData?.capacity || 100,
    organizer: initialData?.organizer || '',
    location: {
      lat: initialData?.location?.lat || '',
      lng: initialData?.location?.lng || ''
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const eventData = {
        id: initialData?.id || generateId(),
        ...formData,
        startAt: new Date(formData.startAt).toISOString(),
        endAt: new Date(formData.endAt).toISOString(),
        location: {
          lat: formData.location.lat ? parseFloat(formData.location.lat) : null,
          lng: formData.location.lng ? parseFloat(formData.location.lng) : null
        },
        attendees: initialData?.attendees || [],
        mediaReports: initialData?.mediaReports || []
      };

      saveEvent(eventData);
      
      // Show success and redirect
      router.push('/crowdguard');
    } catch (error) {
      console.error('Error saving event:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {initialData ? 'Edit Event' : 'Create New Event'}
        </h2>
        {onCancel && (
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Enter event title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Building className="w-4 h-4 inline mr-1" />
              Organizer *
            </label>
            <input
              type="text"
              required
              value={formData.organizer}
              onChange={(e) => handleChange('organizer', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Organization or person name"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            required
            rows={4}
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            placeholder="Describe your event..."
          />
        </div>

        {/* Venue & Location */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              Venue *
            </label>
            <input
              type="text"
              required
              value={formData.venue}
              onChange={(e) => handleChange('venue', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Event venue"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Latitude (optional)
            </label>
            <input
              type="number"
              step="any"
              value={formData.location.lat}
              onChange={(e) => handleChange('location.lat', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="12.9716"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Longitude (optional)
            </label>
            <input
              type="number"
              step="any"
              value={formData.location.lng}
              onChange={(e) => handleChange('location.lng', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="77.5946"
            />
          </div>
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Start Date & Time *
            </label>
            <input
              type="datetime-local"
              required
              value={formData.startAt}
              onChange={(e) => handleChange('startAt', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="w-4 h-4 inline mr-1" />
              End Date & Time *
            </label>
            <input
              type="datetime-local"
              required
              value={formData.endAt}
              onChange={(e) => handleChange('endAt', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>
        </div>

        {/* Capacity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Users className="w-4 h-4 inline mr-1" />
            Maximum Capacity *
          </label>
          <input
            type="number"
            required
            min="1"
            value={formData.capacity}
            onChange={(e) => handleChange('capacity', parseInt(e.target.value))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            placeholder="Maximum number of attendees"
          />
        </div>

        {/* Actions */}
        <div className="flex space-x-4 pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-gradient-to-r from-red-500 to-orange-500 text-white py-3 px-6 rounded-lg font-medium hover:from-red-600 hover:to-orange-600 transition-all duration-200 flex items-center justify-center disabled:opacity-50"
          >
            <Save className="w-5 h-5 mr-2" />
            {isSubmitting ? 'Saving...' : (initialData ? 'Update Event' : 'Create Event')}
          </button>
          
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
