'use client';

import { useState } from 'react';
import { User, Mail, Phone, Save, Ticket } from 'lucide-react';
import { generateId, saveRegistration } from '../../app/crowdguard/lib/storage';

export default function RegistrationForm({ event, onSuccess, onCancel }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    contactType: 'email'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const registration = {
        id: generateId(),
        eventId: event.id,
        name: formData.name,
        contact: formData.contact,
        registeredAt: new Date().toISOString(),
        ticketId: `ticket-${generateId()}`
      };

      saveRegistration(registration);
      onSuccess(registration);
    } catch (error) {
      console.error('Error registering:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center">
          <Ticket className="w-6 h-6 text-white" />
        </div>
        <div className="ml-4">
          <h3 className="text-xl font-bold text-gray-900">Register for Event</h3>
          <p className="text-gray-600">{event.title}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <User className="w-4 h-4 inline mr-1" />
            Full Name *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contact Type
          </label>
          <div className="flex space-x-4 mb-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="contactType"
                value="email"
                checked={formData.contactType === 'email'}
                onChange={(e) => setFormData(prev => ({ ...prev, contactType: e.target.value }))}
                className="mr-2"
              />
              <Mail className="w-4 h-4 mr-1" />
              Email
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="contactType"
                value="phone"
                checked={formData.contactType === 'phone'}
                onChange={(e) => setFormData(prev => ({ ...prev, contactType: e.target.value }))}
                className="mr-2"
              />
              <Phone className="w-4 h-4 mr-1" />
              Phone
            </label>
          </div>
          <input
            type={formData.contactType === 'email' ? 'email' : 'tel'}
            required
            value={formData.contact}
            onChange={(e) => setFormData(prev => ({ ...prev, contact: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            placeholder={formData.contactType === 'email' ? 'Enter your email' : 'Enter your phone number'}
          />
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-medium text-yellow-800 mb-2">Privacy Notice</h4>
          <p className="text-sm text-yellow-700">
            Your contact information will only be used for event updates and safety notifications. 
            We do not share personal data with third parties without consent.
          </p>
        </div>

        <div className="flex space-x-4 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-gradient-to-r from-red-500 to-orange-500 text-white py-3 px-6 rounded-lg font-medium hover:from-red-600 hover:to-orange-600 transition-all duration-200 flex items-center justify-center disabled:opacity-50"
          >
            <Save className="w-5 h-5 mr-2" />
            {isSubmitting ? 'Registering...' : 'Register Now'}
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
