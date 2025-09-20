'use client';

import { useRef } from 'react';
import QRCode from 'react-qr-code';
import { Download, X, Ticket, Calendar, MapPin, User } from 'lucide-react';
import { generateTicketQR, downloadQRAsImage } from '../../app/crowdguard/lib/qr';
import { formatDate } from '../../app/crowdguard/lib/storage';

export default function TicketModal({ registration, event, onClose }) {
  const qrRef = useRef();
  const qrValue = generateTicketQR(registration, event);

  const handleDownload = () => {
    downloadQRAsImage(qrRef, `ticket-${registration.ticketId}.png`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Ticket className="w-8 h-8 mr-3" />
              <div>
                <h2 className="text-xl font-bold">Event Ticket</h2>
                <p className="text-red-100">Your entry pass</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-red-100 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Ticket Content */}
        <div className="p-6">
          {/* QR Code */}
          <div className="text-center mb-6" ref={qrRef}>
            <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300 inline-block">
              <QRCode
                value={qrValue}
                size={180}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Scan this QR code at the event entrance
            </p>
          </div>

          {/* Ticket Details */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Ticket ID</span>
              <span className="font-mono text-sm font-medium">{registration.ticketId}</span>
            </div>

            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <User className="w-4 h-4 text-gray-600 mr-3" />
              <div>
                <div className="font-medium">{registration.name}</div>
                <div className="text-sm text-gray-600">{registration.contact}</div>
              </div>
            </div>

            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <Calendar className="w-4 h-4 text-gray-600 mr-3" />
              <div>
                <div className="font-medium">{event.title}</div>
                <div className="text-sm text-gray-600">{formatDate(event.startAt)}</div>
              </div>
            </div>

            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <MapPin className="w-4 h-4 text-gray-600 mr-3" />
              <div>
                <div className="font-medium">{event.venue}</div>
                <div className="text-sm text-gray-600">Event Location</div>
              </div>
            </div>
          </div>

          {/* Important Notes */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-yellow-800 mb-2">Important Notes</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Present this QR code at the event entrance</li>
              <li>• Arrive 15 minutes before start time</li>
              <li>• Keep your ticket safe and secure</li>
              <li>• Contact organizer for any changes</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <button
              onClick={handleDownload}
              className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </button>
            <button
              onClick={handlePrint}
              className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Print Ticket
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
