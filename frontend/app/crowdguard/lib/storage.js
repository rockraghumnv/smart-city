// CrowdGuard data storage utilities
import { v4 as uuidv4 } from 'uuid';

// Storage keys
const STORAGE_KEYS = {
  EVENTS: 'crowdguard_events',
  REGISTRATIONS: 'crowdguard_registrations',
  MEDIA_REPORTS: 'crowdguard_media_reports',
  FORWARDED_INCIDENTS: 'crowdguard_forwarded_incidents',
  USER_PROFILE: 'crowdguard_user_profile'
};

// Sample data for initial load
const SAMPLE_EVENTS = [
  {
    id: 'evt-1',
    title: 'Indie Music Fest',
    description: 'Outdoor music event featuring local indie bands at MG Grounds. Experience great music in a safe environment.',
    venue: 'MG Grounds',
    location: { lat: 12.9716, lng: 77.5946 },
    startAt: '2025-10-10T17:00:00.000Z',
    endAt: '2025-10-10T22:00:00.000Z',
    capacity: 2000,
    organizer: 'College XYZ',
    attendees: ['reg-1', 'reg-2'],
    mediaReports: []
  },
  {
    id: 'evt-2',
    title: 'Tech Conference 2025',
    description: 'Annual technology conference with industry leaders and networking opportunities.',
    venue: 'Convention Center',
    location: { lat: 12.9698, lng: 77.6025 },
    startAt: '2025-11-15T09:00:00.000Z',
    endAt: '2025-11-15T18:00:00.000Z',
    capacity: 500,
    organizer: 'Tech Community',
    attendees: [],
    mediaReports: []
  },
  {
    id: 'evt-3',
    title: 'Food Festival',
    description: 'Street food festival with vendors from across the city. Family-friendly event.',
    venue: 'City Park',
    location: { lat: 12.9352, lng: 77.6245 },
    startAt: '2025-09-25T11:00:00.000Z',
    endAt: '2025-09-25T21:00:00.000Z',
    capacity: 1500,
    organizer: 'City Council',
    attendees: ['reg-3'],
    mediaReports: []
  }
];

const SAMPLE_REGISTRATIONS = [
  {
    id: 'reg-1',
    eventId: 'evt-1',
    name: 'John Doe',
    contact: 'john@example.com',
    registeredAt: '2025-09-15T10:00:00.000Z',
    ticketId: 'ticket-1'
  },
  {
    id: 'reg-2',
    eventId: 'evt-1',
    name: 'Jane Smith',
    contact: 'jane@example.com',
    registeredAt: '2025-09-16T14:30:00.000Z',
    ticketId: 'ticket-2'
  },
  {
    id: 'reg-3',
    eventId: 'evt-3',
    name: 'Mike Johnson',
    contact: 'mike@example.com',
    registeredAt: '2025-09-20T09:15:00.000Z',
    ticketId: 'ticket-3'
  }
];

// Sample media reports for demo
const SAMPLE_MEDIA_REPORTS = [
  {
    id: 'report-1',
    eventId: 'evt-1',
    type: 'image',
    dataUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2Y3OTQ5NCIvPgogIDx0ZXh0IHg9IjEwMCIgeT0iNTUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+SW5jaWRlbnQgUmVwb3J0PC90ZXh0Pgo8L3N2Zz4K',
    description: 'Overcrowding near main stage area, people struggling to move',
    severity: 'high',
    uploadedAt: '2025-01-10T18:30:00.000Z',
    forwarded: true,
    forwardedAt: '2025-01-10T18:35:00.000Z'
  },
  {
    id: 'report-2',
    eventId: 'evt-1',
    type: 'image',
    dataUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2ZiYmYyNCIvPgogIDx0ZXh0IHg9IjEwMCIgeT0iNTUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzc4MzUwZiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+TWVkaXVtIEFsZXJ0PC90ZXh0Pgo8L3N2Zz4K',
    description: 'Broken barrier near entrance, potential safety hazard',
    severity: 'medium',
    uploadedAt: '2025-01-10T17:45:00.000Z',
    forwarded: false
  },
  {
    id: 'report-3',
    eventId: 'evt-2',
    type: 'image',
    dataUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzIyYzU1ZSIvPgogIDx0ZXh0IHg9IjEwMCIgeT0iNTUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+R29vZCBDcm93ZDwvdGV4dD4KICA8L3N2Zz4K',
    description: 'Great crowd atmosphere, everyone enjoying the tech talks',
    severity: 'low',
    uploadedAt: '2025-01-09T14:20:00.000Z',
    forwarded: false,
    resolved: true,
    resolvedAt: '2025-01-09T14:25:00.000Z'
  }
];

// Sample forwarded incidents
const SAMPLE_FORWARDED_INCIDENTS = [
  {
    id: 'report-1',
    eventId: 'evt-1',
    type: 'image',
    dataUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2Y3OTQ5NCIvPgogIDx0ZXh0IHg9IjEwMCIgeT0iNTUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+SW5jaWRlbnQgUmVwb3J0PC90ZXh0Pgo8L3N2Zz4K',
    description: 'Overcrowding near main stage area, people struggling to move',
    severity: 'high',
    uploadedAt: '2025-01-10T18:30:00.000Z',
    forwarded: true,
    forwardedAt: '2025-01-10T18:35:00.000Z'
  }
];

