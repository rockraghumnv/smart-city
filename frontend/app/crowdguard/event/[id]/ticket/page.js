'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, Ticket, Download, Share2 } from 'lucide-react';
import Link from 'next/link';
import QRCode from 'react-qr-code';
import ProtectedRoute from '@/components/ProtectedRoute';
import { getEventById, getRegistrationsByEventId, formatDate } from '../../../lib/storage';
import { generateTicketQR } from '../../../lib/qr';

export default function TicketPage() {
  return (
    <ProtectedRoute>
      <TicketContent />
    </ProtectedRoute>
  );
}

function TicketContent() {
  const params = useParams();
  const [event, setEvent] = useState(null);
  const [registration, setRegistration] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTicketData();
  }, [params.id]);

  const loadTicketData = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      const eventData = getEventById(params.id);
      const registrations = getRegistrationsByEventId(params.id);
      
      // For demo, get the first registration or create a mock one
      const userRegistration = registrations[0] || {
        id: 'demo-reg',
        eventId: params.id,
        name: 'Demo User',
        contact: 'demo@example.com',
        registeredAt: new Date().toISOString(),
        ticketId: `ticket-${Date.now()}`
      };
      
      setEvent(eventData);
      setRegistration(userRegistration);
      setIsLoading(false);
    }, 500);
  };

  const handleDownload = () => {
    // Create a canvas with the ticket information
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 400;
    canvas.height = 600;
    
    // White background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add ticket info (simplified)
    ctx.fillStyle = '#000000';
    ctx.font = '20px Arial';
    ctx.fillText('Event Ticket', 20, 40);
    ctx.font = '16px Arial';
    ctx.fillText(event?.title || 'Event', 20, 80);
    ctx.fillText(`Ticket ID: ${registration?.ticketId}`, 20, 120);
    
    // Download
    const link = document.createElement('a');
    link.download = `ticket-${registration?.ticketId}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Ticket for ${event?.title}`,
        text: `My ticket for ${event?.title} at ${event?.venue}`,
        url: window.location.href
      });
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading ticket...</p>
        </div>
      </div>
    );
  }

  if (!event || !registration) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Ticket className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Ticket Not Found</h2>
          <p className="text-gray-600 mb-6">The ticket you're looking for doesn't exist.</p>
          <Link
            href="/crowdguard"
            className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:from-red-600 hover:to-orange-600 transition-all duration-200"
          >
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  const qrValue = generateTicketQR(registration, event);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href={`/crowdguard/event/${event.id}`} className="mr-4 p-2 hover:bg-gray-100 rounded-lg">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Event Ticket</h1>
                <p className="text-gray-600">{event.title}</p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={handleShare}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </button>
              <button
                onClick={handleDownload}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          {/* Ticket Card */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Ticket Header */}
            <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-6 text-center">
              <Ticket className="w-12 h-12 mx-auto mb-3" />
              <h2 className="text-xl font-bold">Event Entry Ticket</h2>
              <p className="text-red-100">Present at venue entrance</p>
            </div>

            {/* QR Code */}
            <div className="p-8 text-center">
              <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300 inline-block mb-4">
                <QRCode
                  value={qrValue}
                  size={200}
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                />
              </div>
              <p className="text-xs text-gray-500">
                Scan this QR code at the event entrance
              </p>
            </div>

            {/* Ticket Details */}
            <div className="px-6 pb-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-600">Ticket ID</div>
                  <div className="font-mono font-medium">{registration.ticketId}</div>
                </div>
                <div>
                  <div className="text-gray-600">Attendee</div>
                  <div className="font-medium">{registration.name}</div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">{event.title}</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{formatDate(event.startAt)}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{event.venue}</span>
                  </div>
                </div>
              </div>

              {/* Important Notes */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-yellow-800 mb-2">Important Notes</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Arrive 15 minutes before start time</li>
                  <li>• Keep your ticket safe and secure</li>
                  <li>• Contact organizer for any changes</li>
                  <li>• Follow all safety guidelines</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
