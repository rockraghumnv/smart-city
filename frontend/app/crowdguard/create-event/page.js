'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import EventForm from '@/components/crowdguard/EventForm';

export default function CreateEventPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center">
              <Link href="/crowdguard" className="mr-4 p-2 hover:bg-gray-100 rounded-lg">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Create New Event</h1>
                <p className="text-gray-600">Set up a new event with crowd management features</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <EventForm />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
