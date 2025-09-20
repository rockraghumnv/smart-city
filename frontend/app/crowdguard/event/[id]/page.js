'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { ArrowLeft, Calendar, MapPin, Users, Clock, Ticket, Upload, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import RegistrationForm from '@/components/crowdguard/RegistrationForm';
import TicketModal from '@/components/crowdguard/TicketModal';
import UploadPanel from '@/components/crowdguard/UploadPanel';
import { getEventById, getRegistrationsByEventId, getMediaReportsByEventId, formatDate, calculateOccupancy, getEventStatus } from '../../lib/storage';

export default function EventDetailPage() {
  return (
    <ProtectedRoute>
      <EventDetailContent />
    </ProtectedRoute>
  );
}

function EventDetailContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [event, setEvent] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [mediaReports, setMediaReports] = useState([]);
  const [activeTab, setActiveTab] = useState('details');
  const [showRegistration, setShowRegistration] = useState(false);
  const [showTicket, setShowTicket] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadEventData();
    
    // Auto-open registration if ?register=true
    if (searchParams.get('register') === 'true') {
      setShowRegistration(true);
    }
  }, [params.id]);

  const loadEventData = () => {
    setIsLoading(true);
    
    // Simulate loading delay
    setTimeout(() => {
      const eventData = getEventById(params.id);
      const eventRegistrations = getRegistrationsByEventId(params.id);
      const eventMedia = getMediaReportsByEventId(params.id);
      
      setEvent(eventData);
      setRegistrations(eventRegistrations);
      setMediaReports(eventMedia);
      setIsLoading(false);
    }, 500);
  };

  const handleRegistrationSuccess = (registration) => {
    setRegistrations(prev => [...prev, registration]);
    setShowRegistration(false);
    setShowTicket(registration);
  };

  const handleUploadSuccess = (reports) => {
    setMediaReports(prev => [...prev, ...reports]);
    loadEventData(); // Refresh data
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading event...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Event Not Found</h2>
          <p className="text-gray-600 mb-6">The event you're looking for doesn't exist.</p>
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

  const occupancy = calculateOccupancy(event);
  const status = getEventStatus(event);
  const canRegister = status === 'upcoming' && occupancy < 100;

  const getSeverityBadge = (severity) => {
    switch(severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

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
                <h1 className="text-2xl font-bold text-gray-900">{event.title}</h1>
                <p className="text-gray-600">Organized by {event.organizer}</p>
              </div>
            </div>
            
            {canRegister && (
              <button
                onClick={() => setShowRegistration(true)}
                className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:from-red-600 hover:to-orange-600 transition-all duration-200 flex items-center"
              >
                <Ticket className="w-5 h-5 mr-2" />
                Register Now
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Event Header Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-2">
              <p className="text-gray-600 mb-4">{event.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-5 h-5 mr-2" />
                  <div>
                    <div className="font-medium">Start: {formatDate(event.startAt)}</div>
                    <div className="text-sm">End: {formatDate(event.endAt)}</div>
                  </div>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-5 h-5 mr-2" />
                  <div>
                    <div className="font-medium">{event.venue}</div>
                    {event.location?.lat && (
                      <div className="text-sm">
                        {event.location.lat.toFixed(4)}, {event.location.lng.toFixed(4)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{registrations.length}</div>
                <div className="text-sm text-gray-600">/ {event.capacity} registered</div>
                <div className="text-xs text-gray-500 mt-1">{occupancy}% full</div>
              </div>
              
              <div className={`text-center p-3 rounded-lg ${
                status === 'upcoming' ? 'bg-blue-50 text-blue-700' :
                status === 'ongoing' ? 'bg-green-50 text-green-700' :
                'bg-gray-50 text-gray-700'
              }`}>
                <div className="font-medium capitalize">{status}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex">
              {[
                { id: 'details', label: 'Details', icon: Calendar },
                { id: 'attendees', label: `Attendees (${registrations.length})`, icon: Users },
                { id: 'media', label: `Media (${mediaReports.length})`, icon: Upload },
                { id: 'safety', label: 'Safety Info', icon: AlertTriangle }
              ].map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-6 py-4 font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'text-red-600 border-b-2 border-red-600 bg-red-50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <IconComponent className="w-4 h-4 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-6">
            {/* Details Tab */}
            {activeTab === 'details' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">About This Event</h3>
                  <p className="text-gray-600 leading-relaxed">{event.description}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Schedule</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center">
                        <Clock className="w-5 h-5 text-green-600 mr-2" />
                        <div>
                          <div className="font-medium">Event Starts</div>
                          <div className="text-sm text-gray-600">{formatDate(event.startAt)}</div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-5 h-5 text-red-600 mr-2" />
                        <div>
                          <div className="font-medium">Event Ends</div>
                          <div className="text-sm text-gray-600">{formatDate(event.endAt)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Venue Information</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <MapPin className="w-5 h-5 text-blue-600 mr-2" />
                      <span className="font-medium">{event.venue}</span>
                    </div>
                    {event.location?.lat && (
                      <p className="text-sm text-gray-600 ml-7">
                        Coordinates: {event.location.lat.toFixed(4)}, {event.location.lng.toFixed(4)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Attendees Tab */}
            {activeTab === 'attendees' && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Registered Attendees</h3>
                {registrations.length > 0 ? (
                  <div className="space-y-3">
                    {registrations.map((registration, index) => (
                      <div key={registration.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">
                            {index + 1}
                          </div>
                          <div className="ml-4">
                            <div className="font-medium">{registration.name}</div>
                            <div className="text-sm text-gray-600">{registration.contact}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-600">Registered</div>
                          <div className="text-xs text-gray-500">
                            {new Date(registration.registeredAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600">No attendees registered yet</p>
                  </div>
                )}
              </div>
            )}

            {/* Media Tab */}
            {activeTab === 'media' && (
              <div className="space-y-6">
                <UploadPanel eventId={event.id} onUploadSuccess={handleUploadSuccess} />
                
                {mediaReports.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Uploaded Media & Reports</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {mediaReports.map((report) => (
                        <div key={report.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityBadge(report.severity)}`}>
                              {report.severity.toUpperCase()}
                            </span>
                            {report.forwarded && (
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border-blue-200">
                                FORWARDED
                              </span>
                            )}
                          </div>
                          
                          {report.type === 'image' ? (
                            <img 
                              src={report.dataUrl} 
                              alt="Event media"
                              className="w-full h-32 object-cover rounded-lg mb-3"
                            />
                          ) : (
                            <video 
                              src={report.dataUrl}
                              className="w-full h-32 object-cover rounded-lg mb-3"
                              controls
                            />
                          )}
                          
                          {report.description && (
                            <p className="text-sm text-gray-600 mb-2">{report.description}</p>
                          )}
                          
                          <div className="text-xs text-gray-500">
                            Uploaded {new Date(report.uploadedAt).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Safety Tab */}
            {activeTab === 'safety' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Safety Guidelines</h3>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <h4 className="font-medium text-green-800 mb-2">General Safety Tips</h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• Stay aware of your surroundings at all times</li>
                      <li>• Follow event staff instructions and guidelines</li>
                      <li>• Keep emergency contacts easily accessible</li>
                      <li>• Report any suspicious activity immediately</li>
                      <li>• Stay hydrated and take breaks as needed</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Emergency Contacts</h3>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-red-800 mb-2">Emergency Services</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-red-700">Emergency:</span>
                            <span className="font-bold text-red-800">112</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-red-700">Police:</span>
                            <span className="font-bold text-red-800">100</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-red-700">Medical:</span>
                            <span className="font-bold text-red-800">108</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-red-800 mb-2">Event Organizer</h4>
                        <div className="text-sm text-red-700">
                          <div className="font-medium">{event.organizer}</div>
                          <div>Contact via event registration</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Incident Reporting</h3>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800 text-sm mb-3">
                      Use the Media tab above to report incidents with photos/videos. 
                      High-severity reports are automatically forwarded to local authorities.
                    </p>
                    <button
                      onClick={() => setActiveTab('media')}
                      className="bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-yellow-700 transition-colors"
                    >
                      Report Incident
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      {showRegistration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="max-w-md w-full">
            <RegistrationForm
              event={event}
              onSuccess={handleRegistrationSuccess}
              onCancel={() => setShowRegistration(false)}
            />
          </div>
        </div>
      )}

      {/* Ticket Modal */}
      {showTicket && (
        <TicketModal
          registration={showTicket}
          event={event}
          onClose={() => setShowTicket(null)}
        />
      )}
    </div>
  );
}
