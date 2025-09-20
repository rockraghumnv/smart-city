'use client';

import { useState, useRef, useEffect } from 'react';
import { Camera, Check, X, AlertTriangle, Scan } from 'lucide-react';
import ProtectedRoute from '../../../components/ProtectedRoute';
import { validateTicket } from '../lib/qr';
import { getEventById, getRegistrations } from '../lib/storage';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

function QRScannerPage() {
  const [scanResult, setScanResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState('');
  const [manualCode, setManualCode] = useState('');
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Start camera for QR scanning
  const startCamera = async () => {
    try {
      setError('');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsScanning(true);
      }
    } catch (err) {
      setError('Camera access denied. Please use manual code entry.');
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  // Validate a ticket code
  const validateCode = async (code) => {
    try {
      const result = validateTicket(code);
        if (result.valid) {
        // Get event and registration details
        const event = getEventById(result.eventId);
        const registrations = getRegistrations();
        const registration = registrations.find(r => 
          r.eventId === result.eventId && r.userId === result.userId
        );

        setScanResult({
          ...result,
          event,
          registration,
          timestamp: new Date().toISOString()
        });
      } else {
        setScanResult({
          valid: false,
          error: result.error,
          timestamp: new Date().toISOString()
        });
      }
      setError('');
    } catch (err) {
      setError('Invalid QR code format');
      setScanResult(null);
    }
  };

  // Handle manual code submission
  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualCode.trim()) {
      validateCode(manualCode.trim());
      setManualCode('');
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Mock QR code detection (in real app, use a QR scanning library)
  const handleVideoClick = () => {
    // Simulate QR code detection - in real app, integrate with qr-scanner library
    const mockCode = 'eyJldmVudElkIjoiZXZ0XzEiLCJ1c2VySWQiOiJ1c2VyXzEiLCJ0aW1lc3RhbXAiOjE3MjY4MTkyMDB9';
    validateCode(mockCode);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
        {/* Back Arrow Header */}
        <div className="flex items-center mb-6">
          <Link href="/crowdguard" className="mr-4 p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">QR Ticket Scanner</h1>
        </div>
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Scan className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">QR Ticket Scanner</h1>
              <p className="text-gray-600">Scan or enter ticket codes to validate entry</p>
            </div>
          </div>

          {/* Scanner Section */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Camera Scanner</h2>
            
            {!isScanning ? (
              <div className="text-center">
                <button
                  onClick={startCamera}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 flex items-center gap-2 mx-auto"
                >
                  <Camera className="w-5 h-5" />
                  Start Camera
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div 
                  className="relative bg-black rounded-lg overflow-hidden cursor-pointer"
                  onClick={handleVideoClick}
                >
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 border-2 border-dashed border-white opacity-50 m-8 rounded-lg"></div>
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-lg text-sm">
                    Click to simulate QR detection
                  </div>
                </div>
                <button
                  onClick={stopCamera}
                  className="w-full bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Stop Camera
                </button>
              </div>
            )}
          </div>

          {/* Manual Entry */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Manual Code Entry</h2>
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <input
                type="text"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                placeholder="Enter ticket code..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-3 rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-200"
              >
                Validate Code
              </button>
            </form>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 text-red-800">
                <AlertTriangle className="w-5 h-5" />
                <span className="font-medium">{error}</span>
              </div>
            </div>
          )}

          {/* Scan Result */}
          {scanResult && (
            <div className={`rounded-2xl p-6 shadow-lg border mb-6 ${
              scanResult.valid 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center gap-3 mb-4">
                {scanResult.valid ? (
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="w-6 h-6 text-white" />
                  </div>
                ) : (
                  <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                    <X className="w-6 h-6 text-white" />
                  </div>
                )}
                <div>
                  <h3 className={`text-xl font-bold ${
                    scanResult.valid ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {scanResult.valid ? 'Valid Ticket' : 'Invalid Ticket'}
                  </h3>
                  <p className={`text-sm ${
                    scanResult.valid ? 'text-green-600' : 'text-red-600'
                  }`}>
                    Scanned at {new Date(scanResult.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>

              {scanResult.valid ? (
                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-4 border border-green-200">
                    <h4 className="font-semibold text-gray-900 mb-2">Event Details</h4>
                    <p className="text-lg font-medium text-gray-800">{scanResult.event?.title}</p>
                    <p className="text-gray-600">{scanResult.event?.location}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(scanResult.event?.date).toLocaleDateString()} at{' '}
                      {scanResult.event?.time}
                    </p>
                  </div>
                  
                  {scanResult.registration && (
                    <div className="bg-white rounded-lg p-4 border border-green-200">
                      <h4 className="font-semibold text-gray-900 mb-2">Attendee Information</h4>
                      <p className="text-gray-800">{scanResult.registration.attendeeName}</p>
                      <p className="text-gray-600">{scanResult.registration.email}</p>
                      <p className="text-sm text-gray-500">
                        Registered: {new Date(scanResult.registration.registeredAt).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-lg p-4 border border-red-200">
                  <p className="text-red-800 font-medium">{scanResult.error}</p>
                </div>
              )}
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Test Codes</h2>
            <p className="text-gray-600 mb-4">Use these sample codes to test the validation:</p>
            <div className="space-y-2">
              <button
                onClick={() => validateCode('eyJldmVudElkIjoiZXZ0XzEiLCJ1c2VySWQiOiJ1c2VyXzEiLCJ0aW1lc3RhbXAiOjE3MjY4MTkyMDB9')}
                className="w-full text-left px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-sm font-mono"
              >
                Valid Code: eyJldmVudElkIjoiZXZ0XzEiLCJ1c2VySWQiOiJ1c2VyXzEiLCJ0aW1lc3RhbXAiOjE3MjY4MTkyMDB9
              </button>
              <button
                onClick={() => validateCode('invalid-code-12345')}
                className="w-full text-left px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-sm font-mono"
              >
                Invalid Code: invalid-code-12345
              </button>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default QRScannerPage;
