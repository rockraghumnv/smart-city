// Common utility functions for the smartbus components

export const getCrowdBadgeColor = (crowd) => {
  switch(crowd) {
    case 'Low': return 'bg-green-100 text-green-800 border-green-200';
    case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'High': return 'bg-red-100 text-red-800 border-red-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const getCrowdStatusColor = (status) => {
  switch(status) {
    case 'Low': return '#10B981';
    case 'Medium': return '#F59E0B';
    case 'High': return '#EF4444';
    default: return '#6B7280';
  }
};

export const getRouteColor = (busNumber) => {
  const colors = {
    '360': '#3B82F6',
    'G3': '#10B981',
    '365': '#8B5CF6',
    '500C': '#F59E0B',
    'AC-125': '#EF4444'
  };
  return colors[busNumber] || '#6B7280';
};

export const getBusTypeStyle = (type) => {
  switch(type) {
    case 'AC Premium':
      return 'bg-purple-100 text-purple-800';
    case 'Metro Feeder':
      return 'bg-green-100 text-green-800';
    case 'Long Distance':
      return 'bg-orange-100 text-orange-800';
    case 'City Connect':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const formatTime = (timeString) => {
  try {
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  } catch (error) {
    return timeString;
  }
};

export const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in kilometers
  return distance;
};

export const getETAColor = (eta) => {
  const minutes = parseInt(eta);
  if (minutes <= 5) return 'text-green-600';
  if (minutes <= 15) return 'text-yellow-600';
  return 'text-red-600';
};

export const getDelayStatus = (delay) => {
  if (delay > 5) return { status: 'delayed', color: 'text-red-600', bg: 'bg-red-50' };
  if (delay > 0) return { status: 'minor delay', color: 'text-yellow-600', bg: 'bg-yellow-50' };
  if (delay < -2) return { status: 'early', color: 'text-green-600', bg: 'bg-green-50' };
  return { status: 'on time', color: 'text-green-600', bg: 'bg-green-50' };
};

export const normalizeSearchQuery = (query) => {
  return query.trim().toLowerCase();
};

export const searchBuses = (buses, query) => {
  const normalizedQuery = normalizeSearchQuery(query);
  return buses.filter(bus => 
    bus.number.toLowerCase() === normalizedQuery ||
    bus.name?.toLowerCase().includes(normalizedQuery) ||
    bus.route.some(stop => stop.toLowerCase().includes(normalizedQuery))
  );
};

export const searchStops = (stops, query) => {
  const normalizedQuery = normalizeSearchQuery(query);
  return Object.keys(stops).filter(stop => 
    stop.toLowerCase().includes(normalizedQuery)
  );
};

export const generateMockRealtimeData = (baseInstance) => {
  // Simulate real-time changes
  return {
    ...baseInstance,
    speed: Math.max(15, Math.min(50, baseInstance.speed + (Math.random() - 0.5) * 10)),
    crowdCount: Math.max(0, Math.min(baseInstance.capacity, 
      baseInstance.crowdCount + Math.floor((Math.random() - 0.5) * 5))),
    delay: baseInstance.delay + Math.floor((Math.random() - 0.5) * 2),
    lastUpdated: new Date().toISOString()
  };
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