// Initialize storage with sample data if empty
export function initializeStorage() {
  if (typeof window === 'undefined') return;
  
  if (!localStorage.getItem(STORAGE_KEYS.EVENTS)) {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(SAMPLE_EVENTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.REGISTRATIONS)) {
    localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(SAMPLE_REGISTRATIONS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.MEDIA_REPORTS)) {
    localStorage.setItem(STORAGE_KEYS.MEDIA_REPORTS, JSON.stringify(SAMPLE_MEDIA_REPORTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.FORWARDED_INCIDENTS)) {
    localStorage.setItem(STORAGE_KEYS.FORWARDED_INCIDENTS, JSON.stringify(SAMPLE_FORWARDED_INCIDENTS));
  }
}

// Events
export function getEvents() {
  if (typeof window === 'undefined') return SAMPLE_EVENTS;
  const events = localStorage.getItem(STORAGE_KEYS.EVENTS);
  return events ? JSON.parse(events) : SAMPLE_EVENTS;
}

export function saveEvent(event) {
  if (typeof window === 'undefined') return;
  const events = getEvents();
  const existingIndex = events.findIndex(e => e.id === event.id);
  
  if (existingIndex >= 0) {
    events[existingIndex] = event;
  } else {
    events.push(event);
  }
  
  localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
  return event;
}

export function getEventById(id) {
  const events = getEvents();
  return events.find(e => e.id === id);
}

// Registrations
export function getRegistrations() {
  if (typeof window === 'undefined') return SAMPLE_REGISTRATIONS;
  const registrations = localStorage.getItem(STORAGE_KEYS.REGISTRATIONS);
  return registrations ? JSON.parse(registrations) : SAMPLE_REGISTRATIONS;
}

export function saveRegistration(registration) {
  if (typeof window === 'undefined') return;
  const registrations = getRegistrations();
  registrations.push(registration);
  localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(registrations));
  
  // Also update event attendees
  const events = getEvents();
  const event = events.find(e => e.id === registration.eventId);
  if (event) {
    event.attendees.push(registration.id);
    saveEvent(event);
  }
  
  return registration;
}

export function getRegistrationById(id) {
  const registrations = getRegistrations();
  return registrations.find(r => r.id === id);
}

export function getRegistrationsByEventId(eventId) {
  const registrations = getRegistrations();
  return registrations.filter(r => r.eventId === eventId);
}

// Media Reports
export function getMediaReports() {
  if (typeof window === 'undefined') return [];
  const reports = localStorage.getItem(STORAGE_KEYS.MEDIA_REPORTS);
  return reports ? JSON.parse(reports) : [];
}

export function saveMediaReport(report) {
  if (typeof window === 'undefined') return;
  const reports = getMediaReports();
  reports.push(report);
  localStorage.setItem(STORAGE_KEYS.MEDIA_REPORTS, JSON.stringify(reports));
  
  // Auto-forward high severity incidents
  if (report.severity === 'high') {
    forwardIncident(report);
  }
  
  return report;
}

export function getMediaReportsByEventId(eventId) {
  const reports = getMediaReports();
  return reports.filter(r => r.eventId === eventId);
}

// Forwarded Incidents
export function getForwardedIncidents() {
  if (typeof window === 'undefined') return [];
  const incidents = localStorage.getItem(STORAGE_KEYS.FORWARDED_INCIDENTS);
  return incidents ? JSON.parse(incidents) : [];
}

export function forwardIncident(report) {
  if (typeof window === 'undefined') return;
  
  const forwardedReport = {
    ...report,
    forwarded: true,
    forwardedAt: new Date().toISOString(),
    id: report.id || uuidv4()
  };
  
  const incidents = getForwardedIncidents();
  incidents.push(forwardedReport);
  localStorage.setItem(STORAGE_KEYS.FORWARDED_INCIDENTS, JSON.stringify(incidents));
  
  // Update original report
  const reports = getMediaReports();
  const reportIndex = reports.findIndex(r => r.id === report.id);
  if (reportIndex >= 0) {
    reports[reportIndex] = forwardedReport;
    localStorage.setItem(STORAGE_KEYS.MEDIA_REPORTS, JSON.stringify(reports));
  }
  
  return forwardedReport;
}

// Utility functions
export function generateId() {
  return uuidv4();
}

export function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function isEventUpcoming(event) {
  return new Date(event.startAt) > new Date();
}

export function getEventStatus(event) {
  const now = new Date();
  const start = new Date(event.startAt);
  const end = new Date(event.endAt);
  
  if (now < start) return 'upcoming';
  if (now >= start && now <= end) return 'ongoing';
  return 'past';
}

export function calculateOccupancy(event) {
  return Math.round((event.attendees.length / event.capacity) * 100);
}
