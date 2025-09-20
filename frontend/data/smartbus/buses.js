// Bus demo data with coordinates and live tracking simulation
export const busRoutes = [
  {
    number: "360",
    name: "Majestic - Domlur Express",
    route: ["Majestic", "Corporation", "Richmond Circle", "Brigade Road", "Domlur"],
    frequency: "Every 15 min",
    fare: "₹25",
    type: "Regular",
    color: "#3B82F6",
    coordinates: [
      { lat: 12.9767, lng: 77.5711, stop: "Majestic" },
      { lat: 12.9766, lng: 77.5946, stop: "Corporation" },
      { lat: 12.9698, lng: 77.5986, stop: "Richmond Circle" },
      { lat: 12.9698, lng: 77.6025, stop: "Brigade Road" },
      { lat: 12.9279, lng: 77.6271, stop: "Domlur" }
    ]
  },
  {
    number: "G3",
    name: "Majestic - Shivajinagar Metro",
    route: ["Majestic", "MG Road", "Brigade Road", "Shivajinagar"],
    frequency: "Every 10 min",
    fare: "₹20",
    type: "Metro Feeder",
    color: "#10B981",
    coordinates: [
      { lat: 12.9767, lng: 77.5711, stop: "Majestic" },
      { lat: 12.9759, lng: 77.6063, stop: "MG Road" },
      { lat: 12.9698, lng: 77.6025, stop: "Brigade Road" },
      { lat: 12.9812, lng: 77.6006, stop: "Shivajinagar" }
    ]
  },
  {
    number: "365",
    name: "Majestic - Electronic City",
    route: ["Majestic", "Koramangala", "Silk Board", "Electronic City"],
    frequency: "Every 20 min",
    fare: "₹30",
    type: "Long Distance",
    color: "#8B5CF6",
    coordinates: [
      { lat: 12.9767, lng: 77.5711, stop: "Majestic" },
      { lat: 12.9352, lng: 77.6245, stop: "Koramangala" },
      { lat: 12.9177, lng: 77.6226, stop: "Silk Board" },
      { lat: 12.8446, lng: 77.6595, stop: "Electronic City" }
    ]
  },
  {
    number: "500C",
    name: "Kempegowda - Electronic City",
    route: ["Kempegowda Bus Station", "Banashankari", "BTM Layout", "Electronic City"],
    frequency: "Every 12 min",
    fare: "₹35",
    type: "City Connect",
    color: "#F59E0B",
    coordinates: [
      { lat: 12.9767, lng: 77.5711, stop: "Kempegowda Bus Station" },
      { lat: 12.9248, lng: 77.5536, stop: "Banashankari" },
      { lat: 12.9165, lng: 77.6101, stop: "BTM Layout" },
      { lat: 12.8446, lng: 77.6595, stop: "Electronic City" }
    ]
  },
  {
    number: "AC-125",
    name: "Airport - City Centre",
    route: ["Airport", "Hebbal", "Yeshwanthpur", "Malleswaram", "City Centre"],
    frequency: "Every 25 min",
    fare: "₹50",
    type: "AC Premium",
    color: "#EF4444",
    coordinates: [
      { lat: 13.1986, lng: 77.7066, stop: "Airport" },
      { lat: 13.0358, lng: 77.5970, stop: "Hebbal" },
      { lat: 13.0225, lng: 77.5348, stop: "Yeshwanthpur" },
      { lat: 12.9915, lng: 77.5712, stop: "Malleswaram" },
      { lat: 12.9759, lng: 77.6063, stop: "City Centre" }
    ]
  }
];

