'use client';

import { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css'; // ✅ IMPORTANT
import { MapPin, Bus, Navigation, Zap, Clock } from 'lucide-react';
import { busRoutes, liveBusInstances } from '@/data/smartbus/buses';

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Polyline = dynamic(() => import('react-leaflet').then(mod => mod.Polyline), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

export default function BusMap({
  buses = busRoutes,
  liveInstances = liveBusInstances,
  selectedBus = null,
  onBusSelect = () => {},
  center = [12.9716, 77.5946],
  zoom = 12
}) {
  const [map, setMap] = useState(null);

  // Memoize icons so they're only created on client
  const { busIcon, busStandIcon } = useMemo(() => {
    if (typeof window === 'undefined') return {};
    // Dynamically require leaflet only on client
    const L = require('leaflet');
    return {
      busIcon: L.icon({
        iconUrl: '/leaflet/bus.png',
        iconRetinaUrl: '/leaflet/bus.png',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
        shadowUrl: '/leaflet/marker-shadow.png',
        shadowSize: [41, 41],
        shadowAnchor: [13, 41]
      }),
      busStandIcon: L.icon({
        iconUrl: '/leaflet/bus-stop.png',
        iconRetinaUrl: '/leaflet/bus-stop.png',
        iconSize: [28, 28],
        iconAnchor: [14, 28],
        popupAnchor: [0, -28],
        shadowUrl: '/leaflet/marker-shadow.png',
        shadowSize: [41, 41],
        shadowAnchor: [13, 41]
      })
    };
  }, []);

  useEffect(() => {
    if (map) {
      setTimeout(() => {
        map.invalidateSize();
      }, 500);
    }
  }, [map]);

  // Fix Leaflet default icon path for markers
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('leaflet').then(L => {
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: '/leaflet/marker-icon-2x.png',
          iconUrl: '/leaflet/marker-icon.png',
          shadowUrl: '/leaflet/marker-shadow.png',
        });
      });
    }
  }, []);

  // Helper: get color for each route
  const getRouteColor = (busNumber) => {
    const colors = {
      '360': '#3B82F6',
      'G3': '#10B981',
      '365': '#8B5CF6',
      '500C': '#F59E0B',
      'AC-125': '#EF4444'
    };
    return colors[busNumber] || '#6B7280';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Map Header */}
      <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <Navigation className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Live Bus Tracking</h3>
            <p className="text-sm text-gray-600">Real-time positions and routes</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span>Live Updates</span>
          </div>
          <button className="p-2 bg-white rounded-lg border hover:bg-gray-50 transition-colors">
            <Zap className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
      {/* Map Container */}
      <div className="w-full h-[400px]">
        <MapContainer
          center={center}
          zoom={zoom}
          style={{ height: "100%", width: "100%" }}
          whenCreated={setMap}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          {/* Bus Routes */}
          {buses.map((bus) => (
            <Polyline
              key={`route-${bus.number}`}
              positions={bus.coordinates.map(coord => [coord.lat, coord.lng])}
              color={getRouteColor(bus.number)}
              weight={3}
              opacity={selectedBus === bus.number ? 1 : 0.6}
              dashArray={selectedBus === bus.number ? undefined : "5, 10"}
            />
          ))}
          {/* Bus Stops */}
          {buses.flatMap(bus =>
            bus.coordinates.map((coord, index) => (
              <Marker
                key={`stop-${bus.number}-${index}`}
                position={[coord.lat, coord.lng]}
                icon={busStandIcon || undefined}
              >
                <Popup>
                  <div className="text-center">
                    <h4 className="font-bold text-gray-900 mb-1">{coord.stop}</h4>
                    <p className="text-sm text-gray-600 mb-2">Bus {bus.number} Route</p>
                    <div className="flex items-center justify-center space-x-2 text-xs">
                      <MapPin className="w-3 h-3" />
                      <span>{coord.lat.toFixed(4)}, {coord.lng.toFixed(4)}</span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))
          )}
          {/* Live Bus Instances */}
          {liveInstances.map((instance) => {
            const bus = buses.find(b => b.number === instance.busNumber);
            return (
              <Marker
                key={instance.id}
                position={[instance.currentPosition.lat, instance.currentPosition.lng]}
                icon={busIcon || undefined}
                eventHandlers={{
                  click: () => onBusSelect(instance.busNumber)
                }}
              >
                <Popup>
                  <div className="min-w-[200px]">
                    <div className="flex items-center space-x-2 mb-2">
                      <Bus className="w-4 h-4 text-blue-600" />
                      <h4 className="font-bold text-gray-900">Bus {instance.busNumber}</h4>
                      <div className={`w-2 h-2 rounded-full ${
                        instance.isMoving ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                      }`}></div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Current Stop:</span>
                        <span className="font-medium">{instance.currentStop}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Next Stop:</span>
                        <span className="font-medium">{instance.nextStop}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Crowd:</span>
                        <span className={`font-medium ${
                          instance.crowdStatus === 'Low' ? 'text-green-600' :
                          instance.crowdStatus === 'Medium' ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {instance.crowdStatus}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">ETA:</span>
                        <span className="font-medium flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {instance.eta}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Speed:</span>
                        <span className="font-medium">{instance.speed} km/h</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Passengers:</span>
                        <span className="font-medium">
                          {instance.crowdCount}/{instance.capacity}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => onBusSelect(instance.busNumber)}
                      className="w-full mt-3 bg-blue-600 text-white py-1 px-3 rounded text-sm hover:bg-blue-700 transition-colors"
                    >
                      Track This Bus
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
      {/* Map Legend */}
      <div className="p-4 border-t bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span className="text-xs text-gray-600">Low Crowd</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
              <span className="text-xs text-gray-600">Medium Crowd</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <span className="text-xs text-gray-600">High Crowd</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Bus className="w-4 h-4 text-blue-600" />
              <span className="text-xs text-gray-600">Live Bus</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-gray-600" />
              <span className="text-xs text-gray-600">Bus Stop</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
