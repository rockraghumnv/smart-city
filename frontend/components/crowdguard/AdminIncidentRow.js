'use client';

import { AlertTriangle, Clock, MapPin, ArrowRight, CheckCircle, X } from 'lucide-react';
import { formatDate } from '../../app/crowdguard/lib/storage';

export default function AdminIncidentRow({ incident, onResolve, onDismiss }) {
  const getSeverityIcon = () => {
    switch(incident.severity) {
      case 'high':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'medium':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'low':
        return <AlertTriangle className="w-5 h-5 text-green-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getSeverityBadge = () => {
    switch(incident.severity) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Header */}
          <div className="flex items-center mb-3">
            {getSeverityIcon()}
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium border ${getSeverityBadge()}`}>
              {incident.severity.toUpperCase()} SEVERITY
            </span>
            {incident.forwarded && (
              <span className="ml-2 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border-blue-200">
                FORWARDED
              </span>
            )}
          </div>

          {/* Content */}
          <div className="mb-3">
            <p className="font-medium text-gray-900 mb-1">Incident Report #{incident.id.slice(-8)}</p>
            {incident.description && (
              <p className="text-gray-600 text-sm mb-2">{incident.description}</p>
            )}
            
            <div className="flex items-center text-sm text-gray-500 space-x-4">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                <span>{formatDate(incident.uploadedAt || incident.forwardedAt)}</span>
              </div>
              
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                <span>Event ID: {incident.eventId}</span>
              </div>
            </div>
          </div>

          {/* Media Preview */}
          {incident.dataUrl && (
            <div className="mb-3">
              {incident.type === 'image' ? (
                <img 
                  src={incident.dataUrl} 
                  alt="Incident media"
                  className="w-20 h-20 object-cover rounded-lg border"
                />
              ) : (
                <video 
                  src={incident.dataUrl}
                  className="w-20 h-20 object-cover rounded-lg border"
                  controls={false}
                />
              )}
            </div>
          )}

          {/* Forwarding Info */}
          {incident.forwarded && (
            <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-3">
              <div className="flex items-center text-blue-800 text-sm">
                <ArrowRight className="w-4 h-4 mr-2" />
                <span className="font-medium">Forwarded to Local Authorities</span>
              </div>
              <p className="text-blue-700 text-xs mt-1">
                {formatDate(incident.forwardedAt)}
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="ml-4 flex flex-col space-y-2">
          {!incident.resolved && (
            <button
              onClick={() => onResolve(incident.id)}
              className="px-3 py-1 bg-green-600 text-white text-xs rounded-md hover:bg-green-700 transition-colors flex items-center"
            >
              <CheckCircle className="w-3 h-3 mr-1" />
              Resolve
            </button>
          )}
          
          <button
            onClick={() => onDismiss(incident.id)}
            className="px-3 py-1 bg-gray-600 text-white text-xs rounded-md hover:bg-gray-700 transition-colors flex items-center"
          >
            <X className="w-3 h-3 mr-1" />
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