// Live bus instances with real-time positions
export const liveBusInstances = [
  {
    id: "360-001",
    busNumber: "360",
    currentPosition: { lat: 12.9767, lng: 77.5711 },
    currentStop: "Majestic",
    nextStop: "Corporation",
    crowdStatus: "High",
    crowdCount: 45,
    capacity: 50,
    speed: 25,
    eta: "8 min",
    direction: "towards Domlur",
    delay: 2,
    isMoving: true,
    lastUpdated: new Date().toISOString()
  },
  {
    id: "G3-002",
    busNumber: "G3",
    currentPosition: { lat: 12.9759, lng: 77.6063 },
    currentStop: "MG Road",
    nextStop: "Brigade Road",
    crowdStatus: "Medium",
    crowdCount: 28,
    capacity: 40,
    speed: 30,
    eta: "3 min",
    direction: "towards Shivajinagar",
    delay: 0,
    isMoving: true,
    lastUpdated: new Date().toISOString()
  },
  {
    id: "365-003",
    busNumber: "365",
    currentPosition: { lat: 12.9352, lng: 77.6245 },
    currentStop: "Koramangala",
    nextStop: "Silk Board",
    crowdStatus: "Low",
    crowdCount: 15,
    capacity: 45,
    speed: 35,
    eta: "12 min",
    direction: "towards Electronic City",
    delay: -3,
    isMoving: false,
    lastUpdated: new Date().toISOString()
  },
  {
    id: "500C-004",
    busNumber: "500C",
    currentPosition: { lat: 12.9248, lng: 77.5536 },
    currentStop: "Banashankari",
    nextStop: "BTM Layout",
    crowdStatus: "Medium",
    crowdCount: 32,
    capacity: 48,
    speed: 28,
    eta: "5 min",
    direction: "towards Electronic City",
    delay: 1,
    isMoving: true,
    lastUpdated: new Date().toISOString()
  },
  {
    id: "AC-125-005",
    busNumber: "AC-125",
    currentPosition: { lat: 13.0358, lng: 77.5970 },
    currentStop: "Hebbal",
    nextStop: "Yeshwanthpur",
    crowdStatus: "Low",
    crowdCount: 12,
    capacity: 35,
    speed: 40,
    eta: "15 min",
    direction: "towards City Centre",
    delay: 0,
    isMoving: true,
    lastUpdated: new Date().toISOString()
  }
];

// Bus stops with detailed information
export const busStops = {
  "Majestic": {
    name: "Majestic Bus Terminal",
    coordinates: { lat: 12.9767, lng: 77.5711 },
    buses: ["360", "G3", "365"],
    facilities: ["Restroom", "Food Court", "ATM", "Waiting Area"],
    isTerminal: true,
    crowdLevel: "High"
  },
  "Corporation": {
    name: "Corporation Circle",
    coordinates: { lat: 12.9766, lng: 77.5946 },
    buses: ["360"],
    facilities: ["Shelter", "Seating"],
    isTerminal: false,
    crowdLevel: "Medium"
  },
  "Richmond Circle": {
    name: "Richmond Circle",
    coordinates: { lat: 12.9698, lng: 77.5986 },
    buses: ["360"],
    facilities: ["Shelter"],
    isTerminal: false,
    crowdLevel: "Low"
  },
  "Brigade Road": {
    name: "Brigade Road Shopping District",
    coordinates: { lat: 12.9698, lng: 77.6025 },
    buses: ["360", "G3"],
    facilities: ["Shelter", "ATM", "Shopping"],
    isTerminal: false,
    crowdLevel: "High"
  },
  "Domlur": {
    name: "Domlur Junction",
    coordinates: { lat: 12.9279, lng: 77.6271 },
    buses: ["360"],
    facilities: ["Shelter", "Metro Connection"],
    isTerminal: true,
    crowdLevel: "Medium"
  },
  "MG Road": {
    name: "MG Road Metro Station",
    coordinates: { lat: 12.9759, lng: 77.6063 },
    buses: ["G3"],
    facilities: ["Metro Connection", "Food Court", "ATM"],
    isTerminal: false,
    crowdLevel: "High"
  },
  "Shivajinagar": {
    name: "Shivajinagar Metro",
    coordinates: { lat: 12.9812, lng: 77.6006 },
    buses: ["G3"],
    facilities: ["Metro Connection", "Parking"],
    isTerminal: true,
    crowdLevel: "Medium"
  },
  "Koramangala": {
    name: "Koramangala 5th Block",
    coordinates: { lat: 12.9352, lng: 77.6245 },
    buses: ["365"],
    facilities: ["Shelter", "Shopping", "Restaurants"],
    isTerminal: false,
    crowdLevel: "High"
  },
  "Silk Board": {
    name: "Silk Board Junction",
    coordinates: { lat: 12.9177, lng: 77.6226 },
    buses: ["365"],
    facilities: ["Shelter", "Flyover"],
    isTerminal: false,
    crowdLevel: "Medium"
  },
  "Electronic City": {
    name: "Electronic City Phase 1",
    coordinates: { lat: 12.8446, lng: 77.6595 },
    buses: ["365", "500C"],
    facilities: ["Terminal", "Food Court", "ATM", "IT Park"],
    isTerminal: true,
    crowdLevel: "High"
  },
  "Kempegowda Bus Station": {
    name: "Kempegowda Bus Station",
    coordinates: { lat: 12.9767, lng: 77.5711 },
    buses: ["500C"],
    facilities: ["Main Terminal", "Restroom", "Food Court", "ATM"],
    isTerminal: true,
    crowdLevel: "High"
  },
  "Banashankari": {
    name: "Banashankari Temple",
    coordinates: { lat: 12.9248, lng: 77.5536 },
    buses: ["500C"],
    facilities: ["Temple", "Shelter", "Market"],
    isTerminal: false,
    crowdLevel: "Medium"
  },
  "BTM Layout": {
    name: "BTM Layout 1st Stage",
    coordinates: { lat: 12.9165, lng: 77.6101 },
    buses: ["500C"],
    facilities: ["Shelter", "Shopping Complex"],
    isTerminal: false,
    crowdLevel: "Medium"
  },
  "Airport": {
    name: "Kempegowda International Airport",
    coordinates: { lat: 13.1986, lng: 77.7066 },
    buses: ["AC-125"],
    facilities: ["Airport Terminal", "Taxi Stand", "Hotel"],
    isTerminal: true,
    crowdLevel: "High"
  },
  "Hebbal": {
    name: "Hebbal Flyover",
    coordinates: { lat: 13.0358, lng: 77.5970 },
    buses: ["AC-125"],
    facilities: ["Flyover", "Fuel Station"],
    isTerminal: false,
    crowdLevel: "Low"
  },
  "Yeshwanthpur": {
    name: "Yeshwanthpur Railway Station",
    coordinates: { lat: 13.0225, lng: 77.5348 },
    buses: ["AC-125"],
    facilities: ["Railway Station", "Food Court", "Parking"],
    isTerminal: false,
    crowdLevel: "High"
  },
  "Malleswaram": {
    name: "Malleswaram Circle",
    coordinates: { lat: 12.9915, lng: 77.5712 },
    buses: ["AC-125"],
    facilities: ["Market", "Temple", "Shelter"],
    isTerminal: false,
    crowdLevel: "Medium"
  },
  "City Centre": {
    name: "City Centre Mall",
    coordinates: { lat: 12.9759, lng: 77.6063 },
    buses: ["AC-125"],
    facilities: ["Shopping Mall", "Cinema", "Restaurants"],
    isTerminal: true,
    crowdLevel: "High"
  }
};

