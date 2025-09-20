// QR code generation and ticket utilities
import QRCode from 'react-qr-code';

export function generateTicketQR(registration, event) {
  const qrPayload = {
    ticketId: registration.ticketId,
    eventId: registration.eventId,
    registrationId: registration.id,
    issuedAt: registration.registeredAt,
    eventTitle: event.title,
    venue: event.venue
  };
  
  return JSON.stringify(qrPayload);
}

export function validateTicketQR(qrString) {
  try {
    const data = JSON.parse(qrString);
    
    // Validate required fields
    if (!data.ticketId || !data.eventId || !data.registrationId) {
      return { valid: false, error: 'Invalid QR code format' };
    }
    
    // Check if registration exists in localStorage
    const registrations = JSON.parse(localStorage.getItem('crowdguard_registrations') || '[]');
    const registration = registrations.find(r => r.id === data.registrationId);
    
    if (!registration) {
      return { valid: false, error: 'Registration not found' };
    }
    
    // Check if ticket ID matches
    if (registration.ticketId !== data.ticketId) {
      return { valid: false, error: 'Ticket ID mismatch' };
    }
    
    return { 
      valid: true, 
      data: data,
      registration: registration
    };
  } catch (error) {
    return { valid: false, error: 'Invalid QR code format' };
  }
}

export function downloadQRAsImage(qrRef, filename = 'ticket-qr.png') {
  if (!qrRef.current) return;
  
  const svg = qrRef.current.querySelector('svg');
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const data = new XMLSerializer().serializeToString(svg);
  const img = new Image();
  
  img.onload = function() {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL();
    link.click();
  };
  
  img.src = 'data:image/svg+xml;base64,' + btoa(data);
}
