// Sample data for initial demo
export const SAMPLE_ENTRIES = [
  {
    id: 'e1',
    date: '2025-09-19T07:00:00.000Z',
    type: 'water',
    value: 30,
    unit: 'L'
  },
  {
    id: 'e2',
    date: '2025-09-19T08:30:00.000Z',
    type: 'travel',
    value: 3,
    unit: 'km',
    meta: { mode: 'walk' }
  },
  {
    id: 'e3',
    date: '2025-09-18T21:00:00.000Z',
    type: 'electricity',
    value: 0.8,
    unit: 'kWh'
  },
  {
    id: 'e4',
    date: '2025-09-17T20:00:00.000Z',
    type: 'recycle',
    value: 1.2,
    unit: 'kg'
  },
  {
    id: 'e5',
    date: '2025-09-16T19:30:00.000Z',
    type: 'waste',
    value: 0.3,
    unit: 'kg'
  }
];

export const TIPS_DATA = [
  {
    id: 't1',
    title: 'Water Conservation',
    content: 'Take shorter showers to save 25-30 liters per minute. Every minute counts!',
    icon: '💧'
  },
  {
    id: 't2',
    title: 'Energy Saving',
    content: 'Unplug electronics when not in use. They consume standby power even when off.',
    icon: '⚡'
  },
  {
    id: 't3',
    title: 'Sustainable Transport',
    content: 'Choose walking or cycling for short distances. It\'s good for you and the planet!',
    icon: '🚲'
  },
  {
    id: 't4',
    title: 'Waste Reduction',
    content: 'Carry a reusable water bottle to reduce plastic waste by up to 1,000 bottles per year.',
    icon: '♻️'
  },
  {
    id: 't5',
    title: 'Smart Recycling',
    content: 'Separate your waste properly. Clean containers recycle more efficiently.',
    icon: '🗂️'
  }
];

export const PRESETS = {
  water: [
    { label: 'Quick shower (5 min)', value: 50 },
    { label: 'Normal shower (8 min)', value: 80 },
    { label: 'Long shower (12 min)', value: 120 },
    { label: 'Drink water (1 glass)', value: 0.25 },
    { label: 'Cooking meal', value: 10 }
  ],
  electricity: [
    { label: 'Phone charging (2 hours)', value: 0.05 },
    { label: 'Laptop use (4 hours)', value: 0.2 },
    { label: 'TV watching (3 hours)', value: 0.15 },
    { label: 'AC usage (1 hour)', value: 1.5 },
    { label: 'LED lights (6 hours)', value: 0.03 }
  ],
  travel: [
    { label: 'Walk to nearby shop', value: 1, mode: 'walk' },
    { label: 'Bike to college', value: 5, mode: 'bike' },
    { label: 'Bus commute', value: 8, mode: 'bus' },
    { label: 'Auto/taxi ride', value: 6, mode: 'car' },
    { label: 'Metro journey', value: 12, mode: 'bus' }
  ],
  waste: [
    { label: 'Daily food waste', value: 0.2 },
    { label: 'Packaging waste', value: 0.1 },
    { label: 'General household waste', value: 0.5 }
  ],
  recycle: [
    { label: 'Plastic bottles', value: 0.5 },
    { label: 'Paper/cardboard', value: 1.0 },
    { label: 'Glass containers', value: 0.8 },
    { label: 'Electronic waste', value: 2.0 }
  ]
};

export const BADGE_DEFINITIONS = [
  {
    id: 'water_saver',
    name: 'Water Saver',
    description: 'Used ≤50L water for 3 consecutive days',
    icon: '💧',
    color: 'blue'
  },
  {
    id: 'eco_rider',
    name: 'Eco Rider',
    description: 'Used public transport/walked 5 times in 7 days',
    icon: '🚲',
    color: 'green'
  },
  {
    id: 'recycler',
    name: 'Super Recycler',
    description: 'Recycled ≥5kg in a month',
    icon: '♻️',
    color: 'emerald'
  },
  {
    id: 'energy_conscious',
    name: 'Energy Conscious',
    description: 'Kept electricity usage under 3kWh for 5 days',
    icon: '⚡',
    color: 'yellow'
  },
  {
    id: 'waste_warrior',
    name: 'Waste Warrior',
    description: 'Generated less than 0.3kg waste for a week',
    icon: '🗑️',
    color: 'purple'
  }
];

export const MISSIONS = [
  {
    id: 'm1',
    title: 'Eco Commuter',
    description: 'Use public transport or walk 3 times this week',
    target: 3,
    type: 'travel_eco',
    icon: '🚌'
  },
  {
    id: 'm2',
    title: 'Water Mindful',
    description: 'Keep daily water usage under 75L for 5 days',
    target: 5,
    type: 'water_limit',
    icon: '💧'
  },
  {
    id: 'm3',
    title: 'Zero Waste Week',
    description: 'Log waste reduction activities 4 times',
    target: 4,
    type: 'waste_reduction',
    icon: '♻️'
  }
];

// Export everything as a single object for easy importing
export const sampleData = {
  entries: SAMPLE_ENTRIES,
  badges: BADGE_DEFINITIONS,
  presets: PRESETS,
  tips: TIPS_DATA,
  missions: MISSIONS
};