// Simulation functions for live updates
export const simulateBusMovement = (busInstance) => {
  const route = busRoutes.find(r => r.number === busInstance.busNumber);
  if (!route) return busInstance;

  // Simulate movement along the route
  const currentStopIndex = route.coordinates.findIndex(
    coord => coord.stop === busInstance.currentStop
  );
  
  if (currentStopIndex === -1 || currentStopIndex === route.coordinates.length - 1) {
    return busInstance;
  }

  const nextCoordinate = route.coordinates[currentStopIndex + 1];
  
  // Simulate gradual movement towards next stop
  const progress = Math.random() * 0.1; // Random progress
  const newLat = busInstance.currentPosition.lat + 
    (nextCoordinate.lat - busInstance.currentPosition.lat) * progress;
  const newLng = busInstance.currentPosition.lng + 
    (nextCoordinate.lng - busInstance.currentPosition.lng) * progress;

  return {
    ...busInstance,
    currentPosition: { lat: newLat, lng: newLng },
    speed: Math.max(15, Math.min(50, busInstance.speed + (Math.random() - 0.5) * 10)),
    crowdCount: Math.max(0, Math.min(busInstance.capacity, 
      busInstance.crowdCount + Math.floor((Math.random() - 0.5) * 5))),
    lastUpdated: new Date().toISOString()
  };
};

// Get crowd status based on count and capacity
export const getCrowdStatus = (count, capacity) => {
  const percentage = (count / capacity) * 100;
  if (percentage < 30) return 'Low';
  if (percentage < 70) return 'Medium';
  return 'High';
};

// Get ETA in a readable format
export const formatETA = (minutes) => {
  if (minutes < 1) return "Arriving now";
  if (minutes < 60) return `${Math.round(minutes)} min`;
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return `${hours}h ${mins}m`;
};
